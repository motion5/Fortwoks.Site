# Stripe Module Documentation

Complete payment integration module for SvelteKit using Stripe.

## Installation

The module is already installed. To use it, you need to configure your environment variables.

### Environment Setup

1. Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

2. Get your Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

3. Add your keys to `.env`:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Module Structure

```
src/lib/modules/stripe/
├── components/         # UI components
│   ├── PaymentForm.svelte
│   └── CheckoutButton.svelte
├── stores/            # State management
│   └── stripe.svelte.ts
├── server/            # Server-side utilities
│   ├── config.ts
│   ├── client.ts
│   ├── payment-intents.ts
│   └── webhooks.ts
├── types/             # TypeScript types
│   └── index.ts
├── utils/             # Helper functions
│   ├── format.ts
│   └── validation.ts
└── index.ts           # Module exports
```

## Components

### CheckoutButton

Button that initiates checkout flow by creating a payment intent and redirecting to checkout page.

```svelte
<script>
    import { CheckoutButton, dollarsToCents } from '$lib/modules/stripe';
</script>

<CheckoutButton
    amount={dollarsToCents(29.99)}
    currency="usd"
    metadata={{ productId: '123', plan: 'pro' }}
/>
```

**Props:**

- `amount` (number, required) - Amount in cents
- `currency` (string, optional) - Currency code, defaults to 'usd'
- `metadata` (object, optional) - Custom metadata
- `disabled` (boolean, optional) - Disable the button
- `onCheckout` (function, optional) - Callback when checkout starts

### PaymentForm

Complete payment form with Stripe Elements integration.

```svelte
<script>
    import { PaymentForm } from '$lib/modules/stripe';

    function handleSuccess(paymentIntent) {
        console.log('Payment succeeded:', paymentIntent);
    }

    function handleError(error) {
        console.error('Payment failed:', error);
    }
</script>

<PaymentForm
    {clientSecret}
    amount={2999}
    currency="USD"
    onSuccess={handleSuccess}
    onError={handleError}
/>
```

**Props:**

- `clientSecret` (string, required) - Payment intent client secret
- `amount` (number, optional) - Amount to display
- `currency` (string, optional) - Currency for display
- `onSuccess` (function, optional) - Success callback
- `onError` (function, optional) - Error callback

## Server Functions

### Payment Intents

```typescript
import { createPaymentIntent } from '$lib/modules/stripe/server';

const paymentIntent = await createPaymentIntent({
    amount: 2999, // $29.99 in cents
    currency: 'usd',
    metadata: { orderId: '123' }
});
```

**Available functions:**

- `createPaymentIntent(request)` - Create a new payment intent
- `retrievePaymentIntent(id)` - Get payment intent details
- `cancelPaymentIntent(id)` - Cancel a payment intent
- `updatePaymentIntent(id, metadata)` - Update payment intent metadata

### Webhooks

Handle Stripe webhook events:

```typescript
import { verifyWebhook, webhookHandlers } from '$lib/modules/stripe/server';

const event = verifyWebhook(payload, signature);

switch (event.type) {
    case 'payment_intent.succeeded':
        await webhookHandlers.handlePaymentSucceeded(event);
        break;
    // ... other events
}
```

## Utility Functions

### Formatting

```typescript
import {
    formatAmount,
    dollarsToCents,
    centsToDollars,
    formatCardBrand,
    formatCardNumber,
    formatExpiration
} from '$lib/modules/stripe';

// Format amount
formatAmount(2999); // "$29.99"

// Convert between dollars and cents
dollarsToCents(29.99); // 2999
centsToDollars(2999); // 29.99

// Format card info
formatCardBrand('visa'); // "Visa"
formatCardNumber('4242'); // "•••• 4242"
formatExpiration(12, 2025); // "12/25"
```

### Validation

```typescript
import {
    validateAmount,
    validateCurrency,
    validateEmail,
    isTerminalStatus,
    requiresAction
} from '$lib/modules/stripe';

validateAmount(2999); // true
validateCurrency('usd'); // true
validateEmail('user@example.com'); // true
isTerminalStatus('succeeded'); // true
requiresAction('requires_action'); // true
```

## API Routes

The module includes example API routes:

### Create Payment Intent

```bash
POST /api/stripe/payment-intent
```

**Request:**

```json
{
    "amount": 2999,
    "currency": "usd",
    "metadata": {
        "productId": "123"
    }
}
```

**Response:**

```json
{
    "clientSecret": "pi_xxx_secret_xxx",
    "id": "pi_xxx",
    "status": "requires_payment_method",
    "amount": 2999,
    "currency": "usd"
}
```

### Webhook Endpoint

```bash
POST /api/stripe/webhook
```

Configure this URL in your [Stripe webhook settings](https://dashboard.stripe.com/webhooks).

**Handled events:**

- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Usage Example

See the demo page at `/stripe-demo` for a complete implementation example.

### Basic Flow

1. User clicks checkout button
2. Create payment intent via API
3. Redirect to checkout page with client secret
4. User enters payment details in PaymentForm
5. Submit payment through Stripe
6. Redirect to success page

### Code Example

**Product page:**

```svelte
<script>
    import { CheckoutButton, dollarsToCents } from '$lib/modules/stripe';
</script>

<CheckoutButton amount={dollarsToCents(29.99)} metadata={{ productId: 'prod_123' }}>
    Buy Now - $29.99
</CheckoutButton>
```

**Checkout page:**

```svelte
<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { PaymentForm } from '$lib/modules/stripe';

    const clientSecret = $page.url.searchParams.get('clientSecret');
    const amount = parseInt($page.url.searchParams.get('amount') || '0');

    function handleSuccess(paymentIntent) {
        goto(`/checkout/success?payment_intent=${paymentIntent.id}`);
    }
</script>

<PaymentForm {clientSecret} {amount} onSuccess={handleSuccess} />
```

## Testing

Use these test card numbers in test mode:

- **Successful payment:** `4242 4242 4242 4242`
- **Declined payment:** `4000 0000 0000 9995`
- **Requires 3D Secure:** `4000 0025 0000 3155`

Use any future expiration date and any 3-digit CVC.

## Webhook Testing

Use Stripe CLI for local webhook testing:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5173/api/stripe/webhook

# Trigger test events
stripe trigger payment_intent.succeeded
```

## Production Checklist

Before going live:

- [ ] Replace test keys with live keys in production environment
- [ ] Configure webhook endpoint in Stripe Dashboard
- [ ] Test webhook delivery
- [ ] Implement proper error handling and logging
- [ ] Add rate limiting to API endpoints
- [ ] Set up monitoring for failed payments
- [ ] Implement customer notifications (email, etc.)
- [ ] Add proper security measures (CSRF, etc.)
- [ ] Review and implement PCI compliance requirements
- [ ] Test with real payment methods

## TypeScript Types

All types are exported from the module:

```typescript
import type {
    PaymentStatus,
    CreatePaymentIntentRequest,
    PaymentIntentResponse,
    StripeCustomer,
    PaymentMethod,
    StripeWebhookEventType,
    StripeWebhookEvent
} from '$lib/modules/stripe';
```

## Further Reading

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Elements](https://stripe.com/docs/stripe-js)
- [Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Webhooks](https://stripe.com/docs/webhooks)
- [Testing](https://stripe.com/docs/testing)
