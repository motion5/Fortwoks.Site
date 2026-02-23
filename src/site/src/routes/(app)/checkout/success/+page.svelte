<script lang="ts">
    import { page } from '$app/stores';

    const paymentIntentId = $page.url.searchParams.get('payment_intent');
</script>

<svelte:head>
    <title>Payment Successful</title>
</svelte:head>

<div class="success-page">
    <div class="container">
        <div class="success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p class="message">Your payment has been processed successfully.</p>

        {#if paymentIntentId}
            <p class="payment-id">
                Payment ID: <code>{paymentIntentId}</code>
            </p>
        {/if}

        <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
        <a href="/dashboard" class="button">Go to Dashboard</a>
    </div>
</div>

<style>
    .success-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: #f9fafb;
    }

    .container {
        width: 100%;
        max-width: 500px;
        background: white;
        border-radius: 12px;
        padding: 3rem 2rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        text-align: center;
    }

    .success-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #10b981;
        color: white;
        font-size: 3rem;
        font-weight: bold;
        border-radius: 50%;
    }

    h1 {
        margin: 0 0 1rem;
        font-size: 2rem;
        font-weight: 700;
        color: #111827;
    }

    .message {
        margin: 0 0 1.5rem;
        color: #6b7280;
        font-size: 1.125rem;
    }

    .payment-id {
        margin: 0 0 2rem;
        color: #6b7280;
        font-size: 0.875rem;
    }

    .payment-id code {
        padding: 0.25rem 0.5rem;
        background: #f3f4f6;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.8125rem;
    }

    .button {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background: #635bff;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        transition: background 0.2s;
    }

    .button:hover {
        background: #5145e6;
    }
</style>
