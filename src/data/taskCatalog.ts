import type { CapstoneTemplate, Difficulty, SkillId, TaskTemplate } from '../types'

function task(
  id: string,
  skillId: SkillId,
  title: string,
  summary: string,
  minutes: number,
  difficulty: Difficulty,
  style: TaskTemplate['style'],
  resource: string,
  href: string,
  prerequisite: string | null,
): TaskTemplate {
  return { id, skillId, title, summary, minutes, difficulty, style, resource, href, prerequisite }
}

const mdn = 'MDN Learn web development'
const mdnHref = 'https://developer.mozilla.org/en-US/docs/Learn'
const python = 'Python tutorial'
const pythonHref = 'https://docs.python.org/3/tutorial/'
const khan = 'Khan Academy statistics'
const khanHref = 'https://www.khanacademy.org/math/statistics-probability'
const owasp = 'OWASP phishing guidance'
const owaspHref = 'https://owasp.org/www-community/attacks/Phishing'

export const taskCatalog: TaskTemplate[] = [
  task('prog-trace', 'programming', 'Trace a short function by hand', 'Write the value of each variable after every line of a 15-line function.', 30, 'foundation', 'practice', python, pythonHref, null),
  task('prog-vars', 'programming', 'Name three variables in a tiny script', 'Rewrite a paragraph of steps as variables, a condition, and a loop.', 25, 'foundation', 'reading', mdn, mdnHref, null),
  task('prog-test', 'programming', 'Add one check after a change', 'Change a function, then re-run one expected input and output.', 35, 'intermediate', 'practice', python, pythonHref, 'Trace a short function by hand'),
  task('prog-refactor', 'programming', 'Split one long function', 'Move one block into a named function without changing the result.', 40, 'advanced', 'practice', mdn, mdnHref, 'Add one check after a change'),
  task('reason-some', 'reasoning', 'Rewrite "some" and "all" claims', 'Take four sentences and mark which ones a single counterexample can defeat.', 25, 'foundation', 'reading', 'Stanford Encyclopedia: argument', 'https://plato.stanford.edu/entries/argument/', null),
  task('reason-map', 'reasoning', 'Draw one implication', 'Write "if A then B", then say what follows when B is false.', 20, 'foundation', 'visual', 'Khan Academy logical reasoning practice', khanHref, null),
  task('reason-gap', 'reasoning', 'Fill the missing step', 'Between a chart and a conclusion, write the step the writer skipped.', 30, 'intermediate', 'practice', khan, khanHref, 'Rewrite "some" and "all" claims'),
  task('reason-suff', 'reasoning', 'Separate sufficient from necessary', 'For one career claim, write one condition that is enough and one that is required.', 35, 'advanced', 'reading', 'Stanford Encyclopedia: argument', 'https://plato.stanford.edu/entries/argument/', 'Draw one implication'),
  task('data-median', 'data', 'Compute a median and a mean', 'Use one 9-number list. Report both, and say which one an outlier moves.', 30, 'foundation', 'practice', khan, khanHref, null),
  task('data-percent', 'data', 'Compute one percent change', 'Pick a start and an end value. Show the subtraction and the division.', 25, 'foundation', 'practice', khan, khanHref, null),
  task('data-chart', 'data', 'Read a bar chart out loud', 'State the comparison, the unit, and one thing the chart does not show.', 25, 'foundation', 'visual', khan, khanHref, null),
  task('data-bias', 'data', 'Name who is missing', 'For a sample you could actually collect, write who the method leaves out.', 35, 'intermediate', 'reading', khan, khanHref, 'Compute a median and a mean'),
  task('data-caveat', 'data', 'Add a caveat to a finding', 'Write the finding in one sentence and the boundary in the next.', 30, 'advanced', 'practice', khan, khanHref, 'Name who is missing'),
  task('comm-first', 'communication', 'Lead with the ask', 'Rewrite a 150-word note so the first line is the result or the request.', 20, 'foundation', 'practice', 'Plain language guidelines', 'https://www.plainlanguage.gov/guidelines/', null),
  task('comm-example', 'communication', 'Add one concrete example', 'Take an abstract sentence from your field and follow it with one picture the reader can see.', 25, 'foundation', 'reading', 'Plain language guidelines', 'https://www.plainlanguage.gov/guidelines/', null),
  task('comm-listen', 'communication', 'Restate someone else\'s point', 'Listen to a two-minute explanation and write their point before you add yours.', 30, 'intermediate', 'practice', 'Plain language guidelines', 'https://www.plainlanguage.gov/guidelines/', 'Lead with the ask'),
  task('comm-rec', 'communication', 'Write a one-page recommendation', 'Action, reason, risk, and the next step. No new jargon without a definition.', 40, 'advanced', 'practice', 'Plain language guidelines', 'https://www.plainlanguage.gov/guidelines/', 'Lead with the ask'),
  task('solve-done', 'problemSolving', 'Define done in one sentence', 'Pick a real snag from class or a project. Write the constraint and what done looks like.', 20, 'foundation', 'practice', 'Mind Tools: problem solving', 'https://www.mindtools.com/pages/article/newTMC_00.htm', null),
  task('solve-hyp', 'problemSolving', 'Write a checkable hypothesis', 'One claim, and the observation that would show it is wrong.', 25, 'foundation', 'reading', 'Mind Tools: problem solving', 'https://www.mindtools.com/pages/article/newTMC_00.htm', null),
  task('solve-tree', 'problemSolving', 'Build a three-branch issue tree', 'Split one consulting-style question into three smaller questions you could answer with evidence.', 35, 'intermediate', 'visual', 'Mind Tools: problem solving', 'https://www.mindtools.com/pages/article/newTMC_00.htm', 'Define done in one sentence'),
  task('solve-isolate', 'problemSolving', 'Change one variable', 'Run a before and after where only one input moves, and record both results.', 40, 'advanced', 'practice', 'Mind Tools: problem solving', 'https://www.mindtools.com/pages/article/newTMC_00.htm', 'Write a checkable hypothesis'),
  task('dig-phish', 'creativity', 'Mark the asks in a suspicious note', 'List what the message wants, the urgency, and how you would verify it without using its link.', 25, 'foundation', 'practice', owasp, owaspHref, null),
  task('dig-attach', 'creativity', 'Decide whether to open a file', 'Write the sender, the expected reason, and the channel you would use to confirm.', 20, 'foundation', 'reading', owasp, owaspHref, null),
  task('dig-share', 'creativity', 'Replace a shared password', 'Describe separate accounts for two people and what each one should be allowed to do.', 30, 'intermediate', 'practice', 'CISA secure-our-world tips', 'https://www.cisa.gov/secure-our-world', 'Mark the asks in a suspicious note'),
  task('dig-least', 'creativity', 'Apply least privilege to a project folder', 'List three roles and the smallest access each one needs.', 35, 'advanced', 'visual', 'CISA secure-our-world tips', 'https://www.cisa.gov/secure-our-world', 'Replace a shared password'),
]

