# AYNI Twin

**A Spanish-first, interactive demonstration of human-led student support.**

[Open the live demo](https://main.ds9xcp2xdxwdm.amplifyapp.com/)

AYNI Twin explores a common educational challenge: warning signs such as declining attendance, grades, and unfinished work can be difficult to interpret together. The experience helps an educator inspect those signals, compare possible support actions, and draft a plan for human review. It is a hackathon prototype—not a diagnostic tool, a validated predictor, or a production school system.

## Five-stage experience

1. **Impact Dashboard:** prioritize fictional student trajectories with an explainable risk estimate.
2. **Student Twin:** inspect the factors and trends behind one profile.
3. **Future Lab:** adjust support options and compare simulated scenarios.
4. **Support Plan:** edit and approve a local, 14-day draft.
5. **Impact Proof:** compare the estimate with a hypothetical follow-up result.

All 30 profiles, records, and follow-up outcomes are fictional or simulated. The calculations run deterministically in the browser; their percentages are illustrative assumptions, not scientific probabilities or measured educational impact. A teacher remains responsible for interpreting and approving any proposed action.

## Current architecture

The public application is a static Next.js export hosted on AWS Amplify Hosting. It needs no login, backend, database, or environment variables. Changes made in the interface are not persisted across sessions. The `infrastructure/` directory is retained as a historical technical prototype; it is **not deployed or used by the public app**.

Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Vitest, and AWS Amplify Hosting.

## Run locally

Use Node.js 20 or newer and npm:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. No credentials or `.env` file are required.

## Validate and export

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`next.config.ts` sets `output: "export"`; the production build generates `out/`. Only the **contents** of `out/` are uploaded for the current manual, static Amplify deployment. Git pushes do not update that deployment automatically. See the [static deployment runbook](docs/deployment-runbook.md).

## Project layout

| Path | Purpose |
| --- | --- |
| `src/app/` | App Router entry point, layout, and styles |
| `src/components/` | Five-stage interface and shared UI |
| `src/data/` | Synthetic student profiles |
| `src/lib/` | Deterministic risk and simulation logic; an unused API prototype remains in the repository |
| `src/types/` | Shared TypeScript types |
| `public/img/` | AYNI visual assets |
| `docs/` | Design, responsible-use, and deployment notes |
| `infrastructure/` | Undeployed historical prototype |

## Responsible use and limitations

The interface identifies itself as **“Modo demostración · Datos sintéticos.”** Do not enter real student information. There is no authentication, persistence, institutional access control, or validation with real educational outcomes. Impact Proof shows a hypothetical example, not observed improvement. Before any real-world pilot, the model and workflow would need educator review, accessibility testing, privacy safeguards, and independent evaluation.

Possible future work—not implemented in this release—includes usability studies with educators, stronger accessibility checks, and evaluation of whether the explanations help human decisions without causing harm.

## Development and verification

Codex was used as the coding agent. A read-only AWS CLI request verified the Amplify application as a static `WEB` app; no cloud resources are created by this repository audit. The frontend has passed linting, TypeScript checks, a production static build, and 21 automated tests across five test files.

Feedback is welcome through repository issues. Contributions should respect the synthetic-data boundary and the human-oversight principles above.

## License

No license has been selected for this repository. Do not assume permission to reuse its code or assets beyond applicable law.
