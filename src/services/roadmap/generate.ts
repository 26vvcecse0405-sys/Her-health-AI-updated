import { careerById, prerequisites, skillById } from '../../data/catalog'
import { capstones, taskCatalog } from '../../data/taskCatalog'
import type { Difficulty, GapInsight, LearningStyle, Roadmap, RoadmapPhase, RoadmapTask, SkillId, StudentProfile, TaskTemplate } from '../../types'
import { uid } from '../learning/time'

const studyDays = 6

export function studyBudget(profile: StudentProfile) {
  return profile.minutesPerDay * profile.durationWeeks * studyDays
}

function band(score: number): Difficulty[] {
  if (score < 45) return ['foundation']
  if (score < 75) return ['foundation', 'intermediate']
  return ['intermediate', 'advanced']
}

function styleRank(style: LearningStyle, task: TaskTemplate) {
  if (style === 'mixed') return 0
  return task.style === style ? 0 : 1
}

function takeTasks(
  skillId: SkillId,
  score: number,
  style: LearningStyle,
  count: number,
  used: Set<string>,
  gaps: GapInsight[],
  minutesPerDay: number,
) {
  const allowed = new Set(band(score))
  const pool = taskCatalog.filter((task) => task.skillId === skillId && !used.has(task.id))
  const fitting = pool.filter((task) => allowed.has(task.difficulty))
  const chosen = (fitting.length > 0 ? fitting : pool)
    .slice()
    .sort((a, b) => styleRank(style, a) - styleRank(style, b) || a.minutes - b.minutes)
    .slice(0, count)
  const gap = gaps.find((item) => item.skillId === skillId)
  return chosen.map((task) => {
    used.add(task.id)
    const reason = gap
      ? `Scheduled because the ${skillById[skillId].label} gap is ${gap.gap} points (target ${gap.target}, demonstrated ${gap.demonstrated}). This ${task.difficulty} task is ${task.minutes} minutes, sized for a ${minutesPerDay}-minute day.`
      : `Included as career practice. It takes ${task.minutes} minutes.`
    const roadmapTask: RoadmapTask = {
      id: task.id,
      skillId: task.skillId,
      title: task.title,
      summary: task.summary,
      minutes: task.minutes,
      difficulty: task.difficulty,
      resource: task.resource,
      href: task.href,
      prerequisite: task.prerequisite,
      reason,
    }
    return roadmapTask
  })
}

function withPrereqs(ids: SkillId[], gaps: GapInsight[]) {
  const selected = [...ids]
  for (const skillId of ids) {
    for (const prior of prerequisites[skillId] ?? []) {
      const gap = gaps.find((item) => item.skillId === prior)
      if (gap && gap.gap > 0 && !selected.includes(prior)) selected.push(prior)
    }
  }
  return selected
}

function orderForPhase(skillIds: SkillId[], gaps: GapInsight[]) {
  const selected = new Set(skillIds)
  const ranked = skillIds.slice().sort((a, b) => {
    const gapA = gaps.find((gap) => gap.skillId === a)?.priority ?? 0
    const gapB = gaps.find((gap) => gap.skillId === b)?.priority ?? 0
    return gapB - gapA
  })
  const ordered: SkillId[] = []
  function visit(skillId: SkillId) {
    if (!selected.has(skillId) || ordered.includes(skillId)) return
    for (const prior of prerequisites[skillId] ?? []) {
      if (selected.has(prior)) visit(prior)
    }
    ordered.push(skillId)
  }
  for (const skillId of ranked) visit(skillId)
  return ordered
}

export function generateRoadmap(profile: StudentProfile, gaps: GapInsight[], generatedAt: string): Roadmap {
  const career = careerById[profile.career]
  const open = gaps.filter((gap) => gap.gap > 0).map((gap) => gap.skillId)
  const focus = open.length ? open.slice(0, 4) : career.core.slice(0, 3)
  const ordered = orderForPhase(withPrereqs(focus, gaps), gaps)
  const used = new Set<string>()
  const budget = studyBudget(profile)
  let spent = 0

  function collect(skillIds: SkillId[], perSkill: number) {
    const tasks: RoadmapTask[] = []
    for (const skillId of skillIds) {
      const score = gaps.find((gap) => gap.skillId === skillId)?.demonstrated ?? 0
      const picked = takeTasks(skillId, score, profile.learningStyle, perSkill, used, gaps, profile.minutesPerDay)
      for (const task of picked) {
        if (spent + task.minutes > budget) continue
        spent += task.minutes
        tasks.push(task)
      }
    }
    return tasks
  }

  const phases: RoadmapPhase[] = []
  const opening = collect(ordered, 2)
  const lead = ordered[0] ? skillById[ordered[0]].label : career.label
  if (opening.length) {
    const names = [...new Set(opening.map((task) => skillById[task.skillId].label))]
    phases.push({
      id: 'phase-foundation',
      title: 'Close the largest gaps',
      summary: `These tasks come first because ${names.join(' and ')} sit under the ${career.label} target.`,
      milestone: `Finish the first pass on ${lead}`,
      tasks: opening,
    })
  }
  const build = collect(ordered, 1)
  if (build.length) {
    phases.push({
      id: 'phase-practice',
      title: `Practice toward ${career.label}`,
      summary: 'A second pass on the same open skills, still taken from the catalog and still inside the study budget.',
      milestone: 'Complete the second pass',
      tasks: build,
    })
  }
  const cap = capstones.find((item) => item.career === profile.career)
  if (cap && spent + cap.minutes <= budget + 70) {
    phases.push({
      id: 'phase-capstone',
      title: 'Career project',
      summary: `A catalog project for ${career.label}. It is not written by a live model.`,
      milestone: cap.title,
      tasks: [
        {
          id: `cap-${cap.career}`,
          skillId: cap.skillId,
          title: cap.title,
          summary: cap.summary,
          minutes: cap.minutes,
          difficulty: 'advanced',
          resource: cap.resource,
          href: cap.href,
          prerequisite: opening[0]?.title ?? null,
          reason: `Added as the ${career.label} capstone after the gap tasks. It takes ${cap.minutes} minutes.`,
        },
      ],
    })
  }

  const top = gaps.find((gap) => gap.gap > 0) ?? gaps[0]
  const narrative = top
    ? `${profile.name} is preparing for ${career.label}. The highest-priority gap is ${skillById[top.skillId].label}: target ${top.target}, demonstrated ${top.demonstrated}. This plan is assembled from the task catalog using that gap, your ${profile.learningStyle} preference, and a budget of ${budget} minutes.`
    : `${profile.name} is at the catalog targets for ${career.label}. The remaining tasks are career practice, not a claim that a model invented a new course.`

  return {
    id: uid(),
    generatedAt,
    method: 'rules',
    methodNote:
      'Rules-based plan from the task catalog. It uses assessment scores, career targets, interests, learning style, and the study budget. It is not a live model generation.',
    narrative,
    budgetMinutes: budget,
    phases,
  }
}
