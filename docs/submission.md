# Contenido para AWS Builder Center

## Title

AYNI Twin: Simulating Better Futures for Students

## Short description

AYNI Twin creates an explainable academic digital twin that helps teachers understand risk, compare support scenarios, generate a human-reviewed intervention plan, and measure what happened next.

## Problem

Schools often identify academic difficulties only after a student has already failed, accumulated absences, or disengaged. Attendance, grades, and pending work may exist in separate records, but a teacher still needs to understand why a learner needs attention and what realistic action to take next.

## Solution

AYNI Twin turns synthetic attendance, grade trends, and assignment data into a transparent student model. Teachers can inspect the factors behind a deterministic risk score, simulate five configurable interventions, compare three possible trajectories, and generate a structured fourteen-day support plan with Amazon Bedrock. Every plan remains editable and requires human approval.

After the review period, Impact Proof compares the approved estimate with the observed outcome. The system treats this difference as evidence to improve the next decision instead of hiding uncertainty.

## What makes it different

Most education AI demos stop at prediction or content generation. AYNI Twin demonstrates a closed, accountable loop:

1. Detect a trajectory that needs attention.
2. Explain observable factors.
3. Simulate alternative interventions.
4. Create and approve a practical plan.
5. Compare the estimate with observed evidence.

## AWS architecture

- AWS Amplify Hosting for the Next.js experience.
- Amazon API Gateway for the public HTTP API.
- AWS Lambda for validation, deterministic simulation orchestration, and plan generation.
- Amazon DynamoDB for synthetic profiles, scenarios, plans, and interventions.
- Amazon Bedrock for structured plan drafts.
- Amazon CloudWatch for technical logs and operational evidence.

The application keeps a validated local fallback so a temporary model or network failure does not interrupt the demonstration.

## Responsible AI

AYNI Twin does not diagnose, label, or automatically decide a student’s future. The core risk score is deterministic and visible. Sensitive attributes are excluded. The demo uses only synthetic data, identifies simulations as assumptions, validates Bedrock output, and requires a teacher to review and approve every action.

## How the coding agent helped

The coding agent translated the product plan into a phased workflow, implemented and tested the risk and simulation engines, created the complete responsive interface, built the AWS SAM backend, added validation and fallback behavior, and repeatedly verified the user journey in the browser. Human decisions remained responsible for product scope, visual direction, ethical boundaries, and cloud deployment authorization.

## Tags

`#social-good` `#startup` `#amazon-bedrock` `#aws-lambda` `#amazon-dynamodb` `#aws-amplify` `#serverless` `#generative-ai`

## Final links

- Live application: `[PENDING]`
- Source repository: `[PENDING]`
- Demo video: `[PENDING]`
- Architecture diagram: `public/img/AYNI-AWS-Architecture.svg`

Replace every `[PENDING]` value only after verifying the public artifact.
