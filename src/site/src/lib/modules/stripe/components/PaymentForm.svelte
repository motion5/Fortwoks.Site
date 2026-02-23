<script lang="ts">
    import { onMount } from 'svelte';
    import type { StripePaymentElement } from '@stripe/stripe-js';
    import { stripeStore } from '../stores/stripe.svelte';
    import type { PaymentIntentResponse } from '../types';

    interface Props {
        clientSecret: string;
        onSuccess?: (paymentIntent: PaymentIntentResponse) => void;
        onError?: (error: string) => void;
        amount?: number;
        currency?: string;
    }

    let { clientSecret, onSuccess, onError, amount, currency = 'USD' }: Props = $props();

    let paymentElement = $state<HTMLDivElement | null>(null);
    let stripePaymentElement = $state<StripePaymentElement | null>(null);
    let processing = $state(false);
    let errorMessage = $state<string | null>(null);

    onMount(async () => {
        await stripeStore.init();

        if (!stripeStore.stripe) {
            errorMessage = 'Failed to load Stripe';
            return;
        }

        const elements = stripeStore.createElements(clientSecret);
        stripePaymentElement = elements.create('payment');

        if (paymentElement) {
            stripePaymentElement.mount(paymentElement);
        }
    });

    async function handleSubmit(event: Event) {
        event.preventDefault();

        if (!stripeStore.stripe || !stripeStore.elements || processing) {
            return;
        }

        processing = true;
        errorMessage = null;

        const { error, paymentIntent } = await stripeStore.stripe.confirmPayment({
            elements: stripeStore.elements,
            redirect: 'if_required'
        });

        if (error) {
            errorMessage = error.message || 'An error occurred';
            onError?.(errorMessage);
        } else if (paymentIntent) {
            const response: PaymentIntentResponse = {
                id: paymentIntent.id,
                clientSecret: paymentIntent.client_secret || '',
                status: paymentIntent.status as PaymentIntentResponse['status'],
                amount: paymentIntent.amount,
                currency: paymentIntent.currency
            };
            onSuccess?.(response);
        }

        processing = false;
    }
</script>

<form onsubmit={handleSubmit} class="payment-form">
    {#if amount}
        <div class="amount-display">
            <span class="label">Amount:</span>
            <span class="value">
                {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency
                }).format(amount / 100)}
            </span>
        </div>
    {/if}

    <div bind:this={paymentElement} class="payment-element"></div>

    {#if errorMessage}
        <div class="error-message" role="alert">
            {errorMessage}
        </div>
    {/if}

    <button type="submit" disabled={processing || !stripeStore.stripe} class="submit-button">
        {processing ? 'Processing...' : 'Pay Now'}
    </button>
</form>

<style>
    .payment-form {
        max-width: 500px;
        margin: 0 auto;
    }

    .amount-display {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f6f9fc;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }

    .amount-display .label {
        font-size: 0.875rem;
        color: #6b7280;
        font-weight: 500;
    }

    .amount-display .value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1f2937;
    }

    .payment-element {
        margin-bottom: 1.5rem;
    }

    .error-message {
        padding: 0.75rem 1rem;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 6px;
        color: #c33;
        font-size: 0.875rem;
        margin-bottom: 1rem;
    }

    .submit-button {
        width: 100%;
        padding: 0.875rem 1.5rem;
        background: #635bff;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
    }

    .submit-button:hover:not(:disabled) {
        background: #5145e6;
    }

    .submit-button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
    }
</style>
