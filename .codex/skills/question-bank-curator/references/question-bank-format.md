# Question Bank Format Contract

This document defines the question-bank directory layout and JSON contracts for the Tixiaoying project.

Read this reference before creating, validating, publishing, syncing, or consuming question-bank data.

## Contents

- Directory Layout
- File Naming
- Bank JSON
- Workspace
- Group Object
- Question Object
- Release Manifest
- Latest Index
- Mini Program Runtime Module
- Source Ledger
- Ticket Markdown
- Validation

## Directory Layout

```text
/Users/leftzhou/WorkSpace.localized/题小鹰/source-files/
  Raw source files. Read-only evidence. Never edit.

/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/
  Canonical generated question-bank root.

/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/workspaces/<workspaceId>/
  Editable Git-like working tree for ongoing imports. Not publishable.

/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/releases/<releaseVersion>/
  Publishable immutable release commit. Contains one `manifest.json` and one or more bank JSON files.

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
workspace.json             editable workspace state
import-plan.md             workspace import plan and source mapping notes
checks.json                machine-readable validation results
manifest.json              workspace or release manifest
manifest.js                Mini Program runtime manifest module wrapper
latest.json                latest release/runtime index
latest.js                  Mini Program runtime latest-index module wrapper
source-ledger.json         source processing ledger
<importBatchId>.md         import ticket
```

Examples:

```text
college-chinese-ch001.json
college-chinese-ch001.js
v1-college-chinese-ch001
wb-20260602-college-english
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
    "name": "序二篇"
  },
  "groups": [],
  "resolvedTickets": [],
  "resolution": {},
  "release": {}
}
```

Rules:

- `status`: `draft`, `blocked`, `ready`, or `released`.
- `publishable`: `true` only for release output with no blocking tickets.
- `blockingTickets`: absolute ticket paths. Must be empty for publishable releases.
- `book.id`: stable ID, not display text.
- `book.name`: display name.
- `chapter.id`: stable chapter ID, usually `ch-###`.
- `chapter.name`: pure display title only. Do not include order prefixes such as `1-`, source labels such as `第1课`, or composed UI labels such as `第 1 章： 序二篇`.
- `groups`: all chapter groups in display/sampling scope.

## Workspace

Workspaces are editable working trees. Importing a chapter or unit updates a workspace by default; it must not create a release, update `latest.json`, or sync the runtime snapshot.

Location:

```text
/Users/leftzhou/WorkSpace.localized/题小鹰/question-banks/workspaces/<workspaceId>/
```

Required files:

```text
workspace.json
manifest.json
import-plan.md
checks.json
<bookSlug>-ch###.json
```

`workspace.json` shape:

```json
{
  "workspaceId": "wb-20260602-college-english",
  "status": "draft",
  "publishable": false,
  "baseReleaseVersion": "v2-college-chinese-complete-chapter-title-normalized",
  "targetReleaseVersion": null,
  "createdAt": "YYYY-MM-DD",
  "updatedAt": "YYYY-MM-DD",
  "books": [],
  "processedSources": [],
  "pendingSources": [],
  "blockingTickets": [],
  "importDecisions": [],
  "manualChanges": [],
  "metadataChanges": [],
  "schemaChanges": [],
  "validation": {
    "lastRunAt": null,
    "passed": false
  }
}
```

Workspace status rules:

- `draft`: import is in progress and may be edited.
- `blocked`: one or more tickets are open or waiting for user choice.
- `ready`: no blocking tickets remain and workspace validation passed.
- `released`: committed into an immutable release.

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
  "weight": 1,
  "difficulty": "easy",
  "tags": [],
  "sourceMeta": {
    "rawScore": 5
  },
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
- `weight`: app-facing question weight. Default is `1`; only change it when the user/import manifest explicitly defines a different weight.
- `sourceMeta.rawScore`: optional normalized source score. Use `5` by default, convert source `0` or any value `<= 5` to `5`, and preserve source values only when they are greater than `5`. It is traceability metadata only and must not be used as app-facing score.
- `explanation`: verified, accurate, plain Chinese, at most 2 display lines.
- `explanationStatus`: must be `verified` before release.

