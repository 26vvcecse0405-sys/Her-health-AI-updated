import type {
  CapstoneTemplate,
  CareerDef,
  CareerId,
  Difficulty,
  EducationLevel,
  InterestDef,
  LearningStyle,
  SkillDef,
  SkillId,
  TaskTemplate,
} from '../types.ts'

export const difficultyWeight: Record<Difficulty, number> = {
  foundation: 1,
  intermediate: 2,
  advanced: 3,
}

export const difficultyLabels: Record<Difficulty, string> = {
  foundation: 'Foundation',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const educationLabels: Record<EducationLevel, string> = {
  school: 'School',
  undergraduate: 'Undergraduate',
  postgraduate: 'Postgraduate',
  professional: 'Working professional',
}

export const styleLabels: Record<LearningStyle, string> = {
  visual: 'Visual explanations',
  reading: 'Reading and notes',
  practice: 'Practice first',
  mixed: 'A mix of all three',
}

export const skills: SkillDef[] = [
  {
    id: 'programming',
    label: 'Programming',
    summary: 'You can read, write, and fix small programs.',
    color: '#22d3ee',
  },
  {
    id: 'reasoning',
    label: 'Logical reasoning',
    summary: 'You can tell a valid conclusion from a guess.',
    color: '#60a5fa',
  },
  {
    id: 'data',
    label: 'Data analysis',
    summary: 'You can read numbers, charts, and the limits of a sample.',
    color: '#a78bfa',
  },
  {
    id: 'communication',
    label: 'Communication',
    summary: 'You can make a point clear for a specific reader.',
    color: '#34d399',
  },
  {
    id: 'problemSolving',
    label: 'Problem-solving',
    summary: 'You can split a hard problem into a piece you can check.',
    color: '#fbbf24',
  },
  {
    id: 'creativity',
    label: 'Creativity',
    summary: 'You can generate options, constrain them, and test one.',
    color: '#f472b6',
  },
]

export const skillById = Object.fromEntries(skills.map((skill) => [skill.id, skill])) as Record<SkillId, SkillDef>

const aimlReasons: Record<SkillId, string> = {
  programming: 'Model code, data pipelines, and experiments are written as programs.',
  reasoning: 'You have to separate what a metric shows from what it does not show.',
  data: 'Most of the work is deciding whether the data can support the claim.',
  communication: 'A model nobody can explain does not help a teammate decide.',
  problemSolving: 'Training runs fail. The useful habit is isolating one cause.',
  creativity: 'Feature ideas and product uses still start as options you have to test.',
}

const softwareReasons: Record<SkillId, string> = {
  programming: 'Shipping software is the daily craft of this path.',
  reasoning: 'You use it when you read a bug report and decide what must be true.',
  data: 'Logs, timings, and simple metrics tell you whether a change helped.',
  communication: 'Issues, pull requests, and user notes are part of the job.',
  problemSolving: 'A feature request is a problem to split before it is code.',
  creativity: 'Interfaces and APIs have more than one workable shape.',
}

const dataReasons: Record<SkillId, string> = {
  programming: 'Cleaning and checking data is usually done in code.',
  reasoning: 'The question is whether the evidence supports the decision.',
  data: 'This is the core craft: summaries, charts, and their limits.',
  communication: 'A finding matters only if a reader can act on it.',
  problemSolving: 'Messy source data has to be broken into checks.',
  creativity: 'The chart and the question can be framed in more than one way.',
}

const designReasons: Record<SkillId, string> = {
  programming: 'You will inspect basic interface code even if you do not write the system.',
  reasoning: 'A flow either does or does not let someone finish the task.',
  data: 'Usability notes and simple counts keep the design honest.',
  communication: 'You are translating a user need for the rest of the team.',
  problemSolving: 'A screen is a set of constraints: task, time, and context.',
  creativity: 'Options, sketches, and prototypes are the work itself.',
}

const cyberReasons: Record<SkillId, string> = {
  programming: 'You read code and scripts to see how a system actually behaves.',
  reasoning: 'An alert is a claim. You test what would have to be true.',
  data: 'Logs are data. Patterns and false alarms both live there.',
  communication: 'A finding needs a clear severity and a next step.',
  problemSolving: 'Incidents are open problems with incomplete information.',
  creativity: 'Attackers vary the path. Defenders practice imagining those paths.',
}

const founderReasons: Record<SkillId, string> = {
  programming: 'A small build lets you test an offer without hiring a team.',
  reasoning: 'You have to separate a customer story from a market fact.',
  data: 'A few real numbers beat a long pitch.',
  communication: 'People buy, join, or fund when they understand the point.',
  problemSolving: 'A company problem is a stack of smaller checks.',
  creativity: 'The offer itself is an idea you have to narrow and try.',
}

const consultingReasons: Record<SkillId, string> = {
  programming: 'Light analysis in a notebook or sheet is often enough, and worth being able to do.',
  reasoning: 'A recommendation is a conclusion someone will challenge.',
  data: 'Clients ask what the numbers can and cannot support.',
  communication: 'The deliverable is a clear argument, not a pile of analysis.',
  problemSolving: 'The engagement starts by cutting the question down.',
  creativity: 'Workshops and options are part of finding a path the client can use.',
}

export const careers: CareerDef[] = [
  {
    id: 'aiml',
    label: 'AI/ML Engineer',
    blurb: 'Build and evaluate models with a clear claim about the data.',
    targets: { programming: 80, reasoning: 75, data: 85, communication: 60, problemSolving: 80, creativity: 55 },
    reasons: aimlReasons,
    core: ['programming', 'data', 'reasoning', 'problemSolving'],
  },
  {
    id: 'software',
    label: 'Software Developer',
    blurb: 'Design, build, and repair software other people can run.',
    targets: { programming: 85, reasoning: 70, data: 60, communication: 65, problemSolving: 80, creativity: 50 },
    reasons: softwareReasons,
    core: ['programming', 'problemSolving', 'reasoning'],
  },
  {
    id: 'dataAnalyst',
    label: 'Data Analyst',
    blurb: 'Turn a question into a checkable summary and a careful chart.',
    targets: { programming: 65, reasoning: 70, data: 90, communication: 75, problemSolving: 70, creativity: 45 },
    reasons: dataReasons,
    core: ['data', 'reasoning', 'communication'],
  },
  {
    id: 'uiux',
    label: 'UI/UX Designer',
    blurb: 'Shape a flow someone can finish, then test it.',
    targets: { programming: 45, reasoning: 60, data: 55, communication: 80, problemSolving: 70, creativity: 85 },
    reasons: designReasons,
    core: ['creativity', 'communication', 'problemSolving'],
  },
  {
    id: 'cyber',
    label: 'Cybersecurity Analyst',
    blurb: 'Read systems, logs, and alerts, then explain the risk.',
    targets: { programming: 75, reasoning: 80, data: 65, communication: 60, problemSolving: 85, creativity: 45 },
    reasons: cyberReasons,
    core: ['programming', 'reasoning', 'problemSolving'],
  },
  {
    id: 'entrepreneur',
    label: 'Entrepreneur',
    blurb: 'Find a real problem, test an offer, and explain the result.',
    targets: { programming: 40, reasoning: 65, data: 60, communication: 85, problemSolving: 75, creativity: 80 },
    reasons: founderReasons,
    core: ['communication', 'creativity', 'problemSolving'],
  },
  {
    id: 'consulting',
    label: 'Management Consultant',
    blurb: 'Frame a decision, test it with evidence, and write the recommendation.',
    targets: { programming: 35, reasoning: 80, data: 75, communication: 90, problemSolving: 80, creativity: 60 },
    reasons: consultingReasons,
    core: ['communication', 'reasoning', 'problemSolving', 'data'],
  },
]

export const careerById = Object.fromEntries(careers.map((career) => [career.id, career])) as Record<CareerId, CareerDef>

export const interests: InterestDef[] = [
  { id: 'coding', label: 'Coding', skills: ['programming', 'problemSolving'] },
  { id: 'ai', label: 'Artificial intelligence', skills: ['programming', 'data', 'reasoning'] },
  { id: 'data', label: 'Data', skills: ['data', 'reasoning'] },
  { id: 'design', label: 'Design', skills: ['creativity', 'communication'] },
  { id: 'business', label: 'Business', skills: ['communication', 'problemSolving'] },
  { id: 'security', label: 'Security', skills: ['programming', 'reasoning', 'problemSolving'] },
  { id: 'communication', label: 'Communication', skills: ['communication'] },
  { id: 'product', label: 'Product', skills: ['creativity', 'problemSolving', 'communication'] },
]

export const interestById = Object.fromEntries(interests.map((interest) => [interest.id, interest])) as Record<InterestDef['id'], InterestDef>

interface TaskSeed {
  id: string
  skillId: SkillId
  title: string
  summary: string
  minutes: number
  difficulty: Difficulty
  style: Exclude<LearningStyle, 'mixed'>
  resource: string
  href: string
}

function task(seed: TaskSeed): TaskTemplate {
  return { ...seed, prerequisite: null }
}

export const taskTemplates: TaskTemplate[] = [
  task({ id: 'prog-read', skillId: 'programming', title: 'Name the pieces of a small program', summary: 'Read one short example and label the variables, the function, and the call.', minutes: 30, difficulty: 'foundation', style: 'reading', resource: 'MDN — JavaScript Guide', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' }),
  task({ id: 'prog-practice', skillId: 'programming', title: 'Write a function that filters a list', summary: 'Write a function that keeps items matching one condition, then call it on three lists.', minutes: 35, difficulty: 'foundation', style: 'practice', resource: 'MDN — Arrays', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array' }),
  task({ id: 'prog-mid', skillId: 'programming', title: 'Fix a loop that stops too early', summary: 'Reproduce a loop that undercounts, change one condition, and show the new result.', minutes: 45, difficulty: 'intermediate', style: 'practice', resource: 'MDN — Loops and iteration', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration' }),
  task({ id: 'prog-adv', skillId: 'programming', title: 'Split one script into two functions', summary: 'Take a 40-line script and separate input checking from the calculation. Each function should be callable on its own.', minutes: 60, difficulty: 'advanced', style: 'practice', resource: 'MDN — Functions', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions' }),
  task({ id: 'reason-read', skillId: 'reasoning', title: 'Mark a valid and an invalid conclusion', summary: 'Take four short arguments and label which conclusion follows from the premises.', minutes: 30, difficulty: 'foundation', style: 'reading', resource: 'Stanford Encyclopedia — Informal logic, introduction only', href: 'https://plato.stanford.edu/entries/logic-informal/' }),
  task({ id: 'reason-practice', skillId: 'reasoning', title: 'Test one if-then claim', summary: 'Write an if-then rule from your roadmap and find one case that would make it false.', minutes: 30, difficulty: 'foundation', style: 'practice', resource: 'Stanford Encyclopedia — Informal logic', href: 'https://plato.stanford.edu/entries/logic-informal/' }),
  task({ id: 'reason-mid', skillId: 'reasoning', title: 'Separate evidence from a recommendation', summary: 'Rewrite a paragraph so the evidence is in one sentence and the recommendation is in the next.', minutes: 40, difficulty: 'intermediate', style: 'reading', resource: 'Plain Language — Organize for the reader', href: 'https://www.plainlanguage.gov/guidelines/organize/' }),
  task({ id: 'reason-adv', skillId: 'reasoning', title: 'Stress-test a career-target claim', summary: 'Pick one target proficiency and write what evidence would raise it, and what evidence would not.', minutes: 50, difficulty: 'advanced', style: 'practice', resource: 'Stanford Encyclopedia — Informal logic', href: 'https://plato.stanford.edu/entries/logic-informal/' }),
  task({ id: 'data-read', skillId: 'data', title: 'Read a chart without adding a cause', summary: 'Describe what a chart shows, then write one cause you are not allowed to claim from it.', minutes: 30, difficulty: 'foundation', style: 'reading', resource: 'Kaggle Learn — Data visualization', href: 'https://www.kaggle.com/learn/data-visualization' }),
  task({ id: 'data-practice', skillId: 'data', title: 'Compute mean and median by hand', summary: 'Use a list of seven numbers. Report both summaries and say which one a single outlier moves.', minutes: 35, difficulty: 'foundation', style: 'practice', resource: 'Khan Academy — Mean, median, and mode', href: 'https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data' }),
  task({ id: 'data-mid', skillId: 'data', title: 'Compare two groups with the same chart', summary: 'Plot or table two categories, state the difference, and name the sample size.', minutes: 45, difficulty: 'intermediate', style: 'practice', resource: 'Kaggle Learn — Pandas', href: 'https://www.kaggle.com/learn/pandas' }),
  task({ id: 'data-adv', skillId: 'data', title: 'Write the limit under the finding', summary: 'Finish a six-line finding that includes the metric, the comparison, and one reason it might not generalize.', minutes: 60, difficulty: 'advanced', style: 'reading', resource: 'Kaggle Learn — Intro to machine learning', href: 'https://www.kaggle.com/learn/intro-to-machine-learning' }),
  task({ id: 'comm-read', skillId: 'communication', title: 'Rewrite a paragraph for one reader', summary: 'Take a dense explanation and rewrite it for a first-year student in under 120 words.', minutes: 30, difficulty: 'foundation', style: 'reading', resource: 'Plain Language guidelines', href: 'https://www.plainlanguage.gov/guidelines/' }),
  task({ id: 'comm-practice', skillId: 'communication', title: 'Open with the result', summary: 'Write a five-line update that starts with what you found, then the evidence, then the ask.', minutes: 30, difficulty: 'foundation', style: 'practice', resource: 'Plain Language — Write for your audience', href: 'https://www.plainlanguage.gov/guidelines/audience/' }),
  task({ id: 'comm-mid', skillId: 'communication', title: 'Explain one skill gap out loud', summary: 'Record a two-minute explanation of your largest gap using the target, the score, and the next task.', minutes: 40, difficulty: 'intermediate', style: 'practice', resource: 'Purdue OWL — Paragraphs and coherence', href: 'https://owl.purdue.edu/owl/general_writing/academic_writing/paragraphs_and_paragraph_building/index.html' }),
  task({ id: 'comm-adv', skillId: 'communication', title: 'Write a one-page recommendation', summary: 'Recommend one learning focus. Include the evidence, the alternative you rejected, and the time it takes.', minutes: 55, difficulty: 'advanced', style: 'reading', resource: 'Plain Language — Be concise', href: 'https://www.plainlanguage.gov/guidelines/concise/' }),
  task({ id: 'solve-read', skillId: 'problemSolving', title: 'Write a bug as input, result, and expected', summary: 'Describe one failure in three lines: input, what happened, what should have happened.', minutes: 25, difficulty: 'foundation', style: 'reading', resource: 'MDN — JavaScript Guide', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' }),
  task({ id: 'solve-practice', skillId: 'problemSolving', title: 'Cut a task into a checkable slice', summary: 'Take a 2-hour idea and define a 30-minute version with a visible done state.', minutes: 30, difficulty: 'foundation', style: 'practice', resource: 'MDN — JavaScript Guide', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' }),
  task({ id: 'solve-mid', skillId: 'problemSolving', title: 'Change one variable at a time', summary: 'Debug a small failure by changing a single input, recording the result, then changing the next.', minutes: 45, difficulty: 'intermediate', style: 'practice', resource: 'MDN — JavaScript Guide', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' }),
  task({ id: 'solve-adv', skillId: 'problemSolving', title: 'Choose between two fixes', summary: 'Write two possible fixes, the check for each, and which one you would try first and why.', minutes: 55, difficulty: 'advanced', style: 'practice', resource: 'MDN — Functions', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions' }),
  task({ id: 'create-read', skillId: 'creativity', title: 'List options before you pick', summary: 'For one study problem, write five different approaches before marking a favorite.', minutes: 25, difficulty: 'foundation', style: 'reading', resource: 'IDEO — Design thinking overview', href: 'https://designthinking.ideo.com/' }),
  task({ id: 'create-practice', skillId: 'creativity', title: 'Prototype the smallest version', summary: 'Turn your favorite option into something you can try in 20 minutes: a sketch, a script, or a script outline.', minutes: 35, difficulty: 'foundation', style: 'practice', resource: 'MDN — Accessibility', href: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility' }),
  task({ id: 'create-mid', skillId: 'creativity', title: 'Add one constraint and redo it', summary: 'Redo the prototype with a hard limit: half the words, one screen, or no new tools.', minutes: 40, difficulty: 'intermediate', style: 'practice', resource: 'Material Design — Overview', href: 'https://m3.material.io/' }),
  task({ id: 'create-adv', skillId: 'creativity', title: 'Test the idea on one person', summary: 'Show the prototype to one person, write what confused them, and change one thing.', minutes: 60, difficulty: 'advanced', style: 'practice', resource: 'W3C — Usability and accessibility basics', href: 'https://www.w3.org/WAI/fundamentals/' }),
]

export const capstones: CapstoneTemplate[] = [
  { career: 'aiml', title: 'Evaluate a tiny classifier', summary: 'Train or walk through a small classifier, report accuracy, and write one reason the score could mislead you.', minutes: 90, skillId: 'data', resource: 'Kaggle Learn — Intro to Machine Learning', href: 'https://www.kaggle.com/learn/intro-to-machine-learning' },
  { career: 'software', title: 'Ship a task list with one test', summary: 'Build a tiny task list, add one check that fails when a task is counted twice, and make the check pass.', minutes: 90, skillId: 'programming', resource: 'MDN — JavaScript Guide', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
  { career: 'dataAnalyst', title: 'Publish a one-chart briefing', summary: 'Answer one question with a table, one chart, the sample size, and a sentence you will not claim.', minutes: 80, skillId: 'data', resource: 'Kaggle Learn — Data visualization', href: 'https://www.kaggle.com/learn/data-visualization' },
  { career: 'uiux', title: 'Prototype one flow and test it', summary: 'Sketch a three-step flow for finishing a study task, then watch one person try it.', minutes: 80, skillId: 'creativity', resource: 'W3C WAI fundamentals', href: 'https://www.w3.org/WAI/fundamentals/' },
  { career: 'cyber', title: 'Review one small threat', summary: 'Pick one item from the OWASP Top 10, describe the failure, and write a check a student project could add.', minutes: 75, skillId: 'problemSolving', resource: 'OWASP Top 10', href: 'https://owasp.org/www-project-top-ten/' },
  { career: 'entrepreneur', title: 'Test an offer with five conversations', summary: 'Write a one-sentence offer, talk to five people, and record what they already do instead.', minutes: 70, skillId: 'communication', resource: 'U.S. SBA — Plan your business', href: 'https://www.sba.gov/business-guide/plan-your-business' },
  { career: 'consulting', title: 'Write a one-page decision memo', summary: 'Frame one study decision, compare two options, and recommend one with the evidence attached.', minutes: 70, skillId: 'communication', resource: 'Plain Language guidelines', href: 'https://www.plainlanguage.gov/guidelines/' },
]

export const prerequisites: Partial<Record<SkillId, SkillId[]>> = {
  programming: ['reasoning'],
  data: ['reasoning'],
  problemSolving: ['reasoning'],
  creativity: ['communication'],
}

export function deliveryLine(style: LearningStyle) {
  if (style === 'visual') return 'Start with the diagram or chart in the resource, then do the task.'
  if (style === 'reading') return 'Read the short guide and take five lines of notes before you start.'
  if (style === 'practice') return 'Do the exercise first, then use the resource to check the part that stuck.'
  return 'Skim the resource, do the exercise, then note one thing you would change.'
}
