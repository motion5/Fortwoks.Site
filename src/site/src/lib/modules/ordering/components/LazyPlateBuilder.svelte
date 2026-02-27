<!--
  LazyPlateBuilder.svelte
  Bottom-sheet stepped builder for Lazy Plate deals.

  Flow:
  1. User taps a lazy plate card → this opens as a bottom sheet
  2. Steps through each selection (Main, Side, Base, etc.)
  3. Auto-advances on selection
  4. Shows progress bar + step dots + selection summary pills
  5. "Add to Basket" activates only when all steps complete

  Maps to Andromeda's Deal model:
  - Each step = a DealLine
  - Each selection = a product from the DealLine's ProductList
  - Submit via POST /baskets/{id}/deals
-->
<script lang="ts">
    import type { LazyPlate, LazyPlateItemsMap } from '../types';
    import { themeStore } from '../stores/theme.svelte';
    import { basketStore } from '../stores/basket.svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        plate: LazyPlate;
        /** Map of step key → available item names */
        itemsMap: LazyPlateItemsMap;
        onclose: () => void;
        /** Optional: render a 3D plate visual that overflows above the sheet.
         *  Receives (plate, activeStepIndex) */
        plateVisual?: Snippet<[LazyPlate, number]>;
    }

    let { plate, itemsMap, onclose, plateVisual }: Props = $props();

    let t = $derived(themeStore.tokens);
    let accent = $derived(themeStore.isDark ? plate.accentDark : plate.accentLight);

    let currentStep = $state(0);
    let selections = $state<Record<string, string>>({});
    let listEl: HTMLDivElement | undefined = $state();

    let step = $derived(plate.steps[currentStep]);
    let items = $derived(itemsMap[step.key] ?? []);
    let completedCount = $derived(Object.keys(selections).length);
    let progress = $derived((completedCount / plate.steps.length) * 100);
    let allDone = $derived(plate.steps.every((s) => selections[s.key]));

    function select(item: string) {
        selections = { ...selections, [step.key]: item };
        setTimeout(() => {
            if (currentStep < plate.steps.length - 1) {
                currentStep++;
                listEl?.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 250);
    }

    function goBack() {
        if (currentStep > 0) {
            currentStep--;
            listEl?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function goToStep(i: number) {
        if (selections[plate.steps[i].key] || i <= currentStep) {
            currentStep = i;
        }
    }

    function addToBasket() {
        if (!allDone) return;
        basketStore.addLazyPlate({
            plateName: plate.name,
            plateId: plate.id,
            price: plate.price,
            selections
        });
        onclose();
    }

    function handleOverlayClick(e: MouseEvent) {
        if (e.target === e.currentTarget) onclose();
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') onclose();
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="overlay" class:dark={themeStore.isDark} onclick={handleOverlayClick}>
    <div class="sheet-wrapper">
        <!-- Floating plate hero (positioned above the sheet) -->
        {#if plateVisual}
            <div class="plate-hero">
                {@render plateVisual(plate, currentStep)}
            </div>
        {/if}

        <div
            class="sheet"
            style:background={t.sheetBg}
            style:border-color={t.surfaceBorder}
            style:box-shadow={t.shadow}
            role="dialog"
            aria-label="{plate.name} builder"
        >
            <!-- Header -->
            <div class="header">
                <div class="header-left">
                    {#if currentStep > 0}
                        <button
                            class="icon-btn"
                            style:background={t.surface}
                            style:color={t.textSecondary}
                            onclick={goBack}
                            aria-label="Go back"
                        >
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path
                                    d="M11 4l-5 5 5 5"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>
                    {/if}
                    <div>
                        <h2 class="title" style:color={t.text}>{plate.name}</h2>
                        <p class="subtitle" style:color={t.textSecondary}>
                            from £{plate.price.toFixed(2)}
                        </p>
                    </div>
                </div>
                <button
                    class="icon-btn"
                    style:background={t.surface}
                    style:color={t.textSecondary}
                    onclick={onclose}
                    aria-label="Close"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                            d="M4 4l10 10M14 4L4 14"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                        />
                    </svg>
                </button>
            </div>

            <!-- Progress bar -->
            <div class="progress-track" style:background={t.progressBg}>
                <div class="progress-fill" style:width="{progress}%" style:background={accent} />
            </div>

            <!-- Step dots -->
            <div class="step-dots">
                {#each plate.steps as s, i (s.key)}
                    {@const completed = !!selections[s.key]}
                    {@const isCurrent = i === currentStep}
                    <button
                        class="step-dot"
                        onclick={() => goToStep(i)}
                        disabled={!completed && i > currentStep}
                    >
                        <div
                            class="dot-circle"
                            class:completed
                            class:current={isCurrent}
                            style:--accent={accent}
                            style:--border={t.surfaceBorder}
                        >
                            {#if completed}
                                <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
                                    <path
                                        d="M4 9l3.5 3.5L14 5"
                                        stroke="#fff"
                                        stroke-width="2.2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            {/if}
                        </div>
                        <span
                            class="dot-label"
                            class:current={isCurrent}
                            style:color={isCurrent ? t.text : t.textTertiary}
                        >
                            {s.label.replace('Choose your ', '').replace('Choose ', '')}
                        </span>
                    </button>
                {/each}
            </div>

            <!-- Step heading -->
            <div class="step-heading">
                <h3 style:color={t.text}>{step.label}</h3>
                <span style:color={t.textTertiary}>
                    Step {currentStep + 1} of {plate.steps.length}
                </span>
            </div>

            <!-- Selection summary pills -->
            {#if completedCount > 0}
                <div class="selection-summary">
                    {#each plate.steps as s, i (s.key)}
                        {#if selections[s.key]}
                            <div
                                class="pill"
                                style:border-color="{accent}40"
                                style:background="{accent}08"
                            >
                                <span class="pill-label" style:color={accent}>
                                    {s.label.replace('Choose your ', '').replace('Choose ', '')}
                                </span>
                                <span class="pill-value" style:color={t.textSecondary}>
                                    {selections[s.key]}
                                </span>
                            </div>
                        {/if}
                    {/each}
                </div>
            {/if}

            <!-- Item list -->
            <div class="item-list" bind:this={listEl}>
                {#each items as item (item)}
                    {@const isSelected = selections[step.key] === item}
                    <button
                        class="item-row"
                        class:selected={isSelected}
                        style:background={isSelected ? `${accent}12` : t.inputBg}
                        style:border-color={isSelected ? accent : t.surfaceBorder}
                        style:color={t.text}
                        onclick={() => select(item)}
                    >
                        <span class="item-name">{item}</span>
                        <div
                            class="item-check"
                            class:checked={isSelected}
                            style:border-color={isSelected ? accent : t.checkBorder}
                            style:background={isSelected ? accent : t.checkBg}
                        >
                            {#if isSelected}
                                <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
                                    <path
                                        d="M4 9l3.5 3.5L14 5"
                                        stroke="#fff"
                                        stroke-width="2.2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            {/if}
                        </div>
                    </button>
                {/each}
            </div>

            <!-- Footer / Add to basket -->
            <div class="footer" style:border-top-color={t.surfaceBorder}>
                <button
                    class="basket-btn"
                    class:ready={allDone}
                    style:background={allDone ? accent : t.surface}
                    style:color={allDone ? '#fff' : t.textTertiary}
                    style:box-shadow={allDone ? `0 4px 20px ${accent}50` : 'none'}
                    disabled={!allDone}
                    onclick={addToBasket}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                            d="M6 6h12l-1.5 7H7.5L6 6z"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M6 6L5 3H2"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <circle cx="8.5" cy="16.5" r="1.5" fill="currentColor" />
                        <circle cx="15.5" cy="16.5" r="1.5" fill="currentColor" />
                    </svg>
                    <span>
                        {#if allDone}
                            Add to Basket · £{plate.price.toFixed(2)}
                        {:else}
                            Select {plate.steps.length - completedCount} more
                        {/if}
                    </span>
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    .overlay {
        position: fixed;
        inset: 0;
        z-index: 300;
        background: rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: flex;
        align-items: flex-end;
        justify-content: center;
        animation: fadeIn 0.2s ease;
    }

    .overlay.dark {
        background: rgba(0, 0, 0, 0.65);
    }

    .sheet-wrapper {
        position: relative;
        width: 100%;
        max-width: 540px;
        align-self: flex-end;
    }

    /* Floating plate hero — sits above the sheet top edge */
    .plate-hero {
        position: absolute;
        bottom: calc(100% - 80px);
        left: 50%;
        transform: translateX(-50%);
        width: 220px;
        height: 200px;
        pointer-events: none;
        z-index: 310;
    }

    @media (max-width: 640px) {
        .plate-hero {
            width: 170px;
            height: 160px;
            bottom: calc(100% - 70px);
        }
    }

    .sheet {
        width: 100%;
        height: 88vh;
        border-radius: 24px 24px 0 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        border: 1px solid;
        border-bottom: none;
    }

    /* Header */
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 20px 14px;
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .title {
        font-family: 'Playfair Display', serif;
        font-size: 22px;
        font-weight: 700;
        letter-spacing: -0.02em;
        margin: 0;
    }

    .subtitle {
        font-size: 13px;
        margin: 2px 0 0;
    }

    .icon-btn {
        border: none;
        border-radius: 10px;
        padding: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        font-family: inherit;
    }

    /* Progress */
    .progress-track {
        height: 3px;
        margin: 0 20px;
        border-radius: 2px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        border-radius: 2px;
        transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    }

    /* Step dots */
    .step-dots {
        display: flex;
        justify-content: center;
        gap: 16px;
        padding: 16px 16px 6px;
        flex-wrap: wrap;
    }

    .step-dot {
        background: none;
        border: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        padding: 0;
        font-family: inherit;
    }

    .step-dot:disabled {
        cursor: default;
    }

    .dot-circle {
        width: 26px;
        height: 26px;
        border-radius: 13px;
        border: 2px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.25s ease;
        background: transparent;
    }

    .dot-circle.completed {
        background: var(--accent);
        border-color: var(--accent);
    }

    .dot-circle.current {
        border-color: var(--accent);
        transform: scale(1.15);
    }

    .dot-label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-weight: 400;
        max-width: 60px;
        text-align: center;
        line-height: 1.2;
        transition: all 0.2s;
    }

    .dot-label.current {
        font-weight: 600;
    }

    /* Step heading */
    .step-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 20px 6px;
    }

    .step-heading h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
    }

    .step-heading span {
        font-size: 12px;
    }

    /* Selection summary */
    .selection-summary {
        display: flex;
        gap: 8px;
        padding: 6px 20px 10px;
        flex-wrap: wrap;
    }

    .pill {
        padding: 5px 10px;
        border-radius: 8px;
        border: 1px solid;
    }

    .pill-label {
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        display: block;
    }

    .pill-value {
        font-size: 12px;
        font-weight: 500;
        margin-top: 1px;
        display: block;
    }

    /* Item list */
    .item-list {
        flex: 1;
        overflow-y: auto;
        padding: 4px 20px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .item-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px;
        border-radius: 12px;
        border: 1px solid;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
        text-align: left;
    }

    .item-name {
        font-size: 14px;
        font-weight: 500;
    }

    .item-check {
        width: 24px;
        height: 24px;
        border-radius: 12px;
        border: 2px solid;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    /* Footer */
    .footer {
        padding: 12px 20px 28px;
        border-top: 1px solid;
    }

    .basket-btn {
        width: 100%;
        padding: 16px;
        border-radius: 14px;
        border: none;
        font-size: 15px;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all 0.25s ease;
    }

    .basket-btn:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }

    .basket-btn.ready:hover {
        filter: brightness(1.1);
    }

    /* Animations */
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            transform: translateY(100%);
        }
        to {
            transform: translateY(0);
        }
    }

    @media (max-width: 640px) {
        .sheet-wrapper {
            margin-top: 60px;
        }

        .sheet {
            height: 78vh;
        }

        .header {
            padding-top: 80px;
        }
    }
</style>
