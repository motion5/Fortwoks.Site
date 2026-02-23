import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createPaymentIntent } from '$lib/modules/stripe/server';
import type { CreatePaymentIntentRequest } from '$lib/modules/stripe';

/**
 * Create a payment intent
 */
export const POST: RequestHandler = async ({ request }) => {
    try {
        const data: CreatePaymentIntentRequest = await request.json();

        // Validate request
        if (!data.amount || data.amount <= 0) {
            error(400, 'Invalid amount');
        }

        // Create payment intent
        const paymentIntent = await createPaymentIntent({
            amount: data.amount,
            currency: data.currency || 'usd',
            metadata: data.metadata || {}
        });

        return json(paymentIntent);
    } catch (err) {
        console.error('Failed to create payment intent:', err);
        error(500, 'Failed to create payment intent');
    }
};
