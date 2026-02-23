/**
 * Stripe payment intent status
 */
export type PaymentStatus =
    | 'requires_payment_method'
    | 'requires_confirmation'
    | 'requires_action'
    | 'processing'
    | 'succeeded'
    | 'canceled';

/**
 * Payment intent creation request
 */
export interface CreatePaymentIntentRequest {
    amount: number;
    currency?: string;
    metadata?: Record<string, string>;
}

/**
 * Payment intent response
 */
export interface PaymentIntentResponse {
    clientSecret: string;
    id: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
}

/**
 * Stripe customer data
 */
export interface StripeCustomer {
    id: string;
    email?: string;
    name?: string;
    metadata?: Record<string, string>;
}

/**
 * Payment method data
 */
export interface PaymentMethod {
    id: string;
    type: 'card' | 'bank_account' | 'other';
    card?: {
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
    };
}

/**
 * Webhook event types
 */
export type StripeWebhookEventType =
    | 'payment_intent.succeeded'
    | 'payment_intent.payment_failed'
    | 'customer.subscription.created'
    | 'customer.subscription.updated'
    | 'customer.subscription.deleted'
    | 'invoice.payment_succeeded'
    | 'invoice.payment_failed';

/**
 * Webhook event data
 */
export interface StripeWebhookEvent {
    id: string;
    type: StripeWebhookEventType;
    data: {
        object: unknown;
    };
}
