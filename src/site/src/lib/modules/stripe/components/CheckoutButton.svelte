<script lang="ts">
    import type { CreatePaymentIntentRequest } from '../types';

    interface Props {
        amount: number;
        currency?: string;
        metadata?: Record<string, string>;
        disabled?: boolean;
        onCheckout?: () => void;
        children?: import('svelte').Snippet;
    }

    let {
        amount,
        currency = 'usd',
        metadata,
        disabled = false,
        onCheckout,
        children
    }: Props = $props();

    let loading = $state(false);
    let error = $state<string | null>(null);

    async function handleClick() {
        if (disabled || loading) return;

        loading = true;
        error = null;

        try {
            const request: CreatePaymentIntentRequest = {
                amount,
                currency,
                metadata
            };

            const response = await fetch('/api/stripe/payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                throw new Error('Failed to create payment intent');
            }

            const data = await response.json();

            // Redirect to checkout page with client secret
            const params = new URLSearchParams({
                clientSecret: data.clientSecret,
                amount: amount.toString(),
                currency
            });

            window.location.href = `/checkout?${params.toString()}`;

            onCheckout?.();
        } catch (err) {
            error = err instanceof Error ? err.message : 'An error occurred';
        } finally {
            loading = false;
        }
    }
</script>

<div class="checkout-button-container">
    <button
        type="button"
        onclick={handleClick}
        disabled={disabled || loading}
        class="checkout-button"
    >
        {#if children}
            {@render children()}
        {:else if loading}
            Processing...
        {:else}
            Checkout
        {/if}
    </button>

    {#if error}
        <div class="error-message" role="alert">
            {error}
        </div>
    {/if}
</div>

<style>
    .checkout-button-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .checkout-button {
        padding: 0.75rem 1.5rem;
        background: #635bff;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
    }

    .checkout-button:hover:not(:disabled) {
        background: #5145e6;
    }

    .checkout-button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
    }

    .error-message {
        padding: 0.5rem 0.75rem;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 4px;
        color: #c33;
        font-size: 0.875rem;
    }
</style>
