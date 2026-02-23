# Project Structure

This document explains the organization of the codebase.

## Overview

```
svelte-starter/
├── src/
│   ├── lib/
│   │   ├── components/      # Shared components
│   │   │   ├── ui/          # Generic UI components
│   │   │   └── layout/      # Layout components
│   │   ├── modules/         # Feature modules
│   │   │   └── _template/   # Module template
│   │   └── assets/          # Static assets
│   └── routes/
│       ├── (app)/           # Authenticated app routes
│       └── (marketing)/     # Public marketing routes
├── static/                  # Static files
└── e2e/                     # End-to-end tests
```

## Feature Modules

Feature modules are self-contained units in `src/lib/modules/`. Each module follows this structure:

```
module-name/
├── components/    # Module-specific components
├── stores/        # State management
├── server/        # Server-side logic
├── types/         # TypeScript types
├── utils/         # Helper functions
└── index.ts       # Public API
```

### Creating a Module

1. Copy `src/lib/modules/_template/`
2. Rename to your feature name
3. Implement your feature
4. Export APIs through `index.ts`

See `src/lib/modules/README.md` for details.

## Shared Components

Reusable components live in `src/lib/components/`:

- **ui/**: Generic UI components (buttons, inputs, cards)
- **layout/**: Layout components (headers, footers, navigation)

Import with: `import { Button } from '$lib/components/ui'`

## Route Groups

Routes are organized into groups for different layouts:

### (app) - Application Routes

Authenticated routes with app layout (dashboard, settings, profile).

Example: `src/routes/(app)/dashboard/+page.svelte` → `/dashboard`

### (marketing) - Marketing Routes

Public routes with marketing layout (homepage, pricing, about).

Example: `src/routes/(marketing)/about/+page.svelte` → `/about`

**Note**: Route groups (parentheses) don't affect URLs.

## Adding Features

### Quick Add

```bash
# Copy module template
cp -r src/lib/modules/_template src/lib/modules/my-feature

# Add routes
mkdir src/routes/(app)/my-feature
```

### Integration

1. Implement your module in `src/lib/modules/my-feature/`
2. Export public APIs in the module's `index.ts`
3. Create routes in `src/routes/(app)/my-feature/` or `src/routes/(marketing)/my-feature/`
4. Import module components: `import { MyComponent } from '$lib/modules/my-feature'`

## Best Practices

- Keep modules focused on single features
- Minimize cross-module dependencies
- Use shared components when appropriate
- Export only necessary APIs
- Document public interfaces with JSDoc
- Write tests for critical functionality

## Testing

- Unit tests: `src/**/*.spec.ts` (Vitest)
- E2E tests: `e2e/**/*.test.ts` (Playwright)

Run tests: `npm test`

## Learn More

- [SvelteKit Routing](https://svelte.dev/docs/kit/routing)
- [Svelte 5 Documentation](https://svelte.dev/docs/svelte/overview)
