# SvelteKit Starter Template

A modern, production-ready SvelteKit starter template featuring Svelte 5 with runes, modular architecture, comprehensive testing, and best practices.

## Features

- **Svelte 5 with Runes**: Leverages the latest Svelte 5 features including `$state`, `$derived`, and `$effect`
- **Modular Architecture**: Feature-based module system for scalable codebases
- **Route Groups**: Organized routes for different layouts (app vs. marketing)
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Code Quality**: ESLint, Prettier, TypeScript
- **Type Safety**: Full TypeScript support throughout

## Quick Start

Get your app running in 3 steps:

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers (first time only)
npx playwright install

# 3. Start development server
npm run dev
```

Visit http://localhost:5173 to see your app.

### Run Tests

```bash
# Run all tests (unit + e2e)
npm test

# Or run separately:
npm run test:unit   # Vitest unit tests
npm run test:e2e    # Playwright e2e tests
```

### Verify Setup

```bash
# Type checking
npm run check

# Linting
npm run lint

# Format code
npm run format
```

## Project Structure

```
svelte-starter/
├── src/
│   ├── lib/
│   │   ├── components/      # Shared UI components
│   │   │   ├── ui/          # Generic UI (buttons, inputs)
│   │   │   └── layout/      # Layout components
│   │   └── modules/         # Feature modules
│   │       └── _template/   # Template for new modules
│   └── routes/
│       ├── (app)/           # Authenticated routes
│       └── (marketing)/     # Public routes
├── static/                  # Static assets
└── e2e/                     # E2E tests
```

See [docs/STRUCTURE.md](./docs/STRUCTURE.md) for detailed architecture documentation.

## Creating a New Feature

1. **Copy the module template:**

    ```bash
    cp -r src/lib/modules/_template src/lib/modules/your-feature
    ```

2. **Add your feature code:**
    - Components in `components/`
    - State management in `stores/`
    - Server logic in `server/`
    - Types in `types/`
    - Utilities in `utils/`

3. **Export your public API:**

    ```typescript
    // src/lib/modules/your-feature/index.ts
    export { default as YourComponent } from './components/YourComponent.svelte';
    export { yourStore } from './stores/your-store.svelte';
    export type { YourType } from './types';
    ```

4. **Create routes:**
    ```bash
    mkdir -p src/routes/(app)/your-feature
    ```

## Route Groups

Route groups organize routes with different layouts without affecting URLs:

- **(app)**: Authenticated application routes (dashboard, settings, profile)
- **(marketing)**: Public marketing pages (homepage, about, pricing)

Example: `src/routes/(app)/dashboard/+page.svelte` → `/dashboard`

## Testing

```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# E2E tests only
npm run test:e2e

# Watch mode for unit tests
npm run test:unit -- --watch
```

### Test Organization

- Unit/component tests: `**/*.spec.ts`
- E2E tests: `e2e/**/*.test.ts`

## Development

```bash
# Start dev server
npm run dev

# Type checking
npm run check

# Linting
npm run lint

# Format code
npm run format
```

## Building

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Svelte 5 Best Practices

See [docs/SVELTE5.md](./docs/SVELTE5.md) for comprehensive Svelte 5 patterns and best practices.

### Quick Tips

- Use `$state()` for reactive state
- Use `$derived()` for computed values
- Use `$effect()` for side effects
- Components are now functions, not classes
- Event handlers use `on` prefix (e.g., `onclick`)

## Customizing This Template

### For New Projects

1. Update `package.json` name and version
2. Update this README with your project details
3. Remove example features you don't need
4. Configure deployment adapter in `svelte.config.js`
5. Set up environment variables

### Remove Features

```bash
# Remove a module
rm -rf src/lib/modules/module-name

# Remove a route group
rm -rf src/routes/(group-name)
```

## Deployment

This template uses `@sveltejs/adapter-auto` which automatically adapts to your deployment platform:

- **Vercel**: Zero configuration
- **Netlify**: Zero configuration
- **Cloudflare Pages**: Zero configuration
- **Node.js**: Add `@sveltejs/adapter-node`

See [SvelteKit adapters](https://svelte.dev/docs/kit/adapters) for other platforms.

## Documentation

- [Project Structure](./docs/STRUCTURE.md) - Codebase organization and conventions
- [Architecture](./docs/ARCHITECTURE.md) - Design decisions and patterns
- [Svelte 5 Guide](./docs/SVELTE5.md) - Svelte 5 best practices with runes
- [Testing Guide](./docs/TESTING.md) - Testing strategies and examples

### External Resources

- [SvelteKit Documentation](https://svelte.dev/docs/kit)
- [Svelte 5 Documentation](https://svelte.dev/docs/svelte/overview)

## License

MIT
