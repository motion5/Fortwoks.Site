# Testing Guide

Comprehensive guide to testing in this SvelteKit starter template.

## Overview

This project uses:

- **Vitest**: Unit and component tests
- **Playwright**: End-to-end tests
- **Testing Library**: Component testing utilities

## Running Tests

```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# E2E tests only
npm run test:e2e

# Watch mode for unit tests
npm run test:unit -- --watch

# Run specific test file
npm run test:unit -- src/lib/components/Button.spec.ts
```

## Unit Testing

### Basic Component Test

```typescript
// src/lib/components/Button.spec.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Button from './Button.svelte';

describe('Button', () => {
    it('renders with text', () => {
        render(Button, { props: { children: 'Click me' } });
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('calls onclick handler', async () => {
        let clicked = false;
        const { component } = render(Button, {
            props: {
                onclick: () => {
                    clicked = true;
                }
            }
        });

        await component.click();
        expect(clicked).toBe(true);
    });
});
```

### Testing Svelte 5 Components

```typescript
// src/lib/components/Counter.spec.ts
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Counter from './Counter.svelte';

describe('Counter', () => {
    it('increments count on button click', async () => {
        const { getByRole, getByText } = render(Counter);
        const button = getByRole('button', { name: /increment/i });

        expect(getByText('Count: 0')).toBeInTheDocument();

        await fireEvent.click(button);
        expect(getByText('Count: 1')).toBeInTheDocument();

        await fireEvent.click(button);
        expect(getByText('Count: 2')).toBeInTheDocument();
    });

    it('starts with initial count', () => {
        const { getByText } = render(Counter, {
            props: { initialCount: 10 }
        });

        expect(getByText('Count: 10')).toBeInTheDocument();
    });
});
```

### Testing State and Derived Values

```typescript
// src/lib/stores/counter.spec.ts
import { describe, it, expect } from 'vitest';
import { createCounter } from './counter.svelte';

describe('createCounter', () => {
    it('initializes with zero', () => {
        const counter = createCounter();
        expect(counter.count).toBe(0);
    });

    it('increments count', () => {
        const counter = createCounter();
        counter.increment();
        expect(counter.count).toBe(1);
        counter.increment();
        expect(counter.count).toBe(2);
    });

    it('decrements count', () => {
        const counter = createCounter();
        counter.increment();
        counter.increment();
        counter.decrement();
        expect(counter.count).toBe(1);
    });

    it('resets count', () => {
        const counter = createCounter();
        counter.increment();
        counter.increment();
        counter.reset();
        expect(counter.count).toBe(0);
    });
});
```

### Testing Utilities

```typescript
// src/lib/utils/format.spec.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from './format';

describe('formatCurrency', () => {
    it('formats USD correctly', () => {
        expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
        expect(formatCurrency(0, 'USD')).toBe('$0.00');
        expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
    });
});

describe('formatDate', () => {
    it('formats date correctly', () => {
        const date = new Date('2024-01-15');
        expect(formatDate(date)).toBe('January 15, 2024');
    });
});
```

## Component Testing

### Browser-based Component Tests

```typescript
// src/lib/components/Form.spec.ts
import { describe, it, expect } from 'vitest';
import { render, userEvent } from '@testing-library/svelte';
import Form from './Form.svelte';

describe('Form', () => {
    it('submits form data', async () => {
        let submittedData: any;

        const { getByLabelText, getByRole } = render(Form, {
            props: {
                onsubmit: (data) => {
                    submittedData = data;
                }
            }
        });

        const nameInput = getByLabelText('Name');
        const submitButton = getByRole('button', { name: /submit/i });

        await userEvent.type(nameInput, 'John Doe');
        await userEvent.click(submitButton);

        expect(submittedData).toEqual({ name: 'John Doe' });
    });

    it('validates required fields', async () => {
        const { getByRole, getByText } = render(Form);
        const submitButton = getByRole('button', { name: /submit/i });

        await userEvent.click(submitButton);

        expect(getByText('Name is required')).toBeInTheDocument();
    });
});
```

## E2E Testing

### Basic E2E Test

