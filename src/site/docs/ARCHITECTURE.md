# Architecture

This document explains the architectural decisions and design patterns used in this starter template.

## Design Philosophy

### Modular Architecture

The project is organized around **feature modules** rather than technical layers. This approach:

- **Improves Maintainability**: Related code lives together
- **Enables Scalability**: Add/remove features without affecting others
- **Reduces Coupling**: Modules are self-contained
- **Simplifies Testing**: Test modules in isolation

### Progressive Enhancement

Start simple, add complexity only when needed:

- Basic features use simple components
- Complex features use dedicated modules
- Shared code lives in `lib/components`
- No premature abstractions

## Directory Structure

### Feature Modules (`src/lib/modules/`)

Each module represents a business capability:

```
modules/
├── _template/           # Template for new modules
├── auth/               # Authentication
│   ├── components/     # UI components
│   ├── stores/         # State management
│   ├── server/         # Server-side logic
│   ├── types/          # TypeScript types
│   ├── utils/          # Helper functions
│   └── index.ts        # Public API
└── billing/            # Payment and billing
    └── ...
```

**Benefits:**

- Clear boundaries between features
- Easy to locate feature-specific code
- Simple to remove unused features
- Enables team-based development

### Shared Components (`src/lib/components/`)

Generic, reusable UI components:

```
components/
├── ui/                 # Basic UI primitives
│   ├── Button.svelte
│   ├── Input.svelte
│   └── Card.svelte
└── layout/             # Layout components
    ├── Header.svelte
    ├── Footer.svelte
    └── Sidebar.svelte
```

**Guidelines:**

- Components should be generic and reusable
- Feature-specific components belong in modules
- Keep styling flexible (variants, themes)
- Document props with TypeScript

### Route Groups (`src/routes/`)

Routes organized by layout type:

```
routes/
├── (app)/              # Authenticated routes
│   ├── dashboard/
│   ├── settings/
│   └── profile/
├── (marketing)/        # Public routes
│   ├── about/
│   ├── pricing/
│   └── contact/
├── +page.svelte        # Homepage (root)
└── +layout.svelte      # Root layout
```

**Benefits:**

- Different layouts for different contexts
- URL structure remains clean
- Easy to apply layout-specific logic
- Simple to add new layout types

## Design Patterns

### Module Pattern

Each module exports a clean public API:

```typescript
// src/lib/modules/auth/index.ts
export { default as LoginForm } from './components/LoginForm.svelte';
export { default as SignupForm } from './components/SignupForm.svelte';
export { authStore } from './stores/auth.svelte';
export { login, logout, register } from './server/auth';
export type { User, AuthState, LoginCredentials } from './types';
```

**Usage:**

```typescript
import { LoginForm, authStore } from '$lib/modules/auth';
```

### State Management

**Svelte 5 Runes** for reactive state:

```typescript
// Component-level state
let count = $state(0);
let doubled = $derived(count * 2);

// Shared state (store pattern)
export function createAuthStore() {
    let user = $state(null);
    let isAuthenticated = $derived(user !== null);

    return {
        get user() {
            return user;
        },
        get isAuthenticated() {
            return isAuthenticated;
        },
        setUser: (newUser) => (user = newUser),
        logout: () => (user = null)
    };
}
```

**When to use:**

- `$state()`: Local component state, shared stores
- `$derived()`: Computed values
- `$effect()`: Side effects (API calls, subscriptions)
- Svelte stores: Cross-module state (sparingly)

### Component Composition

**Snippets** for flexible content composition:

```svelte
<!-- Card.svelte -->
<script>
    let { header, footer, children } = $props();
</script>

<div class="card">
    {#if header}
        <header>{@render header()}</header>
    {/if}

    <main>{@render children()}</main>

    {#if footer}
        <footer>{@render footer()}</footer>
    {/if}
</div>
```

### Type Safety

Full TypeScript throughout:

```typescript
// src/lib/modules/auth/types/index.ts
export interface User {
    id: string;
    email: string;
    name: string;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}
```

## Data Flow

### Server-Side Rendering (SSR)

```
Request → +page.server.ts (load) → +page.svelte (render) → Response
```

**Example:**

