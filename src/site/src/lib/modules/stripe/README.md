# Stripe Module

Payment processing integration using Stripe.

## Features

- Payment intent creation and management
- Stripe Elements integration for secure card input
- Webhook handling for payment events
- Customer and subscription management
- Payment method handling

## Structure

- **components/**: Stripe UI components (payment forms, card elements)
- **stores/**: Payment state management
- **server/**: Server-side Stripe API integration
- **types/**: Stripe-related TypeScript types
- **utils/**: Helper functions for Stripe operations

## Usage

```typescript
import { PaymentForm } from '$lib/modules/stripe';
import { stripeStore } from '$lib/modules/stripe';
```

## Environment Variables

Required environment variables:

```bash
# Server-side
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Client-side
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
