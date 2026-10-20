import { careerById, skillById } from '../../data/catalog.ts'
import { derive } from '../learning/derive.ts'
import type { StoredLearning } from '../../types.ts'

export function learnerBrief(state: StoredLearning) {
  const profile = state.profile
  if (!profile) return 'No student profile yet.'
  const view = derive(state)
  const lines = [
    `Name: ${profile.name}`,
    `Career target: ${careerById[profile.career].label}. This is a configurable study target, not a job offer or a competence guarantee.`,
    `Time: ${profile.minutesPerDay} minutes a day for ${profile.durationWeeks} weeks.`,
    `Learning style: ${profile.learningStyle}.`,
    `Interests: ${profile.interests.join(', ')}.`,
  ]
  if (view.latestScore) {
    lines.push(`Overall demonstrated score: ${view.latestScore.overall}.`)
    for (const gap of view.gaps) {
      lines.push(`${skillById[gap.skillId].label}: demonstrated ${gap.demonstrated}, target ${gap.target}, gap ${gap.gap}.`)
    }
  } else {
    lines.push('No assessment has been submitted.')
  }
  if (view.nextTask) lines.push(`Next unfinished task: ${view.nextTask.title}.`)
  lines.push('Do not invent scores. If a number is not listed, say you do not have it.')
  return lines.join('\n')
}

export function demoReply(message: string, state: StoredLearning) {
  const text = message.toLowerCase()
  const profile = state.profile
  const view = derive(state)
  if (/real ai|live model|openai|api key/.test(text)) {
    return 'This reply is from the local demo tutor. A live model answers only when the server has an API key, and those messages are labelled Live model.'
  }
  if (!profile) {
    return 'Save a profile first. The tutor can then use your career target, your assessment, and the next task. This is the demo tutor.'
  }
  const career = careerById[profile.career].label
  const top = view.developing[0]
  if (/gap|behind|weak|priority|why/.test(text) && top) {
    return `${skillById[top.skillId].label} is the highest-priority open gap for ${career}. ${top.why} Demo tutor — these figures come from the saved assessment.`
  }
  if (/quiz|flashcard|practice|studio/.test(text)) {
    const skill = view.nextTask ? skillById[view.nextTask.skillId].label : 'the skill you select'
    return `Open the learning studio and generate a quiz or flashcards for ${skill}. If no API key is configured, the studio labels the result as the local bank. ${view.nextTask ? `Your next roadmap task is still “${view.nextTask.title}”.` : ''} Demo tutor.`
  }
  if (/explain|step|how/.test(text)) {
    if (!top) {
      return `Every assessed skill is at or above the configured target for ${career}. Review the career project on the roadmap, or retake the assessment after more practice. Demo tutor.`
    }
    return [
      `Step 1. ${skillById[top.skillId].label} is ${top.gap} points under the configured target of ${top.target}.`,
      'Step 2. The gap is max(0, target − demonstrated score). Confidence sliders are not part of it.',
      `Step 3. Do this next: ${view.nextTask ? view.nextTask.title : 'open the roadmap'}.`,
      'Step 4. After you practice, retake the assessment if you want the score itself to change.',
      'Demo tutor — no live model was used.',
    ].join(' ')
  }
  if (view.nextTask) {
    return `${profile.name}, the next task on the rules-based roadmap is “${view.nextTask.title}” (${view.nextTask.minutes} minutes, ${skillById[view.nextTask.skillId].label}). ${view.latestScore ? `Your latest assessment is ${view.latestScore.overall}.` : ''} Demo tutor — no live model was used.`
  }
  return `${profile.name} is using ${career} as a study target. ${view.latestScore ? `The latest assessment is ${view.latestScore.overall}.` : 'The assessment has not been submitted.'} Demo tutor — no live model was used.`
}
