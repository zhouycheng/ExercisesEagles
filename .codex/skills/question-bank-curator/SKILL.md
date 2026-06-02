---
name: question-bank-curator
description: Use for the Tixiaoying project when importing, normalizing, validating, versioning, publishing, or maintaining question-bank data from source-files into question-banks and miniprogram/data/question-banks. Handles source documents, generated JSON, import tickets, release blocking, concise verified explanations, duplicate handling, and manifest-driven textbook grouping rules.
metadata:
  short-description: Maintain Tixiaoying question banks
---

# Question Bank Curator

Use this skill only for the `/Users/leftzhou/WorkSpace.localized/题小鹰/project` project.

## Scope

Maintain question-bank data only. Do not modify mini program code unless the user explicitly asks for code changes.

Project paths:

- Source inputs: `/Users/leftzhou/WorkSpace.localized/题小鹰/source-files`
- Canonical generated bank: `/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks`
- Mini program runtime snapshot: `/Users/leftzhou/WorkSpace.localized/题小鹰/project/miniprogram/data/question-banks`
- Source processing ledger: `/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/source-ledger.json`

## Core Rules

- Source files are evidence. Do not edit files under `source-files`.
- Track source processing state in `question-banks/source-ledger.json`; never mark status by editing files under `source-files`.
- Do not build or rely on an automatic parser/generator script as the primary way to create question banks. The agent must read source files and directly curate/write the bank according to these rules.
- Scripts are allowed only for mechanical assistance such as listing files, counting questions, validating JSON, checking duplicates, or rendering reports. They must not be the main author of stems, options, answers, placements, or explanations.
- Question stems, option text, and answer text must be copied exactly from source material.
- Do not auto-fix punctuation corruption, mojibake, broken options, broken answers, or suspicious formatting. Put these into an import ticket for human confirmation.
- Explanations are not copied blindly and must not be invented. Generate them only after searching/verifying against source context or reliable references.
- Explanations must be accurate, plain-language, and short: at most 2 display lines. Prefer 1-2 concise Chinese sentences.
- If an explanation cannot be verified, create a blocking ticket instead of publishing.
- If any ticket is created, the generated bank goes to a pending/staging directory and must not be published.
- If the user asks to publish while blocking tickets exist, refuse and repeat the exact ticket path(s).

## Data Format Contract

Before creating, validating, publishing, or syncing question-bank data, read `references/question-bank-format.md`.

That reference defines the directory layout, JSON schemas, Mini Program runtime module rules, version/latest/index rules, source-ledger rules, ticket front matter, and validation checklist.

## Textbook Model

Use these fields:

- `questionType`: answer behavior. Allowed current values: `single`, `multiple`, `judge`.
- `groupType`: textbook group/source. Values are defined by the import manifest or release config, not by this skill.

Do not hard-code textbook names, group names, lesson names, or file-name exceptions in the skill. Treat any source label for a group, assignment, test, unit, lesson, or section as manifest data.

The import manifest must define:

- `bookId` and `bookName`
- chapter IDs/names/order
- allowed `groupType` values for that book
- source-file to chapter/group mapping
- explicit include/exclude rules for source files
- source-specific duplicate decisions, if already confirmed by the user

## Duplicate Rules

Static textbook question banks should not contain duplicate question content.

- Exact duplicate means stem, options, and answers are all equivalent after formatting normalization.
- Exact duplicates should be stored once with multiple `placements`.
- If the same question belongs to multiple chapters or groups, show it in every declared placement, but deduplicate by `questionId` during sampling/review sessions.
- Same stem with different options or answers is a conflict. Create a blocking ticket.
- Same source ID with different content is not a duplicate; the source ID is unreliable. Create/record an internal stable `questionId`, and create a ticket if the conflict affects import confidence.
- Record/notebook books do not duplicate question content. They reference existing `questionId`s, and their chapter/group names must come from app config or release config.

## Import Workflow

1. Read source files and any import manifest from `source-files`.
2. Extract text without changing content.
3. Split into candidate questions.
4. Identify `questionType` and `groupType`.
5. Copy stem, options, and answers exactly.
6. Search/verify the knowledge needed for the explanation.
7. Generate a short verified explanation, at most 2 display lines.
8. Detect duplicates, conflicts, malformed content, and unverifiable analysis.
9. If any issue exists, generate a Markdown ticket, write output to a pending directory only, and ask the user to resolve each blocking item through multiple-choice prompts.
10. Apply the user's choices, update the ticket and manifest logs, then revalidate.
11. Update `source-ledger.json` with source hashes, status, release/staging/ticket links, counts, and timestamps.
12. If no unresolved issue remains, generate a release, sync the runtime snapshot, and create Mini Program-compatible JS module wrappers for runtime question-bank data.

## Output Layout

When clean:

```text
question-banks/releases/vN/
question-banks/latest.json
question-banks/source-ledger.json
project/miniprogram/data/question-banks/
```

Mini Program runtime snapshots should include both:

- canonical JSON files for data inspection and release traceability
- `.js` module wrappers that export the same data with `module.exports = ...`, because Mini Program `require()` loads JavaScript modules and may not reliably load raw `.json` files directly

