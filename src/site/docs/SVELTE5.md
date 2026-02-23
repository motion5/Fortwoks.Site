# Svelte 5 Best Practices Guide

This guide covers patterns and best practices for Svelte 5 with runes.

## Runes Overview

Svelte 5 introduces "runes" - compiler hints that replace the old reactivity system.

### Core Runes

- `$state()` - Reactive state
- `$derived()` - Computed values
- `$effect()` - Side effects
- `$props()` - Component props
- `$bindable()` - Two-way bindable props

## State Management

### Basic State

```svelte
<script>
    let count = $state(0);

    function increment() {
        count++;
    }
</script>

<button onclick={increment}>
    Count: {count}
</button>
```

### Object State

```svelte
<script>
    let user = $state({
        name: 'Alice',
        age: 30
    });

    function updateName(newName) {
        user.name = newName; // Direct mutation works!
    }
</script>
```

### Array State

```svelte
<script>
    let items = $state([1, 2, 3]);

    function addItem() {
        items.push(items.length + 1); // Direct mutation
        items = items; // Not needed in Svelte 5!
    }

    function removeItem(index) {
        items.splice(index, 1);
    }
</script>
```

## Derived State

Use `$derived()` for computed values:

```svelte
<script>
    let count = $state(0);
    let doubled = $derived(count * 2);
    let tripled = $derived(count * 3);
    let combined = $derived(`${doubled} and ${tripled}`);
</script>

<p>Count: {count}</p><p>Doubled: {doubled}</p><p>Combined: {combined}</p>
```

### Complex Derivations

```svelte
<script>
    let users = $state([
        { name: 'Alice', active: true },
        { name: 'Bob', active: false },
        { name: 'Charlie', active: true }
    ]);

    let activeUsers = $derived(users.filter((u) => u.active));

    let activeCount = $derived(activeUsers.length);

    let userNames = $derived(users.map((u) => u.name).join(', '));
</script>
```

## Side Effects

Use `$effect()` for side effects that should run when dependencies change:

```svelte
<script>
    let count = $state(0);

    $effect(() => {
        console.log(`Count changed to: ${count}`);
        document.title = `Count: ${count}`;
    });
</script>
```

### Cleanup

Return a cleanup function for subscriptions or timers:

```svelte
<script>
    let count = $state(0);

    $effect(() => {
        const interval = setInterval(() => {
            count++;
        }, 1000);

        return () => clearInterval(interval);
    });
</script>
```

### Pre-effect

Use `$effect.pre()` to run before DOM updates:

```svelte
<script>
    let element;
    let previousHeight;

    $effect.pre(() => {
        if (element) {
            previousHeight = element.offsetHeight;
        }
    });
</script>
```

## Component Props

### Basic Props

```svelte
<script>
    let { title, description } = $props();
</script>

<h1>{title}</h1><p>{description}</p>
```

### Props with Defaults

```svelte
<script>
    let { title = 'Default Title', count = 0, items = [] } = $props();
</script>
```

### Optional Props

```svelte
<script>
    let { title, description, optional } = $props();
</script>

{#if optional}
    <p>{optional}</p>
{/if}
```

### Rest Props

```svelte
<script>
    let { title, ...rest } = $props();
</script>

<h1>{title}</h1><div {...rest}>Content</div>
```

## Two-Way Binding

Use `$bindable()` for props that can be bound with `bind:`:

```svelte
<!-- Child.svelte -->
<script>
let { value = $bindable() } = $props();
</script>

<input bind:value />

<!-- Parent.svelte -->
<script>
import Child from './Child.svelte';
let text = $state('');
</script>

<Child bind:value={text} />
<p>You typed: {text}</p>
```

## Event Handling

### Inline Handlers

```svelte
<script>
    let count = $state(0);
</script>

<button onclick={() => count++}>
    Count: {count}
</button>
```

### Named Handlers

