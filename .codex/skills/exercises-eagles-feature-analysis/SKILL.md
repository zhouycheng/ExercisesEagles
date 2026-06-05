---
name: exercises-eagles-feature-analysis
description: "Use for ExercisesEagles / 题小鹰 requirement analysis, existing-feature analysis, bug analysis, interaction chains, logic trees, feature-network placement, product boundary discussion, dependency analysis, and source-grounded clarification before design or implementation."
---

# ExercisesEagles Feature Analysis

Use this skill before designing or implementing non-trivial 题小鹰 changes.

## Required Context

- Read `README.md`, `docs/workflow/git.md`, and relevant docs under `docs/`.
- For question-bank data flow, read `docs/workflow/question-banks.md`; for import, release, explanation, ticket, or source-ledger rules, route to `$question-bank-curator`.
- Inspect the actual source, tests, scripts, config, and Git state relevant to the request.
- When current framework behavior, Mini Program APIs, tooling, or product practice affects the answer, verify against official or credible current sources.

## Analysis Focus

- State the user goal and the exact behavior or problem being analyzed.
- Map affected flows: home, book detail, quiz, review/result, question-bank loading, Mini Program packaging, or project workflow.
- Trace interaction chains through pages, ViewModels, repositories, data utilities, and `QuizSession`.
- Identify logic branches, state transitions, persistence keys, URL parameters, and fallback behavior.
- Identify dependencies on runtime question-bank files, manifest/latest files, images, `project.config.json`, or WeChat Developer Tools.
- Separate confirmed facts from assumptions, stale docs, and questions that need user confirmation.

## Output

Return inline analysis unless the user asks for a file such as `analysis.md`.

Include:

- Current-state summary grounded in files.
- Interaction chain or logic tree when useful.
- Product and engineering boundaries.
- Risks, ambiguity, and evidence gaps.
- Recommended next skill: `$exercises-eagles-feature-design`, `$exercises-eagles-test-plan`, `$exercises-eagles-implementation`, `$question-bank-curator`, or no follow-up.

Do not write implementation code from this skill unless the user has directly asked for implementation in the same turn.
