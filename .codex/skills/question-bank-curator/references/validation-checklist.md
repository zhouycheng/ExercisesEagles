# Validation Checklist

Run the relevant checklist before declaring a workspace, release, or runtime snapshot usable.

## Workspace Checks

- `workspace.json` exists and has `workspaceId`, `status`, `baseReleaseVersion`, `books`, `blockingTickets`, and `validation`.
- `manifest.json`, `import-plan.md`, and `checks.json` exist.
- Imported source files are represented in `source-ledger.json` with status `workspace` or `blocked`.
- Excluded/support files are represented in `source-ledger.json` with status `excluded`.
- No source file in the import scope is silently ignored.
- `blockingTickets` is empty before status becomes `ready`.
- Every bank JSON parses.
- Counts in workspace manifest match actual groups and questions.
- Chapter names are pure titles, with no `1-`, `第1课`, or `第 X 章：` prefix.
- Question stems, option text, answer keys, and answer text match source except user-confirmed ticket changes.
- Every answer key exists in `options[].key`.
- No question object contains app-facing `score`.
- Normal questions have `weight: 1`.
- `sourceMeta.rawScore` follows default-5 normalization.
- Every explanation is non-empty and has `explanationStatus: "verified"`.
- Duplicate content is either absent or represented once with multiple `placements`.

## Release Checks

- Release was copied from a validated `ready` workspace.
- Release manifest has `status: "released"` and `publishable: true`.
- `sourceWorkspaceId` and `previousReleaseVersion` are recorded when available.
- `blockingTickets` is empty in release bank files, release manifest, and canonical latest index.
- `counts.questions`, `counts.groups`, `counts.chapters`, and `counts.uniqueQuestions` match actual data.
- No duplicate `questionId` exists.
- No duplicate normalized content exists unless intentionally represented by `placements`.
- Every `answerKeys[]` value exists in `options[].key`.
- Every released question has a verified explanation.
- `source-ledger.json` entries for committed files are `released`.
- `source-ledger.json` has no `blocked` entries for the committed release scope.

## Runtime Checks

- Runtime JSON files parse with `jq empty`.
- Runtime `.js` module wrappers parse with `node --check`.
- Each runtime `.js` wrapper exports exactly the same data as the paired JSON file.
- Runtime `latest.json` points to runtime `manifest.json`.
- Runtime `latest.js` exports exactly the same data as `latest.json`.
- Runtime `manifest.js` exports exactly the same data as `manifest.json`.
- Runtime `latest.json` chapter entries include both `dataFile` and `dataModule`.
- Runtime `manifest.json`, `manifest.js`, `latest.json`, `latest.js`, and any new app-facing runtime index/catalog file include the released books/chapters expected by the release manifest.
- Runtime manifest version matches canonical latest version.
- Runtime bank JSON content matches the committed release bank JSON where it should be identical.

## Suggested Commands

Use paths appropriate to the current workspace/release:

```bash
jq empty <json-files>
find /Users/leftzhou/WorkSpace.localized/题小鹰/project/miniprogram/data/question-banks -maxdepth 1 -name '*.js' -exec node --check {} \;
git diff --check
```
