# Suggested Commands

## Development

```bash
npm run dev              # Start dev server
npm run dev -- --open    # Start dev server and open browser
npm run build            # Production build
npm run preview          # Preview production build
```

## Code Quality

```bash
npm run check            # Type check with svelte-check
npm run check:watch      # Type check in watch mode
npm run lint             # Run prettier check and eslint
npm run format           # Format code with prettier
```

## Testing

```bash
npm test                 # Run all tests (unit + e2e)
npm run test:unit        # Run vitest unit tests
npm run test:unit -- --run  # Run vitest once (no watch)
npm run test:e2e         # Run playwright e2e tests
```

## Issue Tracking (bd/beads)

```bash
bd ready                 # Show available work
bd show <id>             # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>            # Complete work
bd sync                  # Sync with git
```

## macOS/Darwin System Commands

Standard unix commands work on Darwin:

- `ls`, `cd`, `pwd`, `mkdir`, `rm`, `mv`, `cp`
- `grep`, `find`, `cat`, `less`
- `git` for version control
