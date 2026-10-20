import type { Difficulty, SkillId } from '../types.ts'

export interface BankQuestion {
  id: string
  skillId: SkillId
  difficulty: Difficulty
  prompt: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
}

export interface BankCard {
  id: string
  skillId: SkillId
  front: string
  back: string
}

export const practiceQuestions: BankQuestion[] = [
  { id: 'pq-prog-1', skillId: 'programming', difficulty: 'foundation', prompt: 'Which of these values is a boolean?', options: ['true', '12', '"yes"', 'null'], correctIndex: 0, explanation: 'true is a boolean. 12 is a number, "yes" is text, and null means no value.' },
  { id: 'pq-prog-2', skillId: 'programming', difficulty: 'foundation', prompt: 'In JavaScript, the first index of an array is usually…', options: ['1', '0', 'the length of the array', '-1'], correctIndex: 1, explanation: 'Array indexes start at 0, so the first item is array[0].' },
  { id: 'pq-prog-3', skillId: 'programming', difficulty: 'intermediate', prompt: 'What is the main job of a unit test?', options: ['Replace the user manual', 'Check one behavior and fail if a later change breaks it', 'Make the program faster', 'Hide errors from the console'], correctIndex: 1, explanation: 'A unit test locks one expected behavior so a later edit can be checked against it.' },
  { id: 'pq-prog-4', skillId: 'programming', difficulty: 'intermediate', prompt: 'A function returns x * x. What does it return when x is 5?', options: ['10', '15', '25', '55'], correctIndex: 2, explanation: '5 × 5 = 25.' },
  { id: 'pq-prog-5', skillId: 'programming', difficulty: 'advanced', prompt: 'Why is a constant-time lookup useful as a collection grows?', options: ['The code becomes shorter automatically', 'The lookup time stays about the same instead of scanning every item', 'It removes the need to test', 'It sorts the data for you'], correctIndex: 1, explanation: 'A scan gets slower as items are added. A constant-time lookup does not walk the whole collection.' },
  { id: 'pq-reason-1', skillId: 'reasoning', difficulty: 'foundation', prompt: 'If a task is complete, its box is checked. This box is not checked. What follows?', options: ['The task is complete', 'The task is not complete', 'Every box in the app is unchecked', 'The rule is about quizzes, not tasks'], correctIndex: 1, explanation: 'Complete tasks are checked. This one is not checked, so it is not complete.' },
  { id: 'pq-reason-2', skillId: 'reasoning', difficulty: 'foundation', prompt: 'All foundation tasks in the plan are short. This task is a foundation task. What follows?', options: ['This task is short', 'Every short task is a foundation task', 'This task is advanced', 'Nothing follows'], correctIndex: 0, explanation: 'The task is in the group, and every member of the group is short, so this task is short.' },
  { id: 'pq-reason-3', skillId: 'reasoning', difficulty: 'intermediate', prompt: 'A student says, “I felt confident, so my score must be high.” What is the error?', options: ['Confidence is the same number as the scored assessment', 'A feeling of confidence is not the demonstrated score', 'Scores cannot be calculated', 'Only advanced questions count'], correctIndex: 1, explanation: 'SkillSprint keeps the confidence rating separate from the weighted assessment score.' },
  { id: 'pq-reason-4', skillId: 'reasoning', difficulty: 'intermediate', prompt: '“Some gaps are large, so every gap is large.” Is that valid?', options: ['Yes, some implies every', 'No, a statement about some items does not cover every item', 'Yes, if the chart is a bar chart', 'No, because gaps cannot be measured'], correctIndex: 1, explanation: '“Some” leaves room for other gaps that are not large.' },
  { id: 'pq-reason-5', skillId: 'reasoning', difficulty: 'advanced', prompt: 'A badge requires a passing quiz and a finished task. The quiz passed. The task is unfinished. Is the badge earned?', options: ['Yes, because the quiz passed', 'Yes, if the student feels ready', 'No, both conditions are required', 'No, quizzes never count'], correctIndex: 2, explanation: 'An “and” condition fails when either part is missing.' },
  { id: 'pq-data-1', skillId: 'data', difficulty: 'foundation', prompt: 'What is the median of 1, 3, and 9?', options: ['1', '3', '4.3', '9'], correctIndex: 1, explanation: 'The middle value of the ordered list 1, 3, 9 is 3.' },
  { id: 'pq-data-2', skillId: 'data', difficulty: 'foundation', prompt: 'A bar chart is mainly used to…', options: ['Compare amounts across categories', 'Prove a cause', 'Replace the sample size', 'Store raw files'], correctIndex: 0, explanation: 'Bar length compares values. It does not, by itself, prove why the values differ.' },
  { id: 'pq-data-3', skillId: 'data', difficulty: 'intermediate', prompt: 'Five classmates are used to describe a whole university. What is the main limit?', options: ['Five is always enough', 'The small group may not represent the university', 'A mean cannot be calculated from five numbers', 'Charts cannot show five rows'], correctIndex: 1, explanation: 'A convenience sample can differ from the larger group you want to describe.' },
  { id: 'pq-data-4', skillId: 'data', difficulty: 'intermediate', prompt: 'A value moves from 40 to 50. What is the percent increase?', options: ['10%', '20%', '25%', '50%'], correctIndex: 2, explanation: 'The change is 10, and 10 / 40 = 0.25, which is 25%.' },
  { id: 'pq-data-5', skillId: 'data', difficulty: 'advanced', prompt: 'Which summary is pulled hardest by one very large value?', options: ['The median', 'The mean', 'The minimum, if the large value is not the minimum', 'The sample size'], correctIndex: 1, explanation: 'The mean adds every value in, so one extreme moves it. The median stays at the middle position.' },
  { id: 'pq-comm-1', skillId: 'communication', difficulty: 'foundation', prompt: 'A useful status update starts with…', options: ['The background from the first week', 'The result, then the detail', 'Every number you calculated', 'An apology for the length'], correctIndex: 1, explanation: 'Readers need the result before the history. Detail comes after they know the point.' },
  { id: 'pq-comm-2', skillId: 'communication', difficulty: 'foundation', prompt: 'Jargon is reasonable when…', options: ['You want to sound advanced', 'The reader shares that vocabulary', 'The idea is still unclear to you', 'You have not decided the point yet'], correctIndex: 1, explanation: 'Shared terms save time. Unfamiliar terms make the reader translate instead of decide.' },
  { id: 'pq-comm-3', skillId: 'communication', difficulty: 'intermediate', prompt: 'A chart title should tell the reader…', options: ['What is being compared', 'Which software made the file', 'The author’s favorite color', 'That the chart is important'], correctIndex: 0, explanation: 'The title should state the comparison so the chart can be read without guessing.' },
  { id: 'pq-comm-4', skillId: 'communication', difficulty: 'intermediate', prompt: 'Which request is concrete?', options: ['Let’s circle back soon', 'Please send the two-page outline by Friday', 'Thoughts?', 'We should align'], correctIndex: 1, explanation: 'It names the artifact and the time. The others leave the next action open.' },
  { id: 'pq-comm-5', skillId: 'communication', difficulty: 'advanced', prompt: 'Feedback is easier to use when it names…', options: ['A personality trait', 'A specific change the person can make', 'Every past mistake', 'A score with no example'], correctIndex: 1, explanation: 'A specific change can be tried. A label about the person cannot be edited.' },
  { id: 'pq-solve-1', skillId: 'problemSolving', difficulty: 'foundation', prompt: 'In this app, a constraint is…', options: ['A limit you have to respect, such as time or tools', 'Proof that the first idea is correct', 'A badge', 'A live model response'], correctIndex: 0, explanation: 'Time, tools, and prerequisites are constraints. They shape the work; they do not grade it by themselves.' },
  { id: 'pq-solve-2', skillId: 'problemSolving', difficulty: 'foundation', prompt: 'After a fix, what confirms that it worked?', options: ['The code looks cleaner', 'The original failing case now passes', 'You feel more confident', 'The file was renamed'], correctIndex: 1, explanation: 'The same input that failed is the check. A tidier file is not that check.' },
  { id: 'pq-solve-3', skillId: 'problemSolving', difficulty: 'intermediate', prompt: 'Why write down the failing case before editing?', options: ['So you can tell a real fix from a guess', 'So the program compiles faster', 'So you can skip testing', 'So the gap becomes zero'], correctIndex: 0, explanation: 'Without the original case, you cannot tell whether the new behavior fixed the failure you cared about.' },
  { id: 'pq-solve-4', skillId: 'problemSolving', difficulty: 'intermediate', prompt: 'Breaking a problem into smaller problems is called…', options: ['Correlation', 'Decomposition', 'A mean', 'A prototype guarantee'], correctIndex: 1, explanation: 'Decomposition is splitting the work into parts you can solve and check.' },
  { id: 'pq-solve-5', skillId: 'problemSolving', difficulty: 'advanced', prompt: 'Two fixes both seem to work. A useful next comparison is…', options: ['Which file name sounds better', 'Which one is simpler to check and change later', 'Which one uses more lines', 'Which one avoids a test'], correctIndex: 1, explanation: 'If both pass the check, prefer the one a later edit is less likely to break.' },
  { id: 'pq-create-1', skillId: 'creativity', difficulty: 'foundation', prompt: 'Divergent thinking, as used here, means…', options: ['Generating several different options before you choose', 'Picking the first idea quickly', 'Copying one example exactly', 'Skipping the test'], correctIndex: 0, explanation: 'You widen the options first so the later choice is not just the first thought.' },
  { id: 'pq-create-2', skillId: 'creativity', difficulty: 'foundation', prompt: 'A prototype is…', options: ['The finished product', 'A small version you can try', 'A signed grade', 'A replacement for a user'], correctIndex: 1, explanation: 'A prototype is something small enough to try. It is not a claim that the work is done.' },
  { id: 'pq-create-3', skillId: 'creativity', difficulty: 'intermediate', prompt: 'Feedback from one person is…', options: ['Proof that every user agrees', 'A clue, not proof about everyone', 'Useless unless it is numeric', 'A reason to ignore the original goal'], correctIndex: 1, explanation: 'One session can show a real snag. It cannot, alone, represent every user.' },
  { id: 'pq-create-4', skillId: 'creativity', difficulty: 'intermediate', prompt: 'Combining two existing ideas is…', options: ['Not allowed in a learning project', 'A legitimate way to create a new option', 'Only useful in graphic design', 'The same as skipping practice'], correctIndex: 1, explanation: 'A new combination can be tested like any other option. Novelty does not require a blank page.' },
  { id: 'pq-create-5', skillId: 'creativity', difficulty: 'advanced', prompt: 'When should you stop exploring and build?', options: ['When you have a way to test the most promising idea in the time you have', 'Only after ten more ideas', 'When the first sketch feels exciting', 'When a chart looks finished'], correctIndex: 0, explanation: 'The switch happens when a test fits the time you have, not when the idea feels complete.' },
]