export const capstones: CapstoneTemplate[] = [
  {
    career: 'software',
    title: 'Ship a tiny change and explain it',
    summary: 'Change one behavior in a small program, keep a check that proves it, and write a six-line note for a teammate.',
    minutes: 50,
    skillId: 'programming',
    resource: python,
    href: pythonHref,
  },
  {
    career: 'aiml',
    title: 'Explain one model failure',
    summary: 'Fit a tiny rule or classifier on a small table, then write where it would be wrong and which column you do not trust.',
    minutes: 50,
    skillId: 'data',
    resource: python,
    href: pythonHref,
  },
  {
    career: 'dataAnalyst',
    title: 'Turn a table into one finding',
    summary: 'Use a small public table. Report one comparison, the unit, and a caveat about who is missing.',
    minutes: 45,
    skillId: 'data',
    resource: khan,
    href: khanHref,
  },
  {
    career: 'uiux',
    title: 'Walk through one flow',
    summary: 'Sketch three screens for a single task. Say what the user does, what could block them, and what you would change.',
    minutes: 45,
    skillId: 'communication',
    resource: 'MDN accessibility tutorials',
    href: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility',
  },
  {
    career: 'cyber',
    title: 'Write a calm risk note',
    summary: 'Describe one phishing or access issue: what you observed, what you did not confirm, and the next check.',
    minutes: 40,
    skillId: 'creativity',
    resource: owasp,
    href: owaspHref,
  },
  {
    career: 'entrepreneur',
    title: 'Test one offer with five people',
    summary: 'State the problem, ask five people, and record what they already do. Do not treat interest as proof they will pay.',
    minutes: 45,
    skillId: 'communication',
    resource: 'Plain language guidelines',
    href: 'https://www.plainlanguage.gov/guidelines/',
  },
  {
    career: 'consulting',
    title: 'Draft a one-page case recommendation',
    summary: 'Structure the question, use one chart or back-of-envelope number, and lead with the action.',
    minutes: 50,
    skillId: 'problemSolving',
    resource: 'Plain language guidelines',
    href: 'https://www.plainlanguage.gov/guidelines/',
  },
]
