# Question Bank Format Contract

This document defines the question-bank directory layout and JSON contracts for the Tixiaoying project.

Read this reference before creating, validating, publishing, syncing, or consuming question-bank data.

## Directory Layout

```text
/Users/leftzhou/WorkSpace.localized/题小鹰/source-files/
  Raw source files. Read-only evidence. Never edit.

/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/
  Canonical generated question-bank workspace.

/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/releases/<releaseVersion>/
  Publishable canonical release. Contains one `manifest.json` and one or more bank JSON files.

/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/staging/<stagingVersion>/
  Pending generated output. Not publishable.

/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/tickets/
  Markdown import tickets and human-choice audit records.

/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/latest.json
  Canonical latest-release index.

/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/source-ledger.json
  Source-file processing ledger.

/Users/leftzhou/WorkSpace.localized/题小鹰/project/miniprogram/data/question-banks/
  Mini Program runtime snapshot.
```

## File Naming

Use stable, lowercase slugs for generated files.

```text
<bookSlug>-ch###.json      canonical/runtime bank JSON
<bookSlug>-ch###.js        Mini Program runtime module wrapper
manifest.json              release or staging manifest
latest.json                latest release/runtime index
source-ledger.json         source processing ledger
<importBatchId>.md         import ticket
```

Examples:

```text
college-chinese-ch001.json
college-chinese-ch001.js
v1-college-chinese-ch001
v1-pending-college-chinese-ch001
college-chinese-ch001.md
```

## Bank JSON

Top-level shape:

```json
{
  "status": "released",
  "publishable": true,
  "blockingTickets": [],
  "book": {
    "id": "book-college-chinese",
    "name": "大学语文"
  },
  "chapter": {
    "id": "ch-001",
    "name": "1-序二篇"
  },
  "groups": [],
  "resolvedTickets": [],
  "resolution": {},
  "release": {}
}
```

Rules:

- `status`: `pending`, `resolved`, or `released`.
- `publishable`: `true` only for release output with no blocking tickets.
- `blockingTickets`: absolute ticket paths. Must be empty for publishable releases.
- `book.id`: stable ID, not display text.
- `book.name`: display name.
- `chapter.id`: stable chapter ID, usually `ch-###`.
- `chapter.name`: display chapter name.
- `groups`: all chapter groups in display/sampling scope.

## Group Object

```json
{
  "id": "group-homework",
  "name": "课后作业",
  "sourceFile": "/Users/leftzhou/WorkSpace.localized/题小鹰/source-files/大学语文-1-序二篇.json",
  "questions": []
}
```

Rules:

- `id`: stable group ID.
- `name`: display group name.
- `sourceFile`: absolute source-file path.
- `questions`: source questions assigned to this group.
- `groupType` should be stored in manifest/release config. Do not infer hard-coded group names in code.

## Question Object

```json
{
  "questionId": "q-cc-ch001-homework-001",
  "sourceId": "college-chinese-xu-er-pian-001",
  "questionType": "single",
  "stem": "题干",
  "options": [
    { "key": "A", "keyLabel": "A", "text": "选项原文" }
  ],
  "answerKeys": ["A"],
  "score": 5,
  "difficulty": "easy",
  "tags": [],
  "explanation": "2行内解析",
  "explanationStatus": "verified"
}
```

Rules:

- `questionId`: generated stable internal ID. Use this for deduplication, favorites, wrong-book references, and sampling.
- `sourceId`: original source ID if available. It is evidence, not a stable app identity.
- `questionType`: answer behavior. Current values: `single`, `multiple`, `judge`.
- `stem`: copied from source, except user-confirmed ticket corrections.
- `options[].text`: copied from source, except user-confirmed ticket corrections.
- `answerKeys`: option keys, not option indexes.
- `explanation`: verified, accurate, plain Chinese, at most 2 display lines.
- `explanationStatus`: must be `verified` before release.

## Release Manifest

Top-level shape:

```json
{
  "version": "v1-college-chinese-ch001",
  "status": "released",
  "publishable": true,
  "createdAt": "YYYY-MM-DD",
  "importBatchId": "college-chinese-ch001",
  "book": {},
  "chapters": [],
  "outputs": [],
  "runtimeSnapshot": "/Users/leftzhou/WorkSpace.localized/题小鹰/project/miniprogram/data/question-banks",
  "blockingTickets": [],
  "resolvedTickets": [],
  "counts": {},
  "rules": {},
  "manualChanges": [],
  "verificationSources": []
}
```

Chapter/group shape:

```json
{
  "id": "ch-001",
  "name": "1-序二篇",
  "order": 1,
  "groups": [
    {
      "id": "group-homework",
      "name": "课后作业",
      "groupType": "homework",
      "sourceFile": "/absolute/source/path.json",
      "questionCount": 20
    }
  ]
}
```

Rules:

