# Feature Modules

This directory contains feature-specific modules for the application.

## Philosophy

Each module represents a distinct feature domain (e.g., authentication, billing, profile management). Modules are self-contained and follow a consistent structure.

## Adding a New Module

1. Copy the `_template` directory
2. Rename it to match your feature (use lowercase with hyphens)
3. Implement your feature following the template structure
4. Export public APIs through the module's `index.ts`

## Module Structure

Each module follows this structure:

- **components/**: Svelte components specific to this feature
- **stores/**: State management (Svelte stores)
- **server/**: Server-side utilities, API calls, form actions
- **types/**: TypeScript type definitions
- **utils/**: Helper functions and utilities
- **index.ts**: Public API exports

## Best Practices

- Keep modules focused and cohesive
- Minimize dependencies between modules
- Use shared components from `src/lib/components` when appropriate
- Export only what's needed outside the module
- Document public APIs with JSDoc comments