Scoring rules:

- Question-bank data does not store fixed per-question score.
- Review modes ignore `sourceMeta.rawScore`.
- Simulated tests calculate actual points at runtime from the test total and selected questions' `weight` values.
- Source `score` values that are `0`, decimal, missing, or inconsistent do not create blocking tickets by themselves; normalize them into `sourceMeta.rawScore` using the default-5 rule.

## Release Manifest

Top-level shape:

```json
{
  "version": "v1-college-chinese-ch001",
  "status": "released",
  "publishable": true,
  "createdAt": "YYYY-MM-DD",
  "importBatchId": "college-chinese-ch001",
  "sourceWorkspaceId": "wb-20260602-college-chinese",
  "previousReleaseVersion": "v2-college-chinese-complete-chapter-title-normalized",
  "book": {},
  "chapters": [],
  "outputs": [],
  "runtimeSnapshot": "/Users/leftzhou/WorkSpace.localized/题小鹰/project/miniprogram/data/question-banks",
  "blockingTickets": [],
  "resolvedTickets": [],
  "counts": {},
  "rules": {},
  "manualChanges": [],
  "metadataChanges": [],
  "schemaChanges": [],
  "verificationSources": []
}
```

Chapter/group shape:

```json
{
  "id": "ch-001",
  "name": "序二篇",
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
- `sourceWorkspaceId`: workspace committed into this release.
- `previousReleaseVersion`: previous latest release, when available.
- `outputs`: absolute paths to canonical release bank JSON files.
- `runtimeSnapshot`: absolute runtime snapshot directory.
- `manualChanges`: every user-confirmed correction to stems/options/answers.
- `metadataChanges`: mechanical display/placement changes that do not alter stems/options/answers.
- `schemaChanges`: mechanical schema migrations such as `score` to `weight/sourceMeta.rawScore`. These are not source-content edits.
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
          "name": "序二篇",
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

- Canonical latest points only to a published release.
- `dataFile` points to canonical runtime JSON.
- `dataModule` points to the Mini Program-compatible JS module wrapper.
- Runtime pages should require `dataModule` or its relative `.js` path, not raw `.json`.
- Runtime index JSON files used by the app must have same-name `.js` wrappers. At minimum, keep `manifest.json`/`manifest.js` and `latest.json`/`latest.js` synchronized.
- If the Mini Program introduces a new app-facing runtime index/catalog file, release sync must regenerate or update it together with `manifest` and `latest`.

## Mini Program Runtime Module

Mini Program `require()` loads JavaScript modules. Do not rely on direct `.json` imports.

After a release commit syncs runtime data, generate a same-name `.js` wrapper for every runtime bank JSON and runtime index JSON file:

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
- Index wrappers such as `manifest.js` and `latest.js` are release artifacts, not optional convenience files.

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
  "statuses": ["unprocessed", "workspace", "blocked", "released", "superseded", "excluded"],
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
  "chapterName": "序二篇",
  "groupId": "group-homework",
  "groupType": "homework",
  "groupName": "课后作业",
  "questionCount": 20,
  "workspaceId": "wb-20260602-college-chinese",
  "releaseVersion": "v1-college-chinese-ch001",
  "workspaceManifest": "/absolute/workspace/manifest.json",
  "releaseManifest": "/absolute/release/manifest.json",
  "ticket": null,
  "processedAt": "YYYY-MM-DD",
  "observedAt": "YYYY-MM-DD",
  "notes": []
}
```

Status rules:

- `unprocessed`: direct question source exists but has not been imported.
- `workspace`: imported into an editable workspace but not released.
- `blocked`: workspace output has open or waiting ticket.
- `released`: included in latest publishable release.
- `superseded`: included in an older release replaced by a newer release.
- `excluded`: support, aggregate, catalog, or explicitly ignored file.

## Ticket Markdown

Ticket front matter:

```yaml
---
workspaceId: <workspaceId>
status: waiting_user_choice
blocking: true
workspaceDir: /absolute/workspace/dir
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

## Validation

Use `validation-checklist.md` for workspace, release, and runtime checks.
