#Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## MCP Tool Usage

### Context7 - API / Library Documentation

Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

### Serena - Code Navigation and Codebase Understanding

- Use Serena's semantic search tools instead of grep for finding code
- Use Serena's symbol tools for renaming and refactoring
- Query Serena for understanding code structure before making changes

## Code Quality Automation

**IMPORTANT: Do NOT manually run linting or formatting commands.**

This project has hooks configured that automatically run after file edits:
- Prettier formatting runs automatically after Edit/Write operations
- ESLint runs automatically with auto-fix enabled

The hooks are configured in `.claude/settings.local.json` and run asynchronously to avoid blocking your workflow.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests and builds (linting is automatic via hooks)
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
    ```bash
    git pull --rebase
    bd sync
    git push
    git status  # MUST show "up to date with origin"
    ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**

- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

## Commit Messages

Use **conventional commit format**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style/formatting (no logic changes)
- `refactor:` Code restructuring (no behavior change)
- `test:` Adding or updating tests
- `chore:` Maintenance tasks, dependencies, tooling

**Rules:**

- Do NOT add "Co-Authored-By: Claude" or any AI attribution footer
- Subject line: imperative mood, no period, max 72 chars
- Body: explain what and why (not how), wrap at 72 chars
- Scope is optional but encouraged (e.g., `feat(stripe): add payment processing`)
- **Keep commits concise yet descriptive** - 1-3 sentences in body is ideal
- Longer bodies acceptable for critical changes, but if exhaustive consider splitting the commit
- Focus on impact and intent, not implementation details

**Examples:**

```
feat(auth): add OAuth2 login flow

Implement Google and GitHub OAuth providers with secure
token handling and automatic user creation.

fix(stripe): handle webhook signature verification failures

Add proper error handling for invalid webhook signatures
to prevent silent failures in production.

style: apply 4-space indentation standard

Switch from tabs to 4 spaces, add .editorconfig
```
