<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { PaymentForm } from '$lib/modules/stripe';
    import type { PaymentIntentResponse } from '$lib/modules/stripe';

    const clientSecret = $page.url.searchParams.get('clientSecret');
    const amount = parseInt($page.url.searchParams.get('amount') || '0');
    const currency = $page.url.searchParams.get('currency') || 'USD';

    if (!clientSecret) {
        // eslint-disable-next-line svelte/no-navigation-without-resolve
        goto('/');
    }

    function handleSuccess(paymentIntent: PaymentIntentResponse) {
        console.log('Payment succeeded:', paymentIntent);
        // Redirect to success page
        // eslint-disable-next-line svelte/no-navigation-without-resolve
        goto(`/checkout/success?payment_intent=${paymentIntent.id}`);
    }

    function handleError(error: string) {
        console.error('Payment failed:', error);
    }
</script>

<svelte:head>
    <title>Checkout</title>
</svelte:head>

<div class="checkout-page">
    <div class="container">
        <h1>Complete Your Payment</h1>

        {#if clientSecret}
            <PaymentForm
                {clientSecret}
                {amount}
                {currency}
                onSuccess={handleSuccess}
                onError={handleError}
            />
        {:else}
            <p>Invalid checkout session</p>
        {/if}
    </div>
</div>

<style>
    .checkout-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: #f9fafb;
    }

    .container {
        width: 100%;
        max-width: 600px;
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    h1 {
        margin: 0 0 2rem;
        font-size: 1.875rem;
        font-weight: 700;
        color: #111827;
        text-align: center;
    }
</style>
