# Import Workflow

Use this workflow for importing, continuing, committing, publishing, or syncing question-bank data.

## Contents

- State Model
- Start Or Continue Workspace
- Import Plan
- Curate Questions
- Tickets
- Workspace Ready
- Commit Release
- Blocking Message

## State Model

Question-bank data follows a Git-like model:

```text
data/source-files -> data/question-banks/workspaces -> data/question-banks/releases -> latest/runtime
```

Default import output is `workspaces/<workspaceId>`. Do not create a release during normal chapter/unit imports.

Statuses:

- `draft`: workspace is being edited.
- `blocked`: unresolved ticket exists.
- `ready`: workspace has no blocking ticket and passes workspace validation.
- `released`: ready workspace was committed into an immutable release.

Only update `latest.json` and `miniprogram/data/question-banks` after a successful release commit.

## Start Or Continue Workspace

1. Inspect canonical `latest.json`, `source-ledger.json`, `workspaces/`, and `releases/`.
2. If the user says to continue, resume the active workspace when one exists.
3. If no active workspace exists, create `workspaces/<workspaceId>/`.
4. Set `baseReleaseVersion` to current latest release version.
5. Create or update `workspace.json`, `manifest.json`, `import-plan.md`, and `checks.json`.

Recommended workspace ID:

```text
wb-YYYYMMDD-<bookSlug-or-batchSlug>
```

## Import Plan

Before writing chapter bank files, produce an import plan in the workspace.

The import plan must list:

- book ID and book display name
- chapter IDs, pure chapter names, and order
- allowed group types for the book
- source-file to chapter/group mapping
- include/exclude rules
- duplicate or source-content mismatch suspicions
- missing source files or unexpected files
- sampling presets required by the book
- questions requiring user confirmation

If any mapping, duplicate, malformed source, or missing-content issue would risk wrong data, create a ticket and set workspace status to `blocked`.

## Curate Questions

For each source question:

1. Extract text without changing source content.
2. Identify `questionType` and `groupType`.
3. Copy stem, option text, answer keys, and answer text exactly.
4. Set `weight: 1` unless the user or import manifest explicitly defines a different weight.
5. Preserve source score as normalized `sourceMeta.rawScore`: default `5`, convert `0` or `<= 5` to `5`, preserve values greater than `5`.
6. Verify the explanation using source context and reliable references.
7. Write a short verified explanation following `explanation-standard.md`.
8. Detect duplicates, conflicts, malformed content, and unverifiable analysis.
9. Update workspace bank JSON, manifest, source ledger, and checks.

Scripts may help count, validate, detect duplicates, or generate JS wrappers. Scripts must not be the primary author of stems, options, answers, placements, or explanations.

## Tickets

Generate a Markdown ticket only when there is something to resolve. Tickets are audit records, not the user's editing surface.

Ticket states:

```text
open -> waiting_user_choice -> resolved -> released
```

Any ticket in `open` or `waiting_user_choice` blocks release and runtime sync.

Ticket triggers include:

- punctuation corruption or mojibake
- suspicious line breaks in stems/options/answers
- option text stuck together
- missing or malformed answers
- answer not found in options
- unknown question type
- explicit weight that is missing, malformed, or not confirmed by the user/import manifest
- same stem with different answer/options
- exact duplicate requiring source placement confirmation
- unclear chapter/group assignment
- source filename/content mismatch
- unverifiable explanation
- any uncertainty that would risk wrong question-bank data

When a ticket exists, ask the user to resolve it with choices instead of free-form editing.

Prompt format:

```text
阻断项 1：<short title>
位置：<source file / questionId / field>
原文：<original content>
建议：<proposed handling>

A. <recommended action>
B. <alternate action>
C. 暂不发布，保留待处理
```

The user may answer multiple items at once, for example `A A C`. Map choices by order. If the number of choices does not match unresolved items, ask again.

After applying choices, write the decision into the ticket, `importDecisions`, `manualChanges` or `metadataChanges`, and the workspace/release manifest as appropriate.

## Workspace Ready

Set workspace status to `ready` only when:

- all tickets are resolved
- `blockingTickets` is empty
- workspace validation passed
- source-ledger entries for imported files are `workspace`
- no source file is silently ignored

Do not update `latest.json` or runtime when a workspace becomes ready.

## Commit Release

Create a release only when the user explicitly asks to commit, release, publish, or sync a ready workspace.

Release rules:

- Run full release validation against the ready workspace before copying.
- Copy the validated ready workspace to `releases/<releaseVersion>/`.
- Set `status: released`.
- Set `publishable: true`.
- Record `sourceWorkspaceId` and `previousReleaseVersion`.
- Update canonical `latest.json`.
- Update `source-ledger.json` entries from `workspace` to `released`.
- Sync Mini Program runtime bank JSON, `manifest.json`, `latest.json`, and all paired `.js` wrappers, including `manifest.js`, `latest.js`, and per-bank wrappers.
- Update any newly introduced app-facing runtime index/catalog file during the same release sync. Do not leave release-visible indexes stale or manual-only.
- Mark the workspace as `released`.

Recommended release version:

```text
vN-<bookSlug-or-batchSlug>
```

Use meaningful scope names such as:

```text
v3-college-english-unit-1-to-3
v4-mental-health-ch001-to-ch007
v5-college-chinese-metadata-title-fix
```

## Blocking Message

If any unresolved ticket exists and the user asks to commit, release, publish, or sync runtime, respond exactly with:

```text
不能发布。还有未处理工单：
<absolute ticket path>
请先处理工单后再发布。
```