```svelte
<script>
    let count = $state(0);

    function handleClick() {
        count++;
    }

    function handleKeydown(event) {
        if (event.key === 'Enter') {
            count++;
        }
    }
</script>

<button onclick={handleClick}>Click</button>
<input onkeydown={handleKeydown} />
```

### Component Events

Pass event handlers as props:

```svelte
<!-- Button.svelte -->
<script>
let { onclick } = $props();
</script>

<button {onclick}>
  <slot />
</button>

<!-- Parent.svelte -->
<script>
import Button from './Button.svelte';

function handleClick() {
  console.log('Clicked!');
}
</script>

<Button onclick={handleClick}>Click me</Button>
```

## Snippets

Snippets replace slots for more flexible content composition:

```svelte
<!-- Card.svelte -->
<script>
let { header, footer, children } = $props();
</script>

<div class="card">
  {#if header}
    <div class="header">
      {@render header()}
    </div>
  {/if}

  <div class="body">
    {@render children()}
  </div>

  {#if footer}
    <div class="footer">
      {@render footer()}
    </div>
  {/if}
</div>

<!-- Usage -->
<script>
import Card from './Card.svelte';
</script>

<Card>
  {#snippet header()}
    <h2>Card Title</h2>
  {/snippet}

  <p>Card content goes here</p>

  {#snippet footer()}
    <button>Action</button>
  {/snippet}
</Card>
```

## Store Integration

Svelte 5 stores work with runes using `.current`:

```svelte
<script>
    import { writable } from 'svelte/store';

    const count = writable(0);

    function increment() {
        count.update((n) => n + 1);
    }
</script>

<p>Count: {count.current}</p>
<button onclick={increment}>Increment</button>
```

### Creating Stores with Runes

```svelte
<!-- counter-store.svelte.ts -->
export function createCounter() {
  let count = $state(0);

  return {
    get count() { return count; },
    increment: () => count++,
    decrement: () => count--,
    reset: () => count = 0
  };
}

<!-- Component.svelte -->
<script>
import { createCounter } from './counter-store.svelte';

const counter = createCounter();
</script>

<p>Count: {counter.count}</p>
<button onclick={counter.increment}>+</button>
<button onclick={counter.decrement}>-</button>
<button onclick={counter.reset}>Reset</button>
```

## Class Components to Runes

### Before (Svelte 4)

```svelte
<script>
    export let initialCount = 0;
    let count = initialCount;
    $: doubled = count * 2;

    function increment() {
        count++;
    }
</script>
```

### After (Svelte 5)

```svelte
<script>
    let { initialCount = 0 } = $props();
    let count = $state(initialCount);
    let doubled = $derived(count * 2);

    function increment() {
        count++;
    }
</script>
```

## Best Practices

### ✅ Do

- Use `$state()` for all reactive state
- Use `$derived()` for computed values
- Use `$effect()` for side effects
- Mutate state directly (no spreading required)
- Keep effects focused and minimal
- Return cleanup functions from effects

### ❌ Don't

- Mix reactive declarations (`$:`) with runes
- Create effects inside conditionals or loops
- Overuse effects - prefer derived state
- Forget cleanup in effects
- Use stores when state/derived would suffice

### Performance Tips

1. **Derived over Effects**: Use `$derived()` instead of `$effect()` when possible
2. **Fine-grained Reactivity**: Only reference what you need in effects
3. **Avoid Large Objects**: Break down large state objects
4. **Memoize Expensive Computations**: Use `$derived()` for expensive calculations

## Migration from Svelte 4

1. Replace `export let` with `$props()`
2. Replace `let` reactive variables with `$state()`
3. Replace `$:` reactive statements with `$derived()` or `$effect()`
4. Update event handlers from `on:click` to `onclick`
5. Consider replacing slots with snippets

## Learn More

- [Svelte 5 Runes Documentation](https://svelte.dev/docs/svelte/what-are-runes)
- [Svelte 5 Migration Guide](https://svelte.dev/docs/svelte/v5-migration-guide)
- [Svelte 5 Tutorial](https://svelte.dev/tutorial)
