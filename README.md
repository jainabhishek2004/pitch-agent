# Hyperion Pitch Studio

A **Next.js app + an Eve agent in one project** ([Vercel Eve](https://eve.dev/docs/introduction)). Paste a business card + a website → the **Eve agent** researches the company, finds its operational pains, picks the right Hyperion stack + AI agents, and builds a **brand-exact pitch PDF**.

Covers PRD modules 2 (profile), 3 (classification), 4 (pain diagnosis), 5 (product fit), 6 (feature mapping), 7 (custom pitch), 9 (AI agents), 10 (roadmap), 11 (follow-up email).

## How it works (per the Eve docs)

```
Browser (app/page.tsx)
  └─ useEveAgent() from "eve/react"  →  same-origin /eve/v1 routes (mounted by withEve)
        ▼
  EVE AGENT (agent/)  — model via AI Gateway, no API key on Vercel
     research_company → classify_business → search_knowledge_base
     → reason (modules 2-7,9,10) → generate_pitch_pdf → PDF URL
        ▼
  streamed back as assistant messages → UI shows the summary + the PDF
```

- **`next.config.mjs`** wraps the config in **`withEve`** — ships the frontend + the Eve agent as one project and mounts the `/eve/v1/*` routes. No proxy, no CORS, no URL env vars.
- **`app/page.tsx`** uses **`useEveAgent`** — `agent.send({ message })`, and `agent.data.messages` stream in. The agent ends its reply with `PDF: <url>`, which the UI turns into a download + preview.
- The agent's logic lives entirely in **`agent/`** (Eve filesystem-first).

## Project layout
```
pitch-agent/
  next.config.mjs            # withEve(nextConfig)
  app/                       # Next.js frontend
    page.tsx                 #   branded form, useEveAgent
    layout.tsx · globals.css
  agent/                     # the Eve agent (per Eve docs)
    agent.ts                 #   defineAgent({ model: "anthropic/claude-sonnet-4.6" })
    instructions.md          #   system prompt + rules
    tools/                   #   defineTool: research_company · classify_business · search_knowledge_base · generate_pitch_pdf
    skills/                  #   recommendation-rules · industry-playbooks · pitch-structure
    knowledge/               #   shared catalog (products, ai-agents, pain-points, recommendation-rules, company-positioning, brand-kit)
  lib/                       # shared logic the tools import (research, classify, pitch-template, render-pdf, storage, knowledge)
  knowledge-source/brochures # source brochure PDFs
  scripts/generate.mjs       # offline CLI: render a PDF without the agent (template testing)
```

## Run it locally
```bash
npm install
```
Give it a model key for local dev (on Vercel this isn't needed — see Deploy). Create `.env.local`:
```bash
# Either a Vercel AI Gateway key…
AI_GATEWAY_API_KEY=...
# …or a direct provider key:
ANTHROPIC_API_KEY=...
```
Then:
```bash
npm run dev        # → http://localhost:3000  (next dev + the eve dev server, wired together)
```
Open the URL, paste a card + website, click **Generate pitch**.

> **Offline PDF test (no agent / no key):** `npm run pitch -- "Navin Singh, ProcX Value Engineering Pvt. Ltd." "procx.in"` renders a PDF with the deterministic builder into `public/generated/` — handy for checking the brand template.

## Deploy to Vercel (the shareable team site)
```bash
vercel link        # authenticates — models resolve via AI Gateway + OIDC, NO API key to manage
vercel deploy
```
Then in the Vercel project:
- **AI Gateway** is used automatically via OIDC — no key needed.
- Add **`BLOB_READ_WRITE_TOKEN`** so generated PDFs upload to Vercel Blob and return a public link (locally they go to `public/generated/`).
- Add **team password protection** (or Google/email auth) so only your team can open it.

## Editing what the agent knows
Everything is in `agent/knowledge/` (the shared catalog used by both the tools and the rules):
- New product/feature → `products.json`
- Change which stack a business type gets → `recommendation-rules.json`
- New AI agent → `ai-agents.json` · New pain → `pain-points.json`

## Notes
- **Eve is in public beta.** `withEve` boots the eve dev server alongside `next dev`; production runs the agent as Vercel Functions.
- Products flagged `source: "prd"` (Manufacturing Ops, Central Kitchen Ops, etc.) should get a brochure before heavy pitching; `source: "brochure"` ones are fully detailed.
- Brochures mix `gudz.in` / `gudz.io` — defaulted to `gudz.in`.
