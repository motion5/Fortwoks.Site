# Task Completion Checklist

When finishing a coding task, complete these steps:

## 1. Code Quality Gates

```bash
npm run check      # TypeScript type checking
npm run lint       # ESLint and Prettier checks
npm run format     # Auto-format code
```

## 2. Testing

```bash
npm test           # Run all tests
# OR run specific test suites:
npm run test:unit -- --run
npm run test:e2e
```

## 3. Issue Tracking

```bash
bd close <issue-id>           # Mark issue complete
bd update <issue-id> --status in_progress  # Update status if partial
```

## 4. Git Workflow (MANDATORY)

```bash
git add .
git commit -m "descriptive message"
git pull --rebase              # Sync with remote
bd sync                        # Beads sync
git push                       # MUST push to remote
git status                     # Verify "up to date with origin"
```

**CRITICAL**: Work is NOT complete until `git push` succeeds.

## 5. Documentation

- Update relevant docs if adding new features
- File new bd issues for remaining work

## 6. Verification

- All changes committed AND pushed
- Tests passing
- No lint errors
- Issue status updated
