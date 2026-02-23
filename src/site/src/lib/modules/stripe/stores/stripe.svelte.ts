import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js';
import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';
import type { PaymentIntentResponse } from '../types';

class StripeStore {
    stripe = $state<Stripe | null>(null);
    elements = $state<StripeElements | null>(null);
    loading = $state(false);
    error = $state<string | null>(null);
    paymentIntent = $state<PaymentIntentResponse | null>(null);

    /**
     * Initialize Stripe
     */
    async init() {
        if (this.stripe) return;

        try {
            this.loading = true;
            this.stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
            this.error = null;
        } catch (err) {
            this.error = err instanceof Error ? err.message : 'Failed to load Stripe';
        } finally {
            this.loading = false;
        }
    }

    /**
     * Create payment elements
     */
    createElements(clientSecret: string) {
        if (!this.stripe) {
            throw new Error('Stripe not initialized');
        }
        this.elements = this.stripe.elements({ clientSecret });
        return this.elements;
    }

    /**
     * Set payment intent
     */
    setPaymentIntent(intent: PaymentIntentResponse) {
        this.paymentIntent = intent;
    }

    /**
     * Clear payment intent
     */
    clearPaymentIntent() {
        this.paymentIntent = null;
        this.elements = null;
    }

    /**
     * Set error
     */
    setError(message: string) {
        this.error = message;
    }

    /**
     * Clear error
     */
    clearError() {
        this.error = null;
    }

    /**
     * Reset store
     */
    reset() {
        this.elements = null;
        this.paymentIntent = null;
        this.error = null;
    }
}

export const stripeStore = new StripeStore();
