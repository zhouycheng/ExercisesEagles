# Review And Validation Policy

Use this policy after implementation and after syncing latest code.

## Review Focus

Review for:

- Product boundary creep.
- Architecture boundary violations between pages, ViewModels, models, repositories, and data utilities.
- Missing validation for changed behavior.
- Broken question-bank runtime assumptions.
- Broken packaging or upload assumptions in `project.config.json`.
- Stale docs caused by the change.
- Unrelated user changes accidentally included.

## Required Checks

Default checks:

```bash
git diff --check
npm run lint
```

For question-bank runtime changes:

```bash
find miniprogram/data/question-banks -maxdepth 1 -name '*.js' -exec node --check {} \;
```

Also verify manifest/runtime counts when manifest, latest, bank files, wrappers, or catalog logic change.

## Additional Checks

Add checks when relevant:

- `node --check` for changed JavaScript entrypoints when lint is too broad or unavailable.
- Manual WeChat Developer Tools compile/preview for page, component, app config, project config, tabBar, or interaction changes.
- Runtime data consistency checks for manifest, latest, wrapper parity, answer keys, and explanations.
- Packaging/upload checks when `project.config.json` or `packOptions` changes.

## Reporting

If checks pass, report what was run and the result.

If checks fail, report:

- The failing command.
- The concrete failure.
- The root cause when known.
- The fix made.
- The re-run result.
