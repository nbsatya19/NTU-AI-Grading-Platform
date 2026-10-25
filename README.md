# GRADE - Grading Risk and Decision Error Disclosure (NTU)

Group project for the AI for Literacy course.

**Live site: [https://nbsatya19.github.io/NTU-AI-Grading-Platform/](https://nbsatya19.github.io/NTU-AI-Grading-Platform/)**

## Running locally

Prerequisites: [Node.js](https://nodejs.org) 18.18 or later.

```bash
# from inside the project folder
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in a browser. (If you have [pnpm](https://pnpm.io) installed, `pnpm install && pnpm dev` works too — a `pnpm-lock.yaml` is included.)

## Deployment

The site is built as a static export (`output: "export"`) and deployed to GitHub Pages by `.github/workflows/deploy-pages.yml` on every push to `main`.

Dynamic course and assessment pages are pre-rendered for the IDs listed in `lib/static-params.ts` — add new IDs there.
