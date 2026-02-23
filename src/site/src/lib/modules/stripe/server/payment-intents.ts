import type { CreatePaymentIntentRequest, PaymentIntentResponse } from '../types';
import { getStripeClient } from './client';

/**
 * Create a payment intent
 */
export async function createPaymentIntent(
    request: CreatePaymentIntentRequest
): Promise<PaymentIntentResponse> {
    const stripe = getStripeClient();

    const paymentIntent = await stripe.paymentIntents.create({
        amount: request.amount,
        currency: request.currency || 'usd',
        metadata: request.metadata || {},
        automatic_payment_methods: {
            enabled: true
        }
    });

    return {
        clientSecret: paymentIntent.client_secret!,
        id: paymentIntent.id,
        status: paymentIntent.status as PaymentIntentResponse['status'],
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
    };
}

/**
 * Retrieve a payment intent
 */
export async function retrievePaymentIntent(id: string) {
    const stripe = getStripeClient();
    return await stripe.paymentIntents.retrieve(id);
}

/**
 * Cancel a payment intent
 */
export async function cancelPaymentIntent(id: string) {
    const stripe = getStripeClient();
    return await stripe.paymentIntents.cancel(id);
}

/**
 * Update payment intent metadata
 */
export async function updatePaymentIntent(id: string, metadata: Record<string, string>) {
    const stripe = getStripeClient();
    return await stripe.paymentIntents.update(id, { metadata });
}
