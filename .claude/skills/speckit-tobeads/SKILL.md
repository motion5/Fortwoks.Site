---
name: speckit-tobeads
user-invocable: true
description: Convert a Spec Kit specification directly to Beads issues (epic → features → tasks). Skips intermediate tasks.md file.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

This command bridges Spec Kit (specification management) to Beads (execution management). It:

1. Reads spec.md and optionally plan.md from the current feature
2. Generates a work breakdown in memory (no tasks.md file created)
3. Creates Beads issues directly with proper hierarchy and dependencies

**Boundary**: After this command runs, Beads owns execution. Spec.md becomes historical reference only.

## Execution Steps

### 1. Setup - Find Feature Directory

Run the prerequisite check to locate feature files:

```bash
.specify/scripts/powershell/check-prerequisites.ps1 -Json -PathsOnly
```

Parse the JSON output to get:
- `FEATURE_DIR`: Path to the feature directory
- `FEATURE_SPEC`: Path to spec.md
- `IMPL_PLAN`: Path to plan.md (may not exist)

If spec.md doesn't exist, ERROR: "No spec.md found. Run /speckit-specify first."

### 2. Load Feature Context

Read from FEATURE_DIR:
- **Required**: spec.md (user stories, requirements, acceptance criteria)
- **Optional**: plan.md (technical decisions to inform task descriptions)

Extract from spec.md:
- Feature name from title
- User stories with priorities (P1, P2, P3...)
- Functional requirements (FR-001, FR-002...)
- Acceptance criteria for each story
- Key entities if present

Extract from plan.md (if exists):
- Tech stack decisions
- Architecture patterns
- Key libraries/dependencies

### 3. Generate Work Breakdown (In Memory)

Create a mental model of tasks WITHOUT writing to a file. Structure:

**Phase 1: Setup**
- Project initialization tasks
- Configuration tasks
- Base infrastructure

**Phase 2: Foundational**
- Shared models/entities needed by multiple stories
- Common services/utilities
- Database setup if applicable

**Phase 3+: User Stories** (one phase per story, in priority order)
- For each user story:
  - Models specific to this story
  - Services specific to this story
  - Endpoints/UI specific to this story
  - Each task should be independently implementable

**Final Phase: Polish**
- Integration tasks
- Cross-cutting concerns
- Documentation if explicitly requested

### 4. Create Beads Hierarchy

#### 4.1 Create Epic (Feature Level)

```bash
bd create "[Feature Name]" \
  --type=epic \
  --priority=1 \
  --description="[Feature description from spec.md. Include key success criteria.]" \
  --labels="speckit" \
  --silent
```

Capture the epic ID from output.

#### 4.2 Create Features (User Story Level)

For each user story (P1, P2, P3...):

```bash
bd create "US[N]: [Story Title]" \
  --type=feature \
  --parent=[epic-id] \
  --priority=[map P1→1, P2→2, P3→3] \
  --description="[Story description + acceptance criteria from spec.md]" \
  --labels="speckit,story" \
  --silent
```

Capture each feature ID.

#### 4.3 Create Tasks (Work Item Level)

For each work item in the breakdown:

```bash
bd create "T[NNN]: [Task description with file path]" \
  --type=task \
  --parent=[feature-id-for-this-story] \
  --priority=2 \
  --description="[Detailed task description. Include:
    - What to create/modify
    - File path(s)
    - Key acceptance criteria
    - Reference: spec.md §[section] if applicable]" \
  --labels="speckit" \
  --silent
```

Capture each task ID.

#### 4.4 Set Up Dependencies

Phase dependencies (sequential):
- All Phase 2 tasks → blocked by all Phase 1 tasks
- Each story's tasks → blocked by Phase 2 completion

Within-phase parallelism:
- Tasks within the same phase with no data dependencies can run in parallel (no blockedBy)
- Tasks with explicit dependencies (e.g., service depends on model) → set blockedBy

Use:
```bash
bd dep add [blocked-task-id] [blocker-task-id]
```

### 5. Optional Cleanup

If user specified `--cleanup` in $ARGUMENTS:

```bash
rm -f [FEATURE_DIR]/plan.md
rm -rf [FEATURE_DIR]/checklists/
rm -f [FEATURE_DIR]/research.md
rm -f [FEATURE_DIR]/data-model.md
```

Keep spec.md as historical record unless `--cleanup-all` specified.

### 6. Report Summary

Output:
- Epic ID and title
- Number of features (user stories) created
- Number of tasks created
- Total beads created
- Dependency summary (how many blockedBy relationships)
- Next steps: "Run `bd ready` to see available work"

Example output:
```
✓ Created beads from spec.md

Epic: VoxRouter-abc "OpenRouter Provider Integration"
├── Feature: VoxRouter-def "US1: Basic API Routing" (3 tasks)
├── Feature: VoxRouter-ghi "US2: Provider Fallback" (4 tasks)
└── Feature: VoxRouter-jkl "US3: Cost Tracking" (2 tasks)

Summary:
  - 1 epic
  - 3 features (user stories)
  - 9 tasks
  - 12 dependency relationships

Next: Run `bd ready` to see unblocked work.
```

## Task Generation Guidelines

### Self-Contained Task Descriptions

Each task description MUST be implementable without reading the full spec:

**Good**:
```
Create User entity in src/models/User.cs

Fields:
- Id: Guid (primary key)
- Email: string (unique, required)
- PasswordHash: string (required)
- CreatedAt: DateTime

Constraints: Email must be valid format, unique.

[From: spec.md §FR-001, §FR-002]
```

**Bad**:
```
Create User model as described in spec.
```

### Task Granularity

- Each task = 1-2 hours of work maximum
- Single responsibility: one file or tightly coupled set of files
- Clear completion criteria

### Priority Mapping

| Spec Kit | Beads | Meaning |
|----------|-------|---------|
| Story P1 | Feature P1 | Highest priority story |
| Story P2 | Feature P2 | Second priority story |
| Story P3 | Feature P3+ | Lower priority stories |
| Individual task | Task P2 | Default task priority (adjustable in beads) |

## Error Handling

- If spec.md missing: ERROR with guidance to run /speckit-specify
- If beads not initialized: ERROR with guidance to run `bd init`
- If bd commands fail: Report error, rollback any partially created beads
- If on non-feature branch: WARN but continue (user may be testing)

## Notes

- This command creates beads but does NOT mark spec as "handed off"
- User can re-run this command; it will create duplicates (by design - user manages cleanup)
- Consider adding `--dry-run` flag to preview what would be created without creating
