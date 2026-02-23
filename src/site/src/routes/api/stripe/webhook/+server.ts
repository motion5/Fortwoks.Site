import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyWebhook, webhookHandlers } from '$lib/modules/stripe/server';

/**
 * Handle Stripe webhooks
 */
export const POST: RequestHandler = async ({ request }) => {
    try {
        const signature = request.headers.get('stripe-signature');
        if (!signature) {
            error(400, 'Missing stripe-signature header');
        }

        const payload = await request.text();

        // Verify and parse webhook event
        const event = verifyWebhook(payload, signature);

        // Handle event
        switch (event.type) {
            case 'payment_intent.succeeded':
                await webhookHandlers.handlePaymentSucceeded(event);
                break;

            case 'payment_intent.payment_failed':
                await webhookHandlers.handlePaymentFailed(event);
                break;

            case 'customer.subscription.created':
                await webhookHandlers.handleSubscriptionCreated(event);
                break;

            case 'customer.subscription.updated':
                await webhookHandlers.handleSubscriptionUpdated(event);
                break;

            case 'customer.subscription.deleted':
                await webhookHandlers.handleSubscriptionDeleted(event);
                break;

            default:
                console.log('Unhandled event type:', event.type);
        }

        return json({ received: true });
    } catch (err) {
        console.error('Webhook error:', err);
        error(400, err instanceof Error ? err.message : 'Webhook verification failed');
    }
};
