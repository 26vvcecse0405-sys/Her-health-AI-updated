# SkillSprint

Personalized AI learning companion for the NIT Surathkal student innovation competition. A student names a career, takes a scored diagnostic, and follows a roadmap built from those answers, their interests, and the time they have.

Tagline: Discover Your Potential. Engineer Your Future.

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints, usually http://localhost:5173.

No account and no API key are required.

- **Try Live Demo** or **Explore Interactive Demo** opens Ananya Rao, a fictional student. Her assessment, gaps, roadmap, quiz, and badges are stored separately from a profile you create.
- **Start My Journey** saves a profile in this browser and starts onboarding, then the assessment.
- **Reset demo** in the header restores Ananya’s record. **Clear my profile** on the Profile page removes only the student record. **Exit demo** returns to your own profile.

Progress stays in `localStorage`. It is not a password-backed account and it is not synced across devices.

## What is calculated

- Assessment score: each question has a correct option. Foundation items weigh 1, intermediate 2, advanced 3. A skill score is earned weight divided by possible weight, rounded to the nearest whole number.
- Skill gap: `max(0, career target − demonstrated score)`. Confidence ratings from onboarding are not the score.
- Priority: `gap × 1.3 if the skill is core for the career × 1.15 if it matches a selected interest`. This orders study tasks. It is not a hiring score.
- Roadmap: assembled from the task catalog using gaps, learning style, and the study budget. The screen says when a plan is rules-based. Career targets are configurable guidance, not employment predictions.
- Quizzes: scored from the options you submit. Wrong answers enter Revision and clear only when the keyed answer is chosen.
- Badges and points: awarded only when the matching record exists.

## OpenAI

Copy `.env.example` to `.env` and set `OPENAI_API_KEY`. Restart `npm run dev`.

The key is read only by `server/apiPlugin.ts`. It is not bundled into the client. Quiz and flashcard replies must match the Zod schemas in `src/services/persistence/schema.ts` before they are shown. A reply that fails that check is discarded and the local bank is used. Coach replies that fail, or that arrive without a key, stay on the local tutor, and the transcript marks the source.

The API routes exist while `npm run dev` or `npm run preview` is running. A static file host does not include them, and the app then stays on the labelled demo tutor and local bank.

Optional: `OPENAI_MODEL` (default `gpt-4o-mini`).

## Supabase

Not connected at runtime. The UI persists through `localStorage`. `supabase/schema.sql` is a prepared table and row-policy sketch for a later adapter. Setting `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` does not sync data in this build.

## Checks

```bash
npm run build
npx oxlint src server
node --experimental-strip-types src/selfCheck.ts
```
