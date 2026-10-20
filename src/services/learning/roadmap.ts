import { capstones, careerById, deliveryLine, skillById, taskTemplates } from '../../data/catalog.ts'
import { scoreAnswers } from '../assessment/score.ts'
import { skillGaps } from './gaps.ts'
import { uid } from './time.ts'
import type { Difficulty, LearningStyle, Roadmap, RoadmapTask, StoredLearning, StudentProfile } from '../../types.ts'
import type { ScoredAttempt } from '../assessment/score.ts'

const levelOrder: Difficulty[] = ['foundation', 'intermediate', 'advanced']

function levelsFor(gap: number): Difficulty[] {
  if (gap <= 0) return []
  if (gap <= 15) return ['foundation']
  if (gap <= 35) return ['foundation', 'intermediate']
  return levelOrder
}

function styleMatch(style: LearningStyle, taskStyle: Exclude<LearningStyle, 'mixed'>) {
  if (style === 'mixed' || style === 'practice') return taskStyle === 'practice'
  return taskStyle === 'reading'
}

export function flatTasks(roadmap: Roadmap | null) {
  return roadmap?.phases.flatMap((phase) => phase.tasks) ?? []
}

export function prerequisiteMet(task: RoadmapTask, tasks: RoadmapTask[], completed: Record<string, string>) {
  if (!task.prerequisite) return true
  const listed = tasks.some((item) => item.id === task.prerequisite)
  if (!listed) return true
  return Boolean(completed[task.prerequisite])
}

export function assembleRoadmap(profile: StudentProfile, bySkill: ScoredAttempt['bySkill']): Roadmap {
  const career = careerById[profile.career]
  const gaps = skillGaps(profile, bySkill)
  const budgetMinutes = profile.minutesPerDay * profile.durationWeeks * 6
  const active = gaps.filter((gap) => gap.gap > 0)
  const focus = active.length > 0 ? active : gaps.filter((gap) => career.core.includes(gap.skillId)).slice(0, 1)
  const chosen: RoadmapTask[] = []
  let used = 0
  const stretch = active.length === 0

  for (const gap of focus) {
    const levels = stretch ? (['intermediate'] as Difficulty[]) : levelsFor(gap.gap)
    let previous: string | null = null
    for (const level of levels) {
      if (used >= budgetMinutes && chosen.length > 0) break
      const options = taskTemplates.filter((item) => item.skillId === gap.skillId && item.difficulty === level)
      const preferred = options.filter((item) => styleMatch(profile.learningStyle, item.style))
      const picked = preferred[0] ?? options[0]
      if (!picked) continue
      const matched = preferred.length > 0
      const reason = [
        gap.why,
        matched
          ? `This ${level} task matches your ${profile.learningStyle} preference.`
          : `This ${level} task is the catalog item for the gap. Your ${profile.learningStyle} preference changes how to use the resource, not the topic.`,
        deliveryLine(profile.learningStyle),
        `It takes ${picked.minutes} minutes inside a ${budgetMinutes}-minute budget.`,
      ].join(' ')
      chosen.push({
        id: picked.id,
        skillId: picked.skillId,
        title: picked.title,
        summary: `${picked.summary} ${deliveryLine(profile.learningStyle)}`,
        minutes: picked.minutes,
        difficulty: picked.difficulty,
        resource: picked.resource,
        href: picked.href,
        prerequisite: previous,
        reason,
      })
      previous = picked.id
      used += picked.minutes
    }
  }

  const capstone = capstones.find((item) => item.career === profile.career)
  if (capstone) {
    const last = [...chosen].reverse().find((task) => task.skillId === capstone.skillId)
    chosen.push({
      id: `capstone-${capstone.career}`,
      skillId: capstone.skillId,
      title: capstone.title,
      summary: capstone.summary,
      minutes: capstone.minutes,
      difficulty: 'advanced',
      resource: capstone.resource,
      href: capstone.href,
      prerequisite: last?.id ?? null,
      reason: `This is the destination project for ${career.label}. It sits after the skill tasks. The career target is study guidance, not a hiring bar. ${deliveryLine(profile.learningStyle)}`,
    })
    used += capstone.minutes
  }

  const phases = [
    {
      id: 'foundation',
      title: 'Discover the missing basics',
      summary: 'Short tasks for skills that are still below the career target.',
      milestone: 'You can explain the basic idea you were missing.',
      tasks: chosen.filter((task) => task.difficulty === 'foundation'),
    },
    {
      id: 'build',
      title: 'Practice on a real slice',
      summary: 'Intermediate tasks for the larger gaps.',
      milestone: 'You can finish a short exercise without looking up every step.',
      tasks: chosen.filter((task) => task.difficulty === 'intermediate'),
    },
    {
      id: 'apply',
      title: 'Apply it toward the career',
      summary: 'Harder tasks and the career project.',
      milestone: 'You can show a small piece of work a teammate could review.',
      tasks: chosen.filter((task) => task.difficulty === 'advanced'),
    },
  ].filter((phase) => phase.tasks.length > 0)

  const lead = focus[0]
  const leadName = lead ? skillById[lead.skillId].label : career.label
  const narrative = stretch
    ? `${profile.name} is at or above every configured target for ${career.label}. The plan keeps one stretch task and the career project so the sprint still has a destination.`
    : `${profile.name} is preparing for ${career.label}. The first priority is ${leadName}, with a gap of ${lead?.gap ?? 0}. The plan uses ${used} minutes of a ${budgetMinutes}-minute budget and does not add extra topics once the open gaps are covered.`

  return {
    id: uid(),
    generatedAt: new Date().toISOString(),
    method: 'rules',
    methodNote: `Rules-based plan from assessment gaps, career relevance, selected interests, learning style, and study time. ${used} minutes are scheduled inside ${budgetMinutes} budgeted minutes (${profile.minutesPerDay} a day × ${profile.durationWeeks} weeks × 6 study days). Targets are configurable guidance, not an official employment prediction.`,
    narrative,
    budgetMinutes,
    phases,
  }
}

export function buildRoadmap(state: StoredLearning) {
  if (!state.profile || state.attempts.length === 0) return null
  const latest = state.attempts[state.attempts.length - 1]
  if (!latest) return null
  return assembleRoadmap(state.profile, scoreAnswers(latest.answers).bySkill)
}
