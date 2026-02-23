import { describe, it, expect, beforeEach, vi } from 'vitest';
import { stripeStore } from './stripe.svelte';

// Mock env
vi.mock('$env/static/public', () => ({
    PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_123'
}));

describe('StripeStore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('sets payment intent', () => {
        const paymentIntent = {
            id: 'pi_123',
            clientSecret: 'secret',
            status: 'succeeded' as const,
            amount: 1000,
            currency: 'usd'
        };

        stripeStore.setPaymentIntent(paymentIntent);

        expect(stripeStore.paymentIntent).toEqual(paymentIntent);
    });

    it('clears payment intent', () => {
        const paymentIntent = {
            id: 'pi_123',
            clientSecret: 'secret',
            status: 'succeeded' as const,
            amount: 1000,
            currency: 'usd'
        };
        stripeStore.setPaymentIntent(paymentIntent);

        stripeStore.clearPaymentIntent();

        expect(stripeStore.paymentIntent).toBe(null);
        expect(stripeStore.elements).toBe(null);
    });

    it('sets and clears errors', () => {
        stripeStore.setError('Test error');
        expect(stripeStore.error).toBe('Test error');

        stripeStore.clearError();
        expect(stripeStore.error).toBe(null);
    });

    it('resets store to initial state', () => {
        stripeStore.setPaymentIntent({
            id: 'pi_123',
            clientSecret: 'secret',
            status: 'succeeded',
            amount: 1000,
            currency: 'usd'
        });
        stripeStore.setError('Test error');

        stripeStore.reset();

        expect(stripeStore.paymentIntent).toBe(null);
        expect(stripeStore.elements).toBe(null);
        expect(stripeStore.error).toBe(null);
    });
});
