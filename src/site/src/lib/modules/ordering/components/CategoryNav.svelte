<!--
  CategoryNav.svelte
  Sticky horizontal scrolling category bar.
  Highlights active category; scrolls to section on click.
-->
<script lang="ts">
    import type { MenuCategory } from '../types';
    import { themeStore } from '../stores/theme.svelte';

    interface Props {
        categories: MenuCategory[];
        activeId: string;
        onselect: (id: string) => void;
    }

    let { categories, activeId, onselect }: Props = $props();
    let t = $derived(themeStore.tokens);
</script>

<nav class="category-nav" style:background={t.navBg} style:border-bottom-color={t.surfaceBorder}>
    <div class="category-nav-inner">
        {#each categories as cat (cat.id)}
            <button
                class="category-btn"
                class:active={activeId === cat.id}
                style:--accent={t.accent}
                style:--text-secondary={t.textSecondary}
                onclick={() => onselect(cat.id)}
            >
                {cat.label}
            </button>
        {/each}
    </div>
</nav>

<style>
    .category-nav {
        position: sticky;
        top: 65px;
        z-index: 99;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid;
    }

    .category-nav-inner {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        overflow-x: auto;
        padding: 0 14px;
        scrollbar-width: none;
    }

    .category-nav-inner::-webkit-scrollbar {
        display: none;
    }

    .category-btn {
        background: none;
        border: none;
        border-bottom: 2.5px solid transparent;
        padding: 11px 14px;
        font-size: 13px;
        font-family: inherit;
        white-space: nowrap;
        color: var(--text-secondary);
        font-weight: 400;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .category-btn.active {
        color: var(--accent);
        border-bottom-color: var(--accent);
        font-weight: 700;
    }

    .category-btn:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }
</style>
