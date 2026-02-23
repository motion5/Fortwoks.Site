import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';

/**
 * Stripe configuration
 */
export const stripeConfig = {
    secretKey: STRIPE_SECRET_KEY,
    webhookSecret: STRIPE_WEBHOOK_SECRET,
    apiVersion: '2026-01-28.clover' as const
};

/**
 * Validate Stripe configuration
 */
export function validateStripeConfig(): void {
    if (!stripeConfig.secretKey) {
        throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    if (!stripeConfig.webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
    }
}
