import type Stripe from 'stripe';
import type { StripeWebhookEvent } from '../types';
import { getStripeClient } from './client';
import { stripeConfig } from './config';

/**
 * Verify and parse webhook event
 */
export function verifyWebhook(payload: string | Buffer, signature: string): StripeWebhookEvent {
    const stripe = getStripeClient();

    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        stripeConfig.webhookSecret
    ) as Stripe.Event;

    return {
        id: event.id,
        type: event.type as StripeWebhookEvent['type'],
        data: event.data
    };
}

/**
 * Webhook event handlers
 */
export const webhookHandlers = {
    /**
     * Handle successful payment
     */
    async handlePaymentSucceeded(event: StripeWebhookEvent): Promise<void> {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        // Add your business logic here
    },

    /**
     * Handle failed payment
     */
    async handlePaymentFailed(event: StripeWebhookEvent): Promise<void> {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);
        // Add your business logic here
    },

    /**
     * Handle subscription created
     */
    async handleSubscriptionCreated(event: StripeWebhookEvent): Promise<void> {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription created:', subscription.id);
        // Add your business logic here
    },

    /**
     * Handle subscription updated
     */
    async handleSubscriptionUpdated(event: StripeWebhookEvent): Promise<void> {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscription.id);
        // Add your business logic here
    },

    /**
     * Handle subscription deleted
     */
    async handleSubscriptionDeleted(event: StripeWebhookEvent): Promise<void> {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription deleted:', subscription.id);
        // Add your business logic here
    }
};
