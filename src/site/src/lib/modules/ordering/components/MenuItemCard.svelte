<!--
  MenuItemCard.svelte
  Displays a single menu item with name, price, optional description,
  and an animated add-to-basket button.

  Responsive: vertical card on desktop, adapts on mobile via CSS grid.
  The emoji placeholder is temporary — swap for <img> when food photos arrive.
-->
<script lang="ts">
    import type { MenuItem } from '../types';
    import { themeStore } from '../stores/theme.svelte';
    import { basketStore } from '../stores/basket.svelte';

    interface Props {
        item: MenuItem;
    }

    let { item }: Props = $props();
    let t = $derived(themeStore.tokens);
    let added = $state(false);

    function handleAdd() {
        if (item.outOfStock) return;
        added = true;
        basketStore.addItem({
            basketId: '',
            name: item.name,
            price: item.price,
            type: 'item',
            productId: item.productId
        });
        setTimeout(() => {
            added = false;
        }, 700);
    }
</script>

<div
    class="menu-card"
    class:out-of-stock={item.outOfStock}
    style:background={themeStore.isDark ? t.cardBg : t.cardBg}
    style:border-color={t.surfaceBorder}
    style:--shadow={t.shadow}
>
    <!-- Image / emoji placeholder -->
    <div
        class="card-image"
        style:background={themeStore.isDark
            ? 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))'
            : 'linear-gradient(135deg, #f8f5f2, #f0ebe4)'}
    >
        <!-- TODO: Replace with <img> when food photography is available -->
        <span class="card-emoji">{item.emoji}</span>
    </div>

    <div class="card-content">
        <h4 class="card-name" style:color={t.text}>{item.name}</h4>
        {#if item.desc}
            <p class="card-desc" style:color={t.textTertiary}>{item.desc}</p>
        {/if}

        <div class="card-footer">
            <span class="card-price" style:color={t.text}>
                £{item.price.toFixed(2)}
            </span>

            {#if item.outOfStock}
                <span class="out-of-stock-badge" style:color={t.textTertiary}> Unavailable </span>
            {:else}
                <button
                    class="add-btn"
                    class:added
                    style:background={added ? '#2d9d5e' : t.accent}
                    style:box-shadow="0 2px 10px {added ? 'rgba(45,157,94,0.3)' : t.accentGlow}"
                    onclick={handleAdd}
                    aria-label="Add {item.name} to basket"
                >
                    {#if added}
                        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                            <path
                                d="M4 9l3.5 3.5L14 5"
                                stroke="currentColor"
                                stroke-width="2.2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    {:else}
                        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                            <path
                                d="M9 3v12M3 9h12"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                            />
                        </svg>
                    {/if}
                </button>
            {/if}
        </div>
    </div>
</div>

<style>
    .menu-card {
        border: 1px solid;
        border-radius: 14px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: all 0.25s ease;
        animation: fadeInUp 0.4s ease both;
    }

    .menu-card:hover {
        transform: translateY(-2px);
    }

    .menu-card.out-of-stock {
        opacity: 0.5;
        pointer-events: none;
    }

    .card-image {
        min-height: 90px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
    }

    .menu-card:hover .card-image {
        transform: scale(1.02);
    }

    .card-emoji {
        font-size: 32px;
    }

    .card-content {
        padding: 12px 14px 14px;
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .card-name {
        font-size: 13.5px;
        font-weight: 600;
        line-height: 1.3;
        letter-spacing: -0.01em;
        margin: 0;
    }

    .card-desc {
        font-size: 11.5px;
        margin: 3px 0 0;
        line-height: 1.35;
    }

    .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        padding-top: 10px;
    }

    .card-price {
        font-size: 15px;
        font-weight: 700;
    }

    .add-btn {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        border: none;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .add-btn.added {
        transform: scale(1.12);
    }

    .add-btn:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
    }

    .out-of-stock-badge {
        font-size: 11px;
        font-weight: 500;
        font-style: italic;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(16px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Mobile: 2-column grid cards stay vertical but get more compact */
    @media (max-width: 420px) {
        .card-image {
            min-height: 70px;
        }
        .card-emoji {
            font-size: 26px;
        }
        .card-content {
            padding: 10px 12px 12px;
        }
        .card-name {
            font-size: 12.5px;
        }
    }
</style>