When blocked:

```text
question-banks/staging/vN-pending-<importBatchId>/
question-banks/tickets/<importBatchId>.md
question-banks/source-ledger.json
```

Pending manifests must include:

```json
{
  "status": "pending",
  "publishable": false,
  "blockingTickets": [
    "/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/tickets/<importBatchId>.md"
  ]
}
```

## Source Ledger

Maintain `/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/source-ledger.json` whenever source files are scanned, staged, blocked, excluded, superseded, or released.

Do not write status markers into `source-files`.

Ledger statuses:

- `unprocessed`: question source exists but has not been imported into any staged or released bank.
- `staged`: generated into a pending/staging batch with no unresolved ticket yet.
- `blocked`: generated into staging but blocked by an open or waiting ticket.
- `released`: included in the latest publishable release.
- `superseded`: included in an older release that has been replaced by a newer release.
- `excluded`: explicitly not imported, or a support/aggregate file that is not a direct question source.

Each entry should include:

```json
{
  "sourceFile": "/Users/leftzhou/WorkSpace.localized/题小鹰/source-files/<file>",
  "sourceName": "<file>",
  "sourceType": "question-source",
  "status": "released",
  "sourceHash": "sha256:<hash>",
  "bookId": "<bookId>",
  "bookName": "<bookName>",
  "chapterId": "<chapterId>",
  "chapterName": "<chapterName>",
  "groupType": "<groupType>",
  "groupName": "<groupName>",
  "questionCount": 20,
  "releaseVersion": "vN-...",
  "stagingVersion": null,
  "ticket": null,
  "processedAt": "YYYY-MM-DD",
  "notes": []
}
```

Ledger summary should include total source files, direct question sources, released sources, blocked sources, unprocessed sources, and excluded/support sources.

## Ticket Rules

Generate a Markdown ticket only when there is something to resolve. If the import is clean, do not generate a ticket.

Tickets are audit records, not the user's editing surface. Do not ask the user to open the Markdown file and fill it in manually. The agent must present each blocking item as a short multiple-choice prompt in the conversation, then write the user's choice back into the ticket.

Ticket states:

```text
open -> waiting_user_choice -> resolved -> released
```

Any ticket in `open` or `waiting_user_choice` blocks release.

Ticket triggers include:

- punctuation corruption or mojibake
- suspicious line breaks in stems/options/answers
- option text stuck together
- missing or malformed answers
- answer not found in options
- unknown question type
- same stem with different answer/options
- exact duplicate requiring source placement confirmation
- unclear chapter/group assignment
- source filename/content mismatch
- unverifiable explanation
- any uncertainty that would risk wrong question-bank data

Ticket content must include:

- import batch ID
- pending output directory
- blocking status
- exact source file path
- chapter/group
- field involved
- original content
- reason it is blocked
- proposed handling, if any
- user choice and resolution result after the agent receives confirmation

Ticket Markdown should include a small machine-readable front matter block:

```yaml
---
batchId: <importBatchId>
status: waiting_user_choice
blocking: true
pendingDir: /Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/staging/vN-pending-<importBatchId>
releaseVersion:
---
```

Update the front matter when the ticket is resolved or released.

## Interactive Ticket Protocol

When a ticket exists, ask the user to resolve it with choices instead of free-form editing.

Rules:

- Convert every blocking item into one numbered multiple-choice question.
- Use at most 3 options per item.
- Put the recommended option first when there is a clear recommendation.
- The user may answer multiple items at once, for example `A A C`.
- Map choices by order. If the number of choices does not match the number of unresolved items, ask again.
- Do not apply any change to question stems, option text, answer keys, or answer text unless the choice explicitly confirms that change.
- After applying choices, write the decision into the ticket, `manualChanges`, and release/import manifest.
- If a choice keeps an issue unresolved, keep the ticket in `waiting_user_choice` and do not publish.

Choice prompt format:

```text
阻断项 1：<short title>
位置：<source file / questionId / field>
原文：<original content>
建议：<proposed handling>

A. <recommended action>
B. <alternate action>
C. 暂不发布，保留待处理
```

For source-data problems, the usual choices are:

```text
A. 按建议修正生成后的题库，并记录修改日志
B. 保留源文件原文，并记录保留原因
C. 本题或本批次暂不发布，继续保留工单
```

## Release Blocking

Never publish from `staging`.

If any pending ticket exists and the user asks to publish, respond with:

```text
不能发布。还有未处理工单：
<absolute ticket path>
请先处理工单后再发布。
```

Do not bypass this rule.

## Explanation Standard

For every generated explanation:

- Verify first by searching source context and reliable references.
- Prefer textbook/source context over broad web results.
- If external facts are needed, use reliable sources and keep an internal evidence note in the import report or release metadata.
- The app-facing explanation must be short, accurate, and easy to understand.
- Do not change stems, options, or answers to make the explanation fit.

Format:

```text
本题考查……。正确答案是……，因为……。
```

If 2 lines are needed, the second line should be an easy confusion or memory hint, not a long essay.
