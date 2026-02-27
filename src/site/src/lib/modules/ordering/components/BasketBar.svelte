<!--
  BasketBar.svelte
  Persistent bottom bar that appears when items are in the basket.
  Shows item count, total, and checkout CTA.
  Slides up on first item; animates total on change.
-->
<script lang="ts">
    import { themeStore } from '../stores/theme.svelte';
    import { basketStore } from '../stores/basket.svelte';

    interface Props {
        /** Route to navigate to on checkout click */
        checkoutHref?: string;
        oncheckout?: () => void;
    }

    let { checkoutHref = '/checkout', oncheckout }: Props = $props();
    let t = $derived(themeStore.tokens);
</script>

{#if !basketStore.isEmpty}
    <div
        class="basket-bar"
        style:background={t.basketBarBg}
        style:border-top-color={t.surfaceBorder}
    >
        <div class="basket-bar-inner">
            <div class="left">
                <span class="count" style:color={t.textTertiary}>
                    {basketStore.count} item{basketStore.count !== 1 ? 's' : ''}
                </span>
                <span class="total" style:color={t.text}>
                    £{basketStore.total.toFixed(2)}
                </span>
            </div>

            {#if oncheckout}
                <button
                    class="checkout-btn"
                    style:background={t.accent}
                    style:box-shadow="0 4px 20px {t.accentGlow}"
                    onclick={oncheckout}
                >
                    View Basket & Checkout
                </button>
            {:else}
                <a
                    href={checkoutHref}
                    class="checkout-btn"
                    style:background={t.accent}
                    style:box-shadow="0 4px 20px {t.accentGlow}"
                >
                    View Basket & Checkout
                </a>
            {/if}
        </div>
    </div>
{/if}

<style>
    .basket-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 150;
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border-top: 1px solid;
        animation: slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .basket-bar-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 12px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .left {
        display: flex;
        flex-direction: column;
        gap: 1px;
    }

    .count {
        font-size: 12px;
    }

    .total {
        font-size: 21px;
        font-weight: 700;
    }

    .checkout-btn {
        color: #fff;
        border: none;
        border-radius: 13px;
        padding: 14px 28px;
        font-size: 14px;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        display: inline-block;
    }

    .checkout-btn:hover {
        filter: brightness(1.1);
        transform: translateY(-1px);
    }

    @keyframes slideUp {
        from {
            transform: translateY(100%);
        }
        to {
            transform: translateY(0);
        }
    }
</style>
