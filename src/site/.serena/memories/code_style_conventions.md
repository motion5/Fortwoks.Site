# Code Style & Conventions

## TypeScript

- **Strict mode enabled** in tsconfig.json
- Use explicit types where helpful, rely on inference otherwise
- Prefer `interface` over `type` for object shapes

## Svelte 5 Patterns

- Use **runes** for reactivity: `$state`, `$derived`, `$effect`
- Use **snippets** for reusable template fragments
- Event handlers: use `on*` props (e.g., `onclick`) not directives
- Props: use `$props()` rune

## File Organization

- Routes in `src/routes/` (SvelteKit file-based routing)
- Shared code in `src/lib/`
- Tests co-located with code: `*.spec.ts` or `*.test.ts`
- Component tests: `*.svelte.spec.ts`

## Testing Conventions

- **Unit tests**: `src/**/*.{test,spec}.{js,ts}` (node environment)
- **Component tests**: `src/**/*.svelte.{test,spec}.{js,ts}` (browser via Playwright)
- **E2E tests**: `e2e/**/*.spec.ts`

## Formatting

- **4 spaces for indentation** - NOT tabs (user preference)
- Configured via `.editorconfig` and `.prettierrc`
- Prettier with svelte plugin
- Run `npm run format` before commits
