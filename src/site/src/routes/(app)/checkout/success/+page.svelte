<script lang="ts">
    import { themeStore } from '$lib/modules/ordering';
    import { base } from '$app/paths';

    let t = $derived(themeStore.tokens);
</script>

<svelte:head>
    <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap"
        rel="stylesheet"
    />
    <title>Fort Woks — Order Confirmed</title>
</svelte:head>

<div class="page" style:background={t.bg} style:color={t.text}>
    <div class="card" style:background={t.surface} style:border-color={t.surfaceBorder}>
        <div class="icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                    d="M8 16l6 6L24 10"
                    stroke="#fff"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </div>
        <h1>Order confirmed</h1>
        <p style:color={t.textSecondary}>
            Your food is being prepared. Demo only — no real order placed.
        </p>
        <a href="{base}/menus" class="btn">Back to menu</a>
    </div>
</div>

<style>
    .page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family:
            'DM Sans',
            -apple-system,
            sans-serif;
        padding: 20px;
    }

    .card {
        text-align: center;
        border: 1px solid;
        border-radius: 16px;
        padding: 48px 32px;
        max-width: 400px;
        width: 100%;
    }

    .icon {
        width: 64px;
        height: 64px;
        border-radius: 32px;
        background: #22c55e;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
    }

    h1 {
        font-size: 24px;
        font-weight: 700;
        margin: 0 0 8px;
    }

    p {
        font-size: 14px;
        margin: 0 0 24px;
        line-height: 1.5;
    }

    .btn {
        display: inline-block;
        padding: 12px 24px;
        background: #635bff;
        color: #fff;
        text-decoration: none;
        border-radius: 10px;
        font-weight: 600;
        font-size: 14px;
    }
</style>
