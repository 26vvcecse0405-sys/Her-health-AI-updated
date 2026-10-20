import type { CareerId } from '../types.ts'

export const scenes = {
  hero: {
    src: '/images/hero-sphere.svg',
    alt: 'A glowing knowledge sphere orbited by skill nodes and a small learning dashboard',
  },
  constellation: {
    src: '/images/skill-constellation.svg',
    alt: 'A constellation of connected skill nodes in cyan and violet',
  },
  roadmap: {
    src: '/images/roadmap-path.svg',
    alt: 'A rising learning path with milestone markers from discovery to career ready',
  },
  companion: {
    src: '/images/ai-companion.svg',
    alt: 'An abstract AI companion orb with a short conversation beside it',
  },
  empty: {
    src: '/images/empty-journey.svg',
    alt: 'A quiet starting path with a single lit milestone',
  },
  success: {
    src: '/images/success-milestone.svg',
    alt: 'A completed milestone marked by a flag on a rising path',
  },
  streak: {
    src: '/images/streak-flame.svg',
    alt: 'A geometric learning streak made of stacked flames',
  },
  analytics: {
    src: '/images/analytics-board.svg',
    alt: 'A decorative analytics board with rings and a weekly bar chart',
  },
} as const

export const careerArt: Record<CareerId, { src: string; alt: string }> = {
  software: { src: '/images/careers/software.svg', alt: 'Illustration of a code window climbing a glowing path' },
  aiml: { src: '/images/careers/aiml.svg', alt: 'Illustration of a neural network wrapped around a knowledge sphere' },
  dataAnalyst: { src: '/images/careers/data.svg', alt: 'Illustration of orbiting charts around a data core' },
  uiux: { src: '/images/careers/design.svg', alt: 'Illustration of layout frames and a pen drawing a path' },
  cyber: { src: '/images/careers/cyber.svg', alt: 'Illustration of a shield built from circuit lines' },
  entrepreneur: { src: '/images/careers/entrepreneur.svg', alt: 'Illustration of a small launch arc and a destination flag' },
  consulting: { src: '/images/careers/consulting.svg', alt: 'Illustration of a structured brief connecting decision nodes' },
}

export const badgeArt: Record<string, { src: string; alt: string }> = {
  'first-steps': { src: '/images/badges/first-steps.svg', alt: 'First Steps badge: a path beginning under a bolt' },
  'skill-explorer': { src: '/images/badges/skill-explorer.svg', alt: 'Skill Explorer badge: six connected nodes' },
  consistency: { src: '/images/badges/consistency.svg', alt: 'Consistency Champion badge: a steady flame' },
  'quiz-master': { src: '/images/badges/quiz-master.svg', alt: 'Quiz Master badge: a checked medal' },
  'roadmap-runner': { src: '/images/badges/roadmap-runner.svg', alt: 'Roadmap Runner badge: milestones along a path' },
  'skill-builder': { src: '/images/badges/skill-builder.svg', alt: 'Skill Builder badge: three rising blocks' },
}