```typescript
// e2e/homepage.test.ts
import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Welcome to SvelteKit' })).toBeVisible();
});

test('navigation works', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL('/dashboard');

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

### Testing User Flows

```typescript
// e2e/user-flow.test.ts
import { test, expect } from '@playwright/test';

test('complete user registration flow', async ({ page }) => {
    await page.goto('/register');

    // Fill in form
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('securepassword123');
    await page.getByLabel('Confirm Password').fill('securepassword123');

    // Submit form
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Verify success
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome!')).toBeVisible();
});
```

### Testing Forms

```typescript
// e2e/contact-form.test.ts
import { test, expect } from '@playwright/test';

test('submits contact form', async ({ page }) => {
    await page.goto('/contact');

    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel('Message').fill('Hello, this is a test message');

    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByText('Message sent successfully')).toBeVisible();
});

test('validates email format', async ({ page }) => {
    await page.goto('/contact');

    await page.getByLabel('Email').fill('invalid-email');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByText('Invalid email address')).toBeVisible();
});
```

### Testing Authentication

```typescript
// e2e/auth.test.ts
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page).toHaveURL('/dashboard');
});

test('logout flow', async ({ page }) => {
    // Assumes user is logged in
    await page.goto('/dashboard');

    await page.getByRole('button', { name: 'Log Out' }).click();

    await expect(page).toHaveURL('/');
});
```

## Testing Server Code

### Testing API Routes

```typescript
// src/routes/api/users/+server.spec.ts
import { describe, it, expect } from 'vitest';
import { GET, POST } from './+server';

describe('GET /api/users', () => {
    it('returns users list', async () => {
        const request = new Request('http://localhost/api/users');
        const response = await GET({ request });

        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('users');
        expect(Array.isArray(data.users)).toBe(true);
    });
});

describe('POST /api/users', () => {
    it('creates a new user', async () => {
        const request = new Request('http://localhost/api/users', {
            method: 'POST',
            body: JSON.stringify({
                name: 'John Doe',
                email: 'john@example.com'
            })
        });

        const response = await POST({ request });

        expect(response.status).toBe(201);

        const data = await response.json();
        expect(data.user).toHaveProperty('id');
        expect(data.user.name).toBe('John Doe');
    });
});
```

## Mocking

### Mocking Modules

```typescript
import { describe, it, expect, vi } from 'vitest';
import { fetchUser } from './api';

vi.mock('./api', () => ({
    fetchUser: vi.fn().mockResolvedValue({
        id: 1,
        name: 'John Doe'
    })
}));

describe('User Component', () => {
    it('loads user data', async () => {
        const user = await fetchUser(1);
        expect(user.name).toBe('John Doe');
    });
});
```

### Mocking Fetch

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('API calls', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    it('fetches user data', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 1, name: 'John Doe' })
        });

        const response = await fetch('/api/users/1');
        const data = await response.json();

        expect(data.name).toBe('John Doe');
    });
});
```

## Best Practices

### ✅ Do

- Write tests alongside your code
- Test user behavior, not implementation
- Use descriptive test names
- Keep tests simple and focused
- Mock external dependencies
- Test error states
- Use accessibility queries (getByRole, getByLabelText)

### ❌ Don't

- Test implementation details
- Write brittle tests that break with UI changes
- Over-mock everything
- Skip edge cases
- Forget to test error handling
- Use generic selectors (class names, IDs)

## Coverage

```bash
# Generate coverage report
npm run test:unit -- --coverage

# View coverage in browser
open coverage/index.html
```

## Debugging Tests

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
    "type": "node",
    "request": "launch",
    "name": "Debug Vitest Tests",
    "runtimeExecutable": "npm",
    "runtimeArgs": ["run", "test:unit", "--", "--run"],
    "console": "integratedTerminal"
}
```

### Debug Playwright Tests

```bash
# Run with UI mode
npx playwright test --ui

# Run with debug mode
npx playwright test --debug

# Run specific test in debug mode
npx playwright test e2e/homepage.test.ts --debug
```

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: 20

            - run: npm ci
            - run: npx playwright install --with-deps
            - run: npm test
```

## Learn More

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/docs/svelte-testing-library/intro/)
