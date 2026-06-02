---
name: question-bank-curator
description: Use for the Tixiaoying project when importing, normalizing, validating, committing, publishing, or maintaining question-bank data from source-files into question-banks and miniprogram/data/question-banks. Handles Git-like question-bank workspaces, release commits, source documents, generated JSON, import tickets, release blocking, concise verified explanations, duplicate handling, and manifest-driven textbook grouping rules.
---

# Question Bank Curator

Use this skill only for `/Users/leftzhou/WorkSpace.localized/题小鹰/project`.

## Scope

Maintain question-bank data only. Do not modify Mini Program code unless the user explicitly asks for code changes.

Project paths:

- Source inputs: `/Users/leftzhou/WorkSpace.localized/题小鹰/source-files`
- Canonical generated bank: `/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks`
- Editable workspaces: `/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/workspaces`
- Published releases: `/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/releases`
- Mini Program runtime snapshot: `/Users/leftzhou/WorkSpace.localized/题小鹰/project/miniprogram/data/question-banks`
- Source processing ledger: `/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/source-ledger.json`

## Required References

- Before creating, validating, publishing, syncing, or consuming question-bank data, read `references/question-bank-format.md`.
- Before importing source files, continuing an import, handling tickets, or committing a release, read `references/import-workflow.md`.
- Before writing explanations, read `references/explanation-standard.md`.
- Before claiming a workspace, release, or runtime snapshot is usable, read `references/validation-checklist.md` and run the relevant checks.

## Core Rules

- Source files are evidence. Do not edit files under `source-files`.
- Inspect existing `latest.json`, `source-ledger.json`, workspaces, and releases before deciding current state. Do not infer current state from source filenames alone.
- Track source processing state in `question-banks/source-ledger.json`; never mark status by editing files under `source-files`.
- Do not build or rely on an automatic parser/generator script as the primary way to create question banks. The agent must read source files and directly curate/write the bank according to these rules.
- Scripts are allowed only for mechanical assistance such as listing files, counting questions, validating JSON, checking duplicates, rendering reports, or wrapping runtime JSON as JS. They must not be the main author of stems, options, answers, placements, or explanations.
- Question stems, option text, answer keys, and answer text must be copied exactly from source material unless a user-confirmed ticket explicitly changes generated output.
- Do not auto-fix punctuation corruption, mojibake, broken options, broken answers, suspicious formatting, source/content mismatch, or unclear placement. Put these into an import ticket for human confirmation.
- Explanations are not copied blindly and must not be invented. Generate them only after searching/verifying against source context or reliable references.
- Explanations must be accurate, plain-language, and short: at most 2 display lines. Prefer 1-2 concise Chinese sentences.
- If an explanation cannot be verified, create a blocking ticket instead of publishing.

## Git-Like Release Model

Default import output is a workspace, not a release.

- `workspaces/`: editable question-bank working trees. Use for ongoing chapter/unit imports and metadata fixes before the user decides to commit.
- `releases/`: immutable published commits. Create only after the user explicitly asks to commit, release, or publish.
- `latest.json` and the Mini Program runtime snapshot must point only to a published release.
- A release/runtime sync must update every runtime index file and its Mini Program module wrapper in the same operation, including `manifest.json`, `manifest.js`, `latest.json`, `latest.js`, and any newly introduced app-facing index/catalog file.

Do not create a new release just because one chapter/unit was imported. Continue updating the active workspace until the user asks to commit/release/publish.

## Textbook Model

Use these fields:

- `questionType`: answer behavior. Allowed current values: `single`, `multiple`, `judge`.
- `groupType`: textbook group/source. Values are defined by the import manifest, workspace config, or release config, not by this skill.

Do not hard-code textbook names, group names, lesson names, or file-name exceptions in the skill. Treat any source label for a group, assignment, test, unit, lesson, or section as manifest data.

The import manifest or workspace config must define:

- `bookId` and `bookName`
- chapter IDs/names/order
- allowed `groupType` values for that book
- source-file to chapter/group mapping
- explicit include/exclude rules for source files
- source-specific duplicate decisions, if already confirmed by the user
- sampling presets such as chapter range, pretest range, homework range, or full-book range when the book needs them

Chapter names in generated bank data must be pure titles. Do not copy source order prefixes (`1-`), lesson labels (`第1课`), or composed UI labels (`第 1 章： 标题`) into `chapter.name`; store order separately and let the UI compose the chapter label.

## Duplicate Rules

Static textbook question banks should not contain duplicate question content.

- Exact duplicate means stem, options, and answers are all equivalent after formatting normalization.
- Exact duplicates should be stored once with multiple `placements`.
- If the same question belongs to multiple chapters or groups, show it in every declared placement, but deduplicate by `questionId` during sampling/review sessions.
- Same stem with different options or answers is a conflict. Create a blocking ticket.
- Same source ID with different content is not a duplicate; the source ID is unreliable. Create/record an internal stable `questionId`, and create a ticket if the conflict affects import confidence.
- Record/notebook books do not duplicate question content. They reference existing `questionId`s, and their chapter/group names must come from app config or release config.

## Weight And Scoring

- Store question importance as `weight`; normal questions use `weight: 1`.
- Preserve source-system scores as normalized `sourceMeta.rawScore` for audit only: default `5`, keep source values greater than `5`, and convert `0` or lower/equal values to `5`.
- `sourceMeta.rawScore` does not affect question review, full review, sampling, or chapter display.
- Simulated tests compute actual displayed points at runtime from the configured test total and the selected questions' weights.
- A suspicious source `score` value is not a data-quality blocker unless the source explicitly says it is a question weight.

## Release Blocking

Never publish directly from an unready workspace.

If any pending ticket exists and the user asks to commit, release, publish, or sync runtime, respond with:

```text
不能发布。还有未处理工单：
<absolute ticket path>
请先处理工单后再发布。
```

Do not bypass this rule.
