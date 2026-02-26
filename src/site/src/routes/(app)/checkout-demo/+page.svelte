<script lang="ts">
    import { themeStore } from '$lib/modules/ordering';
    import { base } from '$app/paths';

    let t = $derived(themeStore.tokens);
</script>

<svelte:head>
    <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
        rel="stylesheet"
    />
    <title>Fort Woks — Checkout</title>
</svelte:head>

<div class="checkout" style:background={t.bg} style:color={t.text}>
    <div class="container">
        <a href="{base}/menus" class="back" style:color={t.textSecondary}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                    d="M11 4l-5 5 5 5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
            Back to menu
        </a>

        <h1 class="title">Checkout</h1>

        <div class="layout">
            <div class="card" style:background={t.surface} style:border-color={t.surfaceBorder}>
                <h2 class="card-title" style:color={t.text}>Payment details</h2>

                <div class="field">
                    <label style:color={t.textSecondary}>Card number</label>
                    <div
                        class="input"
                        style:background={t.inputBg}
                        style:border-color={t.surfaceBorder}
                    >
                        <span style:color={t.textTertiary}>4242 4242 4242 4242</span>
                        <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                            <rect width="32" height="20" rx="3" fill="#635BFF" />
                            <path
                                d="M13.6 12.8h-1.2l.8-4.8h1.2l-.8 4.8zm5.2-4.7c-.2-.1-.6-.2-1-.2-.6 0-1.1.3-1.1.7 0 .3.3.5.8.7.5.2 1.2.5 1.2 1.2 0 .9-.8 1.4-1.9 1.4-.4 0-.9-.1-1.2-.2l.2-.7c.3.1.7.2 1 .2.4 0 .7-.2.7-.4 0-.3-.2-.4-.7-.6-.5-.2-1.2-.5-1.2-1.2 0-.8.7-1.4 1.8-1.4.4 0 .8.1 1.1.2l-.2.7z"
                                fill="#fff"
                            />
                        </svg>
                    </div>
                </div>

                <div class="row">
                    <div class="field">
                        <label style:color={t.textSecondary}>Expiry</label>
                        <div
                            class="input"
                            style:background={t.inputBg}
                            style:border-color={t.surfaceBorder}
                        >
                            <span style:color={t.textTertiary}>12 / 28</span>
                        </div>
                    </div>
                    <div class="field">
                        <label style:color={t.textSecondary}>CVC</label>
                        <div
                            class="input"
                            style:background={t.inputBg}
                            style:border-color={t.surfaceBorder}
                        >
                            <span style:color={t.textTertiary}>123</span>
                        </div>
                    </div>
                </div>

                <button class="pay-btn" disabled> Pay now — Demo only </button>

                <p class="powered-by" style:color={t.textTertiary}>
                    Powered by <strong>Stripe</strong> (demo)
                </p>
            </div>

            <div class="card" style:background={t.surface} style:border-color={t.surfaceBorder}>
                <h2 class="card-title" style:color={t.text}>Order summary</h2>
                <div class="summary-row" style:border-color={t.surfaceBorder}>
                    <span>Saver Plate x1</span>
                    <span style:color={t.textSecondary}>£8.99</span>
                </div>
                <div class="summary-row" style:border-color={t.surfaceBorder}>
                    <span>Delivery</span>
                    <span style:color={t.textSecondary}>£2.50</span>
                </div>
                <div class="summary-row total" style:border-color={t.surfaceBorder}>
                    <strong>Total</strong>
                    <strong>£11.49</strong>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .checkout {
        min-height: 100vh;
        font-family:
            'DM Sans',
            -apple-system,
            sans-serif;
        padding: 20px;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
    }

    .back {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        text-decoration: none;
        font-size: 14px;
        margin-bottom: 24px;
        color: inherit;
    }

    .title {
        font-family: 'Playfair Display', serif;
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 24px;
    }

    .layout {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 20px;
    }

    .card {
        border-radius: 14px;
        border: 1px solid;
        padding: 24px;
        align-self: start;
    }

    .card-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 20px;
    }

    .field {
        margin-bottom: 16px;
        flex: 1;
    }

    .field label {
        display: block;
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }

    .input {
        border: 1px solid;
        border-radius: 8px;
        padding: 12px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .row {
        display: flex;
        gap: 12px;
    }

    .pay-btn {
        width: 100%;
        padding: 14px;
        border-radius: 10px;
        border: none;
        background: #635bff;
        color: #fff;
        font-size: 15px;
        font-weight: 600;
        font-family: inherit;
        cursor: not-allowed;
        opacity: 0.6;
        margin-top: 8px;
    }

    .powered-by {
        text-align: center;
        font-size: 12px;
        margin: 12px 0 0;
    }

    .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid;
        font-size: 14px;
    }

    .summary-row.total {
        border-bottom: none;
        padding-top: 16px;
        font-size: 16px;
    }

    @media (max-width: 640px) {
        .layout {
            grid-template-columns: 1fr;
        }
    }
</style>
