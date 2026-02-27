# Agent Behaviour

This file defines core agent behaviour. Project-specific build/test commands belong in project-level AGENTS.md files.

# General Rules
- When reporting information to me, be extremely concise and sacrifice grammar for the sake of concision.

## Package Managers
- **JavaScript/TypeScript**: Use `bun` instead of `npm`/`yarn`/`pnpm` for install, run, add, remove
- **Python**: Use `uv` instead of `pip`/`pip3` for install, run, sync

## Context7 - API / Library Documenation
Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

## Serena - Code Navigation and codebase understanding
- Use Serena's semantic search tools instead of grep for finding code
- Use Serena's symbol tools for renaming and refactoring
- Query Serena for understanding code structure before making changes


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

## Convention Detection

Before writing any code:

1. **Check explicit style guides first** — `.editorconfig`, linter configs, style docs, `Directory.Build.props`
2. **If no explicit guide** — examine 3-5 files in the same directory or module as the target
3. **Note specifically:**
    - Naming (PascalCase methods? _camelCase fields? I-prefix interfaces?)
    - Async patterns (suffix convention, ConfigureAwait usage)
    - Error handling (exceptions, Result<T>, nullable returns)
    - DI approach (constructor injection, method injection, static)
    - Collection types (List vs IReadOnlyList vs arrays)
    - Null handling (nullable reference types, guard clauses style)

4. **If conventions conflict within the codebase**, ask: "I see both [X pattern] and [Y pattern] in this codebase. Which should I follow for this task?"

5. **Never assume newest code is "correct"** — it might be the anomaly

6. Follow 'Code Navigation' section for finding and updating code 

## Code Navigation
- Use Serena's semantic search tools instead of grep for finding code
- Use Serena's symbol tools for renaming and refactoring
- Query Serena for understanding code structure before making changes

## Documentation Rules

**Never create documentation files unless explicitly requested.**

Forbidden without explicit request:
- Implementation plans (`*-plan.md`, `*-spec.md`)
- Phase documents (`phase-*.md`, `step-*.md`)
- Architecture decision records
- README additions
- Any markdown file

Planning happens in beads and conversation context only. Plans are working memory, not artifacts.

If ambiguous: "Do you want this as a file, or just in chat?"


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