```typescript
// src/routes/(app)/dashboard/+page.server.ts
export async function load({ locals }) {
    const user = await getUserFromSession(locals.session);
    return { user };
}
```

```svelte
<!-- src/routes/(app)/dashboard/+page.svelte -->
<script>
    let { data } = $props();
</script>

<h1>Welcome, {data.user.name}</h1>
```

### Form Actions

```
Form Submit → +page.server.ts (action) → Redirect or Error
```

**Example:**

```typescript
// src/routes/login/+page.server.ts
export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        const result = await login(email, password);

        if (result.success) {
            cookies.set('session', result.sessionId);
            throw redirect(303, '/dashboard');
        }

        return { error: result.error };
    }
};
```

### API Routes

```
Client Fetch → +server.ts → JSON Response
```

**Example:**

```typescript
// src/routes/api/users/+server.ts
export async function GET({ url }) {
    const users = await db.users.findMany();
    return json({ users });
}

export async function POST({ request }) {
    const data = await request.json();
    const user = await db.users.create(data);
    return json({ user }, { status: 201 });
}
```

## Security Considerations

### Input Validation

- Validate all user input on the server
- Use Zod or similar for schema validation
- Never trust client-side validation alone

### Authentication

- Store sessions securely (httpOnly cookies)
- Implement CSRF protection
- Use secure password hashing (bcrypt, argon2)

### Authorization

- Check permissions on every request
- Use server-side hooks for route protection
- Never expose sensitive data to unauthorized users

## Performance

### Code Splitting

- Automatic route-based code splitting
- Lazy load heavy modules
- Use dynamic imports for large dependencies

### Optimization

- Use `$derived()` instead of `$effect()` when possible
- Minimize reactive dependencies
- Avoid unnecessary re-renders
- Use virtual lists for long lists

## Testing Strategy

### Unit Tests

- Test individual functions and utilities
- Test component logic in isolation
- Mock external dependencies

### Component Tests

- Test user interactions
- Test component props and state
- Use Testing Library queries

### E2E Tests

- Test critical user flows
- Test integration between features
- Use Playwright for browser automation

See [TESTING.md](./TESTING.md) for details.

## Deployment

### Static Site Generation (SSG)

For marketing pages:

```typescript
// src/routes/(marketing)/about/+page.ts
export const prerender = true;
```

### Server-Side Rendering (SSR)

For dynamic pages (default):

```typescript
// No configuration needed
```

### Edge Functions

For global performance:

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';

export default {
    kit: {
        adapter: adapter({ runtime: 'edge' })
    }
};
```

## Extending the Architecture

### Adding a New Module

1. Copy `_template` directory
2. Implement module structure
3. Export public API
4. Create routes if needed
5. Add tests

### Adding a New Route Group

1. Create directory with parentheses: `(group-name)`
2. Add `+layout.svelte` for shared layout
3. Add routes as subdirectories
4. Document in README

### Adding External Services

1. Create module for the service
2. Add server-side code in `module/server/`
3. Use environment variables for configuration
4. Add types for API responses

## Trade-offs

### Why Modules Over Layers?

**Chose:** Feature-based modules
**Over:** Technical layers (components/, services/, utils/)
**Because:** Better for team collaboration and feature isolation

### Why Route Groups?

**Chose:** Route groups with parentheses
**Over:** Deeply nested routes
**Because:** Flexible layouts without affecting URLs

### Why Svelte 5 Runes?

**Chose:** Runes (`$state`, `$derived`)
**Over:** Stores for everything
**Because:** Simpler, more performant, better DX

## Future Considerations

### Database Integration

When needed, add:

- Prisma for type-safe database access
- Database migrations
- Connection pooling

### Authentication

Consider:

- Auth.js (NextAuth) for Svelte
- Supabase Auth
- Custom JWT implementation

### State Management at Scale

If global state becomes complex:

- Context API for shared state
- Redux-like patterns with runes
- Server-side state with load functions

## Learn More

- [SvelteKit Docs](https://svelte.dev/docs/kit)
- [Svelte 5 Docs](https://svelte.dev/docs/svelte/overview)
- [Project Structure](./STRUCTURE.md)
