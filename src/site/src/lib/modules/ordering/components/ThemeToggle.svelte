<!--
  ThemeToggle.svelte
  Small button to switch between Cosmic (dark) and Dragon (light) themes.
  Place in the header alongside search and basket icons.
-->
<script lang="ts">
    import { themeStore } from '../stores/theme.svelte';

    let t = $derived(themeStore.tokens);
</script>

<button
    class="toggle"
    style:background={t.surface}
    style:color={t.textSecondary}
    onclick={() => themeStore.toggle()}
    aria-label="Switch to {themeStore.isDark ? 'light' : 'dark'} theme"
>
    {#if themeStore.isDark}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="3.5" stroke="currentColor" stroke-width="1.5" />
            <path
                d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
            />
        </svg>
        <span>Light</span>
    {:else}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
                d="M15.5 9.5a6.5 6.5 0 01-7-7A6.5 6.5 0 109.5 16a6.5 6.5 0 006-6.5z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
        <span>Dark</span>
    {/if}
</button>

<style>
    .toggle {
        border: none;
        border-radius: 10px;
        padding: 8px 10px;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
        transition: all 0.25s ease;
    }

    .toggle:hover {
        filter: brightness(1.2);
    }
</style>
