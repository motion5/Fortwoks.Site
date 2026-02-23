# Shared Components

Reusable components used across multiple features.

## Structure

- **ui/**: Generic UI components (buttons, inputs, cards, etc.)
- **layout/**: Layout components (headers, footers, sidebars, etc.)

## Guidelines

- Components here should be generic and reusable
- Feature-specific components belong in `src/lib/modules/[module-name]/components/`
- Document props and usage with JSDoc comments
- Follow consistent naming conventions

## Usage

```svelte
<script>
    import { Button } from '$lib/components/ui';
    import { Header } from '$lib/components/layout';
</script>

<Header />
<Button>Click me</Button>
```
