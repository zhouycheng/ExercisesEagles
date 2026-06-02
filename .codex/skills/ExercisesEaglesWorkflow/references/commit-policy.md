# Commit Policy

Use Conventional Commits style that matches `docs/workflow/git.md`.

## Format

```text
<type>(optional-scope): <中文摘要>
```

Use English type and optional English scope. Use Chinese after the colon.

## Types

- `feat`: user-visible feature.
- `fix`: bug fix.
- `docs`: documentation.
- `refactor`: internal code restructuring without intended behavior change.
- `test`: tests only.
- `chore`: tooling, repo maintenance, generated metadata, or housekeeping.
- `build`: build system or dependency changes.
- `ci`: CI configuration.

## Examples

```text
feat(quiz): 支持整本抽题和模拟测试
feat(question-bank): 接入多课本运行态题库
docs(workflow): 更新题库运行态工作流
chore(workflow): 补充项目级工作流技能
```

## Splitting Rules

- Split commits by logical behavior or project boundary.
- Keep broad formatting separate.
- Do not mix generated files with manual source edits unless generation is the point of the commit.
- Do not include unrelated user edits.
- Include the matching changelog entry in the same commit as the change.
- For bug fixes, include the matching archive log in the same commit as the fix.

## Commit Body

Add a body when the change has non-obvious motivation, migration risk, compatibility impact, data-release impact, or validation notes.
