# Contenido para AWS Builder Center

## Title

AYNI Twin: Simulating Better Futures for Students

## Short description

AYNI Twin is a Spanish-first interactive demo that helps educators inspect fictional early-warning signals, compare support scenarios, draft a human-reviewed plan, and explore a hypothetical follow-up.

## Problem

Schools often identify academic difficulties only after a student has already failed, accumulated absences, or disengaged. Attendance, grades, and pending work may exist in separate records, but a teacher still needs to understand why a learner needs attention and what realistic action to take next.

## Solution

AYNI Twin turns synthetic attendance, grade trends, and assignment data into a transparent student model. Educators can inspect the factors behind a deterministic risk score, adjust five support options, compare three simulated trajectories, and prepare an editable fourteen-day support plan locally in the browser.

Impact Proof compares the estimate with a hypothetical follow-up result. Both figures are simulated; the difference illustrates how a future real-world review might prompt a new human decision.

## What makes it different

AYNI Twin demonstrates a complete, explainable support-planning loop without presenting a simulation as a prediction:

1. Detect a trajectory that needs attention.
2. Explain observable factors.
3. Simulate alternative interventions.
4. Create and approve a practical plan.
5. Compare the estimate with a fictional follow-up example.

## Current hosting architecture

- AWS Amplify Hosting serves the static Next.js export.
- All profiles, calculations, plans, and interactions run locally in the browser.
- No backend, database, authentication, or generative AI service is used by the public app.

The repository retains an undeployed infrastructure prototype, which is not part of this submission's live architecture.

## Responsible use

AYNI Twin does not diagnose, label, or automatically decide a student’s future. The risk calculation is deterministic and visible. All records and outcomes are synthetic, and a teacher must review the example plan. The model has not been validated for real educational decisions.

## How the coding agent helped

Codex helped implement and test the risk and simulation engines, build the responsive five-stage interface, and verify the static export. The agent also performed a read-only AWS CLI check of the Amplify application. Human decisions determined the product scope, visual direction, ethical boundaries, and deployment authorization.

## Tags

`#social-good` `#startup` `#aws-amplify` `#education`

## Final links

- Live application: https://main.ds9xcp2xdxwdm.amplifyapp.com/
- Source repository: `[PENDING]`
- Demo video: `[PENDING]`
- Current architecture: `docs/architecture.md`

Replace the remaining `[PENDING]` values only after verifying each public artifact.