export const practiceCards: BankCard[] = [
  { id: 'card-prog-1', skillId: 'programming', front: 'What does a function give you?', back: 'A named block of instructions you can call again.' },
  { id: 'card-prog-2', skillId: 'programming', front: 'Where does a JavaScript array start?', back: 'Index 0.' },
  { id: 'card-prog-3', skillId: 'programming', front: 'What should a unit test do when behavior breaks?', back: 'Fail, so you notice the break.' },
  { id: 'card-reason-1', skillId: 'reasoning', front: 'If complete tasks are checked, and this box is empty, what is the task?', back: 'Not complete.' },
  { id: 'card-reason-2', skillId: 'reasoning', front: 'Does “some” mean “every”?', back: 'No. Some leaves the rest open.' },
  { id: 'card-reason-3', skillId: 'reasoning', front: 'Is a confidence rating a skill score?', back: 'No. The score comes from weighted correct answers.' },
  { id: 'card-data-1', skillId: 'data', front: 'How do you find a mean?', back: 'Add the values and divide by how many there are.' },
  { id: 'card-data-2', skillId: 'data', front: 'Does a matching chart prove a cause?', back: 'No. The series can share another cause.' },
  { id: 'card-data-3', skillId: 'data', front: 'Which moves more when one value is extreme: mean or median?', back: 'The mean.' },
  { id: 'card-comm-1', skillId: 'communication', front: 'What do you decide before the wording?', back: 'Who will read it, and what they need to do.' },
  { id: 'card-comm-2', skillId: 'communication', front: 'Where does the result go in a short update?', back: 'At the start.' },
  { id: 'card-comm-3', skillId: 'communication', front: 'What makes a request concrete?', back: 'It names the thing and the time.' },
  { id: 'card-solve-1', skillId: 'problemSolving', front: 'What is the first note in a bug report?', back: 'The exact input, the actual result, and the expected result.' },
  { id: 'card-solve-2', skillId: 'problemSolving', front: 'What is decomposition?', back: 'Splitting a problem into parts you can check.' },
  { id: 'card-solve-3', skillId: 'problemSolving', front: 'How do you confirm a fix?', back: 'Run the original failing case and see it pass.' },
  { id: 'card-create-1', skillId: 'creativity', front: 'What is a useful constraint?', back: 'A limit that forces a specific, testable choice.' },
  { id: 'card-create-2', skillId: 'creativity', front: 'What is a prototype for?', back: 'Trying a small version before you commit to a large one.' },
  { id: 'card-create-3', skillId: 'creativity', front: 'What is one person’s feedback?', back: 'A clue. It is not proof about every user.' },
]
