# SkillSprint

Personalized learning companion for the NIT Surathkal student innovation competition. A student names a career, takes a scored diagnostic, and follows a roadmap built from those answers, their interests, and the time they have.

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints, usually http://localhost:5173.

No account and no API key are required.

- **Try Interactive Demo** opens a fictional student, Ananya Rao. Her assessment answers, gaps, roadmap, quizzes, and badges are stored separately from a profile you create.
- **Start My Learning Journey** saves a profile in this browser and starts the assessment.
- **Reset demo** on the sample dashboard restores Ananya’s record. **Clear my profile** on the Profile page removes only the student record.

Progress stays in `localStorage`. It is not a password-backed account and it is not synced across devices.

## What is calculated

- Assessment score: each question has a correct option. Foundation items weigh 1, intermediate 2, advanced 3. A skill score is earned weight divided by possible weight.
- Skill gap: `max(0, career target − demonstrated score)`. Confidence ratings from onboarding are not the score.
- Roadmap: assembled from the task catalog using gaps, learning style, and the study budget. The screen says when a plan is rules-based.
- Quizzes: scored from the options you submit. Wrong answers enter Revision mode.
- Badges and points: awarded only when the matching record exists.

## OpenAI

Copy `.env.example` to `.env` and set `OPENAI_API_KEY`. Restart `npm run dev`.

The key is read only by `server/apiPlugin.ts`. It is not bundled into the client. Quiz and flashcard replies must match the Zod schemas in `src/services/persistence/schema.ts` before they are shown. A reply that fails that check is discarded and the local bank is used. Coach replies that fail, or that arrive without a key, stay on the local engine, and the transcript marks the source.

Optional: `OPENAI_MODEL` (default `gpt-4o-mini`).

## Supabase

Not connected at runtime. The UI persists through `LearningRepository` in `src/services/persistence/repository.ts`, which this demo implements with `localStorage`. `supabase/schema.sql` is a prepared table and row-policy sketch for a later adapter. Setting `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` does not sync data in this build.

## Checks

```bash
npm run build
npx oxlint src server
npx vite-node src/selfCheck.ts
```