- `version`: immutable release version.
- `status`: `released` only for publishable release output.
- `outputs`: absolute paths to canonical release bank JSON files.
- `runtimeSnapshot`: absolute runtime snapshot directory.
- `manualChanges`: every user-confirmed correction to stems/options/answers.
- `verificationSources`: source files and reliable references used for explanations.

## Latest Index

Canonical latest index:

```json
{
  "version": "v1-college-chinese-ch001",
  "createdAt": "YYYY-MM-DD",
  "releaseDir": "/absolute/release/dir",
  "manifest": "/absolute/release/manifest.json",
  "sourceLedger": "/absolute/source-ledger.json",
  "books": [],
  "blockingTickets": [],
  "resolvedTickets": []
}
```

Runtime latest index:

```json
{
  "version": "v1-college-chinese-ch001",
  "createdAt": "YYYY-MM-DD",
  "manifest": "/absolute/runtime/manifest.json",
  "books": [
    {
      "id": "book-college-chinese",
      "name": "大学语文",
      "chapters": [
        {
          "id": "ch-001",
          "name": "1-序二篇",
          "dataFile": "/absolute/runtime/college-chinese-ch001.json",
          "dataModule": "/absolute/runtime/college-chinese-ch001.js",
          "questionCount": 29,
          "groups": []
        }
      ]
    }
  ],
  "blockingTickets": []
}
```

Rules:

- `dataFile` points to canonical runtime JSON.
- `dataModule` points to the Mini Program-compatible JS module wrapper.
- Runtime pages should require `dataModule` or its relative `.js` path, not raw `.json`.

## Mini Program Runtime Module

Mini Program `require()` loads JavaScript modules. Do not rely on direct `.json` imports.

For every runtime bank JSON file, generate a same-name `.js` wrapper:

```js
module.exports = {
  "status": "released"
}
```

Rules:

- The `.js` wrapper must export exactly the same data as the JSON file.
- Keep JSON for inspection, validation, and traceability.
- Use `.js` for Mini Program runtime `require()`.
- If the JSON changes, regenerate the wrapper in the same operation.

## Source Ledger

Location:

```text
/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/source-ledger.json
```

Top-level shape:

```json
{
  "version": 1,
  "generatedAt": "YYYY-MM-DD",
  "sourceDir": "/Users/leftzhou/WorkSpace.localized/题小鹰/source-files",
  "summary": {},
  "statuses": ["unprocessed", "staged", "blocked", "released", "superseded", "excluded"],
  "entries": []
}
```

Entry shape:

```json
{
  "sourceFile": "/absolute/source/path.json",
  "sourceName": "大学语文-1-序二篇.json",
  "sourceType": "question-source",
  "status": "released",
  "sourceHash": "sha256:<hash>",
  "bookId": "book-college-chinese",
  "bookName": "大学语文",
  "chapterId": "ch-001",
  "chapterName": "1-序二篇",
  "groupId": "group-homework",
  "groupType": "homework",
  "groupName": "课后作业",
  "questionCount": 20,
  "releaseVersion": "v1-college-chinese-ch001",
  "stagingVersion": null,
  "releaseManifest": "/absolute/release/manifest.json",
  "stagingManifest": null,
  "ticket": null,
  "processedAt": "YYYY-MM-DD",
  "observedAt": "YYYY-MM-DD",
  "notes": []
}
```

Status rules:

- `unprocessed`: direct question source exists but has not been imported.
- `staged`: generated into staging with no unresolved ticket.
- `blocked`: staging output has open or waiting ticket.
- `released`: included in latest publishable release.
- `superseded`: included in an older release replaced by a newer release.
- `excluded`: support, aggregate, catalog, or explicitly ignored file.

## Ticket Markdown

Ticket front matter:

```yaml
---
batchId: <importBatchId>
status: waiting_user_choice
blocking: true
pendingDir: /absolute/staging/dir
releaseVersion:
---
```

Ticket states:

```text
open -> waiting_user_choice -> resolved -> released
```

Rules:

- Tickets are audit records, not the user's editing surface.
- Present unresolved items as multiple-choice prompts in conversation.
- Write user choices back into the ticket, `manualChanges`, and manifest.
- Any `open` or `waiting_user_choice` ticket blocks release.

## Validation Checklist

Before publishing or declaring a runtime snapshot usable, verify:

- JSON files parse with `jq empty`.
- Runtime `.js` module wrappers parse with `node --check`.
- Every `answerKeys[]` value exists in `options[].key`.
- Every released question has a non-empty `explanation`.
- Every released question has `explanationStatus === "verified"`.
- `blockingTickets` is empty in release bank, release manifest, and latest index.
- `counts.questions` matches the number of released questions.
- Release JSON and runtime JSON are equivalent where they should be identical.
- Runtime `latest.json` includes both `dataFile` and `dataModule`.
- `source-ledger.json` is updated for processed, blocked, excluded, and released files.
