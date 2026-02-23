# Module Template

This is a template structure for creating new feature modules in the application.

## Structure

```
module-name/
├── components/    # Module-specific Svelte components
├── stores/        # Module-specific Svelte stores
├── server/        # Server-side utilities and actions
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── index.ts       # Module exports
```

## Creating a New Module

1. Copy this `_template` directory
2. Rename it to your module name (e.g., `auth`, `billing`, `profile`)
3. Add your module-specific code to the appropriate subdirectories
4. Export public APIs through `index.ts`

## Guidelines

- Keep modules focused on a single feature domain
- Use the `components/` subdirectory for UI components
- Use the `stores/` subdirectory for state management
- Use the `server/` subdirectory for server-side logic
- Use the `types/` subdirectory for shared TypeScript types
- Use the `utils/` subdirectory for helper functions
- Export only what needs to be used outside the module

## Example Module Structure

```typescript
// index.ts
export { default as LoginForm } from './components/LoginForm.svelte';
export { authStore } from './stores/auth.svelte';
export type { User, AuthState } from './types';
```
