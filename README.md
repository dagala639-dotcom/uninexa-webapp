# UniNexa Web App

UniNexa is a student admissions workspace for Kenyan learners applying to international universities. The platform combines student onboarding, document management, scholarship discovery, application workflows, advisor messaging, and university-side applicant review.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Supabase Auth, Database, and Storage
- OpenAI API for the university matcher
- `jsPDF` and `html-to-image` for application PDF export

## Main Areas

- Student portal: profile, documents, universities, applications, scholarships, messages
- Admin console: students, documents, KCSE verification, applications, universities, messaging
- University portal: routed applicants, documents, decisions, settings, messaging
- Partner intake: university onboarding form and file uploads

## Environment Variables

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
```

`OPENAI_API_KEY` is optional for local development. If it is missing or unavailable, the AI matcher falls back to demo recommendations. The matcher is authenticated and only available to signed-in users.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes

- Route protection is handled server-side through `proxy.ts`.
- This repo uses Next.js 16 conventions. Check `node_modules/next/dist/docs/` before making framework-level changes.
- Supabase Row Level Security should still be treated as the primary data-security layer.
