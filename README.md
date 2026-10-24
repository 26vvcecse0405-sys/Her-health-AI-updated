# HerHealth AI

Understand your health. Find the right care. Feel supported.

HerHealth AI with **SAKHI** is an educational hackathon prototype. SAKHI is the health companion. The app connects women’s health notes, an offline assistant, and explainable hospital ranking. It is **not a medical device**. It does not diagnose, prescribe, or replace a clinician or emergency service.

English is the language until a person chooses another one in the header or Settings. The selector also offers Kannada, Hindi, Gujarati, Marathi, Tamil, Telugu, Bengali, Malayalam, Punjabi, Odia, and Urdu. Urdu uses a right-to-left layout. Translations other than English are demonstration drafts, not professionally reviewed medical translations. A missing line stays in English. The app does not follow the browser language. The IndexedDB name is unchanged so existing local notes stay available.

The demonstration profile is **Meera H.**, a fictional person in the fictional village of Malenahalli. Hospital names, phone numbers, beds, and doctors are invented. Traffic is simulated.

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints, usually http://localhost:5173.

No account and no API key are required. The curated assistant, sample report text, bill math, medicine comparison, and hospital ranking all work in demo mode.

```bash
npm run check
npm run build
```

`npm run check` ranks the fictional hospitals, parses the sample bill and prescription, and checks that urgent and dose questions do not become diagnoses.

## Three-minute demo

1. Open the dashboard. The greeting is from **SAKHI**. English is selected until you choose another language in the header.
2. Open **MamaSignal** or **IronWise**. Select a symptom. If you select heavy bleeding, chest pain, or trouble breathing, the emergency instruction appears immediately.
3. Save a note. Open **Health-to-care bridge** and go to the hospital finder.
4. Open **Scan report** and choose **Use supplied sample text**. The low hemoglobin is marked outside the printed interval and is not called anemia. Optional: **Read a generated sample image** uses in-browser OCR and needs a network the first time so Tesseract can fetch its language data.
5. Open **SAKHI**. Ask “What should I carry to a visit?” The source line says the answer was curated on this device. Then ask “How many iron tablets should I take?” The app refuses to give a dose.
6. Turn on **Simulate rural offline**. This is a demo switch. It is not the same as the browser losing its network.
7. Ask the saved FAQ again and open **Offline directory**. Search “Greenfield”. Read the last sync time. The banner says beds and traffic were not refreshed.
8. Save a symptom while the simulation is on. It appears in **Queued changes**.
9. Turn the simulation off and press **Retry local sync**. The queue clears on this device. Nothing is uploaded to a health cloud.
10. Open **Find hospital** with pregnancy care and **heavy** traffic. Greenfield Women’s Hospital leads because the longer highway is the faster simulated route and obstetrics is listed. The village PHC is nearer and is ranked lower because obstetrics and gynecology is not listed. Switch traffic to **light** and the shorter town road becomes Greenfield’s chosen route. Switch the place to **Nelamangala** and the taluk hospital leads.
11. Open **Why this match?** Missing beds or doctors say they added no points.
12. Open **Care Passport**, select the fictional timeline, read the preview, tick the review box, then download.

## What works without external services

- Symptom journals for pregnancy, iron, cycle pain, menopause, skin, mood, and food notes
- Fixed urgent-symptom rules that run before any chat
- Charts from saved notes
- Sample report, prescription, and bill review
- Curated English and Kannada answers stored in the app
- IndexedDB cache, offline hospital search, and a local sync queue
- Explainable ranking of six fictional hospitals
- Care Passport preview and download
- Privacy controls: delete, export, location permission, model consent, clear data

## What needs configuration

Copy `.env.example` to `.env` and restart `npm run dev`. None of these are required for the demo.

| Variable | Purpose |
| --- | --- |
| `OLLAMA_BASE_URL`, `OLLAMA_MODEL` | Local model through Ollama, for example `ollama pull qwen2.5:0.5b` then `OLLAMA_BASE_URL=http://127.0.0.1:11434` |
| `LOCAL_LLM_BASE_URL`, `LOCAL_LLM_MODEL`, `LOCAL_LLM_API_KEY` | Any local OpenAI-compatible server. Used instead of Ollama when set |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | Optional online model. The key stays in the Vite server plugin and is not bundled |

The assistant calls a model only when **Privacy → allow a configured model** is on, the browser is online, and simulated offline is off. Urgent wording, dose requests, and “do I have…” questions are answered by fixed rules and are not sent as the decision path. Replies that look like a diagnosis or a dose are discarded.

OCR uses [Tesseract.js](https://github.com/naptha/tesseract.js) in the browser. The first read downloads English trained data from the library’s default host. If that fails, the screen says extraction did not succeed and the supplied sample text still works. Images are not uploaded to this app’s server.

There is no live map, traffic, or bed API. `src/data/hospitals.ts` is the integration point: replace the fictional rows, keep the route fields, and `src/services/rank.ts` will explain the same factors. Do not invent live capacity.

## Offline limits

- **Simulate rural offline** only changes the app’s behavior. The dev server can still be reachable.
- A real browser-offline event shows a separate banner.
- The service worker is registered in `npm run build` / `npm run preview`, not during `npm run dev`. After one online visit to the production build, the app shell can open from cache. Live traffic and bed counts still cannot be fetched offline.
- Hospital search offline uses the last IndexedDB copy and shows the dataset’s base travel time, not a new traffic check.
- “Sync” merges the on-device queue and refreshes the fictional hospital rows. It does not create a cloud record.

## Safety

Urgent symptoms such as heavy bleeding, trouble breathing, seizure, chest pain, and thoughts of self-harm show emergency instructions (112, 108, and Tele-MANAS 14416) without extra questions. Educational ranges for hemoglobin are labeled as education. The interval printed on a real report is the one that matters. The app will not recommend an iron dose.

## Stack

React, TypeScript, Vite, Tailwind CSS, React Router, Lucide, Recharts, IndexedDB, and a small Vite server plugin for optional models. The previous learning-app dependency set is still in `package.json`; this build does not use Supabase.
