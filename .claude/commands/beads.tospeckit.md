---
description: Pick a Beads epic and run Spec Kit's specification process on it — clarifying product requirements, user stories, and acceptance criteria from an existing issue.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

This command bridges Beads (execution management) to Spec Kit (specification management). It:

1. Lists available Beads epics for the user to select from
2. Fetches the selected epic's details as seed context
3. Runs an interactive product clarification interview
4. Produces a `spec.md` in the current feature directory

**Boundary**: This command is for product *clarification*, not implementation planning. The output is a spec, not a plan. Use `/speckit.specify` patterns; use `/speckit.tobeads` to push tasks back into Beads after speccing.

## Execution Steps

### 1. List Beads Epics

Fetch open epics so the user can choose one:

```bash
bd list --type=epic --status=open
```

If no epics exist, ERROR: "No open epics found. Create one with `bd create --type=epic` first."

Present the list to the user and ask which epic to spec out. If `$ARGUMENTS` contains an issue ID (e.g. `VoxRouter-abc`), skip the selection prompt and use that ID directly.

> Example prompt: "Which epic would you like to clarify? (Enter the ID, e.g. `PROJ-001`)"

### 2. Fetch Epic Details

```bash
bd show <selected-epic-id>
```

Extract from the output:
- **Title**: The epic name
- **Description**: Existing context (may be brief or empty)
- **Labels**: Any domain hints
- **Priority**: Inform story prioritization
- **Child issues** (features/tasks if any already exist): Note as existing work

### 3. Determine Feature Directory

Run the Spec Kit prerequisite check to find (or create) the feature directory:

```bash
.specify/scripts/powershell/check-prerequisites.ps1 -Json -PathsOnly
```

If no feature directory exists or the check fails, ask the user for the feature name to create one:

> "What should the feature directory be named? (e.g. `open-router-integration`)"

Then initialize via Spec Kit's standard flow (create `.specify/features/<name>/` if needed).

### 4. Interactive Product Clarification Interview

Using the epic title and description as seed context, conduct a focused interview. Ask questions in small batches (2–3 at a time), not all at once.

**Opening framing** (display to user):
> "I'll help clarify the requirements for **[Epic Title]**. I'll ask a few questions to build a solid spec. Feel free to answer briefly — I'll synthesize the details."

**Core questions to cover** (adapt based on what the epic description already answers):

**Problem & Goal**
- What problem does this solve, and for whom?
- What does success look like in one sentence?

**User Stories** (elicit 1–4 stories)
- Who are the primary users/actors?
- What are the key actions they need to perform?
- What is the most critical story (P1)?

**Acceptance Criteria** (per story)
- What must be true for each story to be "done"?
- Are there explicit edge cases or failure modes to handle?

**Constraints & Non-Goals**
- What is explicitly out of scope?
- Are there technical constraints (auth, integrations, performance)?

**Priority & Phasing**
- If this were shipped in phases, what's phase 1?
- Are any stories dependent on others?

Adjust depth based on how detailed the Beads epic already is. Skip questions the description already answers clearly.

### 5. Generate spec.md

After the interview, synthesize responses into a `spec.md` following Spec Kit format:

```markdown
# [Epic Title]

## Overview

[2–3 sentence summary of the feature and its goal.]

## User Stories

### US1: [Story Title] (P1)

**As a** [actor], **I want to** [action], **so that** [benefit].

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]

### US2: [Story Title] (P2)
...

## Functional Requirements

- **FR-001**: [Requirement derived from stories]
- **FR-002**: ...

## Non-Goals

- [Explicit out-of-scope item]

## Key Entities (if applicable)

- **[Entity]**: [Brief description]

## Source

Seeded from Beads epic: `[epic-id]` — [Epic Title]
```

Write to: `[FEATURE_DIR]/spec.md`

### 6. Update Beads Epic (Optional)

If the user approves, add a label to the epic marking it as specced:

```bash
bd update <epic-id> --labels="speckit,specced"
```

Ask: "Would you like to tag the epic in Beads as specced? (y/n)"

### 7. Report Summary

Output:
- Path to generated spec.md
- Number of user stories captured
- Number of functional requirements
- Next steps

Example output:
```
✓ spec.md created from Beads epic PROJ-001

Feature: open-router-integration
Spec: .specify/features/open-router-integration/spec.md

  - 3 user stories (P1–P3)
  - 6 functional requirements
  - 2 non-goals documented

Next: Review spec.md, then run `/speckit.plan` or `/speckit.tobeads` to break it into tasks.
```

## Interview Guidelines

### Tone

- Conversational, not bureaucratic
- Assume the user knows what they want — help them articulate it
- Offer to infer from context when answers are vague: "Based on what you said, I'll assume X — correct?"

### Brevity

- Don't ask questions the epic description already answers
- If priority or scope is obvious, skip those questions
- Aim for 5–10 minutes of interview total, not an exhaustive requirements session

### Synthesis

When writing spec.md, synthesize — don't just transcribe. Turn casual answers into clean acceptance criteria. Infer implicit requirements where safe.

## Error Handling

- If `bd list` fails: ERROR with guidance to check beads is initialized (`bd init`)
- If selected ID doesn't exist: ERROR "Epic [ID] not found. Run `bd list --type=epic` to see available epics."
- If spec.md already exists: WARN "spec.md already exists at [path]. Overwrite? (y/n)"
- If interview produces no stories: WARN and ask user if they want to continue with a minimal spec

## Notes

- This command is intentionally lightweight on the Beads side — it reads but rarely writes back
- The generated spec.md is a starting point; users should review and refine before running `/speckit.tobeads`
- Supports `--epic=<id>` shorthand in `$ARGUMENTS` to skip the selection prompt
