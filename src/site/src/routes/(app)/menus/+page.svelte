<!--
  /routes/(app)/menus/+page.svelte
  Menu showcase page — reuses ordering module components to display
  the full Fort Woks menu with theme switching, category navigation,
  and basket functionality.

  This is essentially the same as /order but mounted at /menus as the
  primary menu browsing experience.
-->
<script lang="ts">
    import {
        CategoryNav,
        MenuItemCard,
        MenuSection,
        LazyPlatesSection,
        LazyPlateBuilder,
        BasketBar,
        ThemeToggle,
        CosmicBackground,
        DragonBackground,
        themeStore,
        basketStore
    } from '$lib/modules/ordering';

    import fortwoksLogo from '$lib/assets/fortwoks_logo_v1.jpeg';

    import type { LazyPlate } from '$lib/modules/ordering';

    import { MenuPie, createSectionDefs, getPlateBaseRotation } from '$lib/modules/menu';
    import gsap from 'gsap';

    import {
        CATEGORIES,
        LAZY_PLATES,
        LAZY_PLATE_ITEMS,
        STARTERS,
        SIDES
    } from '$lib/modules/ordering/utils/sample-data';

    let activeCategory = $state('lazy-plates');
    let builderPlate = $state<LazyPlate | null>(null);

    let t = $derived(themeStore.tokens);

    let categoryRefs = $state<Record<string, HTMLElement | null>>({});

    function scrollToCategory(id: string) {
        activeCategory = id;
        categoryRefs[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function openBuilder(plate: LazyPlate) {
        builderPlate = plate;
    }

    // ─── Mouse-tracking plate rotation ──────────────────────
    // Per-plate rotation range: more sections = fuller sweep
    const PLATE_ROTATION_RANGE: Record<string, number> = {
        saver: 120,
        premium: 360
    };
    const DEFAULT_RANGE = 120;

    /** Lookup the base rotation for a plate by id → section count */
    const plateSectionCounts: Record<string, number> = {};
    for (const p of LAZY_PLATES) plateSectionCounts[p.id] = p.sections;

    function baseRadFor(plateId: string): number {
        return getPlateBaseRotation(plateSectionCounts[plateId] ?? 2);
    }

    function halfRange(plateId: string): number {
        const deg = PLATE_ROTATION_RANGE[plateId] ?? DEFAULT_RANGE;
        return ((deg / 2) * Math.PI) / 180;
    }

    // Per-plate GSAP-tweened rotation (keyed by plate id)
    let plateRotations = $state<Record<string, number>>({});
    // Track active tweens so we can kill them on leave
    const activeTweens: Record<string, gsap.core.Tween> = {};

    function handlePlateMouseMove(e: MouseEvent, plateId: string) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const normalizedX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const base = baseRadFor(plateId);
        const hr = halfRange(plateId);
        const targetRad = base - hr + normalizedX * 2 * hr;

        activeTweens[plateId]?.kill();
        const obj = { value: plateRotations[plateId] ?? base };
        activeTweens[plateId] = gsap.to(obj, {
            value: targetRad,
            duration: 0.4,
            ease: 'power2.out',
            onUpdate: () => {
                plateRotations[plateId] = obj.value;
            }
        });
    }

    function handlePlateMouseLeave(plateId: string) {
        const base = baseRadFor(plateId);
        activeTweens[plateId]?.kill();
        const obj = { value: plateRotations[plateId] ?? base };
        activeTweens[plateId] = gsap.to(obj, {
            value: base,
            duration: 0.6,
            ease: 'power2.out',
            onUpdate: () => {
                plateRotations[plateId] = obj.value;
            }
        });
    }
</script>

<svelte:head>
    <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap"
        rel="stylesheet"
    />
    <title>Fort Woks — Menu</title>
    {@html `<style>html, body { background: ${t.bg}; margin: 0; }</style>`}
</svelte:head>

<div class="page" class:dark-theme={themeStore.isDark} style:background={t.bg} style:color={t.text}>
    {#if themeStore.isDark}
        <CosmicBackground />
    {:else}
        <DragonBackground />
    {/if}

    <!-- Header -->
    <header
        class="header"
        style:background={t.headerBg}
        style:border-bottom-color={t.surfaceBorder}
    >
        <div class="header-inner">
            <div class="header-left">
                <div>
                    <h1 class="brand-name" style:color={t.text}>Fort Woks</h1>
                    <p class="brand-sub" style:color={t.textTertiary}>Delivery & Collection</p>
                </div>
            </div>
            <div class="header-center">
                <img src={fortwoksLogo} alt="Fort Woks" class="header-logo" />
            </div>
            <div class="header-right">
                <ThemeToggle />
                <button
                    class="icon-btn basket-icon"
                    aria-label="Basket"
                    class:bounce={basketStore.bouncing}
                    style:background={t.surface}
                    style:color={t.textSecondary}
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
                    {#if basketStore.count > 0}
                        <span
                            class="badge"
                            style:background={t.accent}
                            style:box-shadow="0 2px 8px {t.accentGlow}"
                        >
                            {basketStore.count}
                        </span>
                    {/if}
                </button>
            </div>
        </div>
    </header>

    <!-- Category Nav -->
    <CategoryNav categories={CATEGORIES} activeId={activeCategory} onselect={scrollToCategory} />

    <!-- Main content -->
    <main class="main">
        <!-- Lazy Plates -->
        <div bind:this={categoryRefs['lazy-plates']}>
            <LazyPlatesSection
                plates={LAZY_PLATES}
                onselect={openBuilder}
                oncardmousemove={(e, plate) => handlePlateMouseMove(e, plate.id)}
                oncardmouseleave={(plate) => handlePlateMouseLeave(plate.id)}
            >
                {#snippet plateVisual(plate)}
                    {@const accent = themeStore.isDark ? plate.accentDark : plate.accentLight}
                    <div class="plate-3d" style:height="190px" style:pointer-events="none">
                        <MenuPie
                            showControls={false}
                            sections={createSectionDefs(plate.sections, accent)}
                            targetRotation={plateRotations[plate.id]}
                        />
                    </div>
                {/snippet}
            </LazyPlatesSection>
        </div>

        <!-- Starters -->
        <div bind:this={categoryRefs['starters']}>
            <MenuSection title="Starters">
                {#each STARTERS as item (item.name)}
                    <MenuItemCard {item} />
                {/each}
            </MenuSection>
        </div>

        <!-- Sides -->
        <div bind:this={categoryRefs['sides']}>
            <MenuSection title="Sides">
                {#each SIDES as item (item.name)}
                    <MenuItemCard {item} />
                {/each}
            </MenuSection>
        </div>

        <!-- Placeholder sections for remaining categories -->
        {#each CATEGORIES.filter((c) => !['lazy-plates', 'starters', 'sides'].includes(c.id)) as cat (cat.id)}
            <div bind:this={categoryRefs[cat.id]}>
                <section class="placeholder-section" style:padding-top="36px">
                    <h2 class="section-title" style:color={t.text}>{cat.label}</h2>
                    <div
                        class="placeholder"
                        style:border-color={t.surfaceBorder}
                        style:color={t.textTertiary}
                    >
                        <span class="placeholder-icon">{cat.icon}</span>
                        {cat.label} items will appear here
                    </div>
                </section>
            </div>
        {/each}
    </main>

    <!-- Basket Bar -->
    <BasketBar checkoutHref="/checkout-demo" />

    <!-- Lazy Plate Builder -->
    {#if builderPlate}
        <LazyPlateBuilder
            plate={builderPlate}
            itemsMap={LAZY_PLATE_ITEMS}
            onclose={() => (builderPlate = null)}
        >
            {#snippet plateVisual(plate, activeStep)}
                {@const accent = themeStore.isDark ? plate.accentDark : plate.accentLight}
                <div class="builder-plate" style:pointer-events="none">
                    <MenuPie
                        showControls={false}
                        sections={createSectionDefs(plate.sections, accent)}
                        activeSection={activeStep}
                    />
                </div>
            {/snippet}
        </LazyPlateBuilder>
    {/if}
</div>

<style>
    .page {
        min-height: 100vh;
        font-family:
            'DM Sans',
            -apple-system,
            sans-serif;
        position: relative;
    }

    .header {
        position: sticky;
        top: 0;
        z-index: 100;
        backdrop-filter: blur(24px) saturate(180%);
        -webkit-backdrop-filter: blur(24px) saturate(180%);
        border-bottom: 1px solid;
    }

    .header-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 12px 20px;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .header-center {
        display: flex;
        justify-content: center;
    }

    .header-logo {
        height: 48px;
        width: auto;
        object-fit: contain;
        border-radius: 8px;
    }

    :global(.dark-theme) .header-logo {
        filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.35))
            drop-shadow(0 0 4px rgba(255, 255, 255, 0.2));
    }

    .brand-name {
        font-family: 'Playfair Display', serif;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.1;
        margin: 0;
    }

    .brand-sub {
        font-size: 11px;
        margin: 1px 0 0;
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 6px;
        justify-content: flex-end;
    }

    .icon-btn {
        border: none;
        border-radius: 10px;
        padding: 9px;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-family: inherit;
        position: relative;
    }

    .basket-icon {
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .basket-icon.bounce {
        transform: scale(1.18);
    }

    .badge {
        position: absolute;
        top: -4px;
        right: -4px;
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        width: 18px;
        height: 18px;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .plate-3d {
        width: 100%;
        max-width: 220px;
        margin: 0 auto;
    }

    .builder-plate {
        width: 100%;
        height: 100%;
    }

    .main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px 140px;
        position: relative;
        z-index: 1;
    }

    .section-title {
        font-family: 'Playfair Display', serif;
        font-size: 26px;
        font-weight: 700;
        letter-spacing: -0.02em;
        margin: 0 0 16px;
    }

    .placeholder {
        padding: 48px 20px;
        text-align: center;
        border-radius: 14px;
        border: 1px dashed;
        font-size: 13px;
    }

    .placeholder-icon {
        font-size: 28px;
        display: block;
        margin-bottom: 8px;
    }
</style>
