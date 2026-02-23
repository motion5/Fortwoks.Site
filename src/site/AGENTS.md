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

<!-- bv-agent-instructions-v1 -->

---

## Beads Workflow Integration

This project uses [beads_viewer](https://github.com/Dicklesworthstone/beads_viewer) for issue tracking. Issues are stored in `.beads/` and tracked in git.

### Essential Commands

```bash
#View issues(launches TUI - avoid in automated sessions)
bv

#CLI commands for agents(use these instead)
bd ready              # Show issues ready to work (no blockers)
bd list --status=open # All open issues
bd show <id>          # Full issue details with dependencies
bd create --title="..." --type=task --priority=2
bd update <id> --status=in_progress
bd close <id> --reason="Completed"
bd close <id1> <id2>  # Close multiple issues at once
bd sync               # Commit and push changes
```

### Workflow Pattern

1. **Start**: Run `bd ready` to find actionable work
2. **Claim**: Use `bd update <id> --status=in_progress`
3. **Work**: Implement the task
4. **Complete**: Use `bd close <id>`
5. **Sync**: Always run `bd sync` at session end

### Key Concepts

- **Dependencies**: Issues can block other issues. `bd ready` shows only unblocked work.
- **Priority**: P0=critical, P1=high, P2=medium, P3=low, P4=backlog (use numbers, not words)
- **Types**: task, bug, feature, epic, question, docs
- **Blocking**: `bd dep add <issue> <depends-on>` to add dependencies

### Session Protocol

**Before ending any session, run this checklist:**

```bash
git status              # Check what changed
git add <files>         # Stage code changes
bd sync                 # Commit beads changes
git commit -m "..."     # Commit code
bd sync                 # Commit any new beads changes
git push                # Push to remote
```

### Best Practices

- Check `bd ready` at session start to find available work
- Update status as you work (in_progress → closed)
- Create new issues with `bd create` when you discover tasks
- Use descriptive titles and set appropriate priority/type
- Always `bd sync` before ending session

<!-- end-bv-agent-instructions -->
