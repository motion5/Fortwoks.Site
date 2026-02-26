<!--
  LazyPlatesSection.svelte
  Hero section for the Lazy Plates (Saver + Premium).
  Displays plate cards in a 2-column grid that goes 1-column on mobile.
  Opens the LazyPlateBuilder bottom sheet on click.

  NOTE: This component does NOT render the PlateSVG / 3D plate visual.
  That's your existing menu module's responsibility. This provides the
  card wrapper, info, and click handler. Drop your <PlateScene> or
  <PlateSVG> into the `plateVisual` slot.
-->
<script lang="ts">
	import type { LazyPlate } from '../types';
	import { themeStore } from '../stores/theme.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		plates: LazyPlate[];
		onselect: (plate: LazyPlate) => void;
		/** Optional: render a custom visual per plate (receives plate as argument) */
		plateVisual?: Snippet<[LazyPlate]>;
		/** Called on card mousemove — receives the event and plate */
		oncardmousemove?: (e: MouseEvent, plate: LazyPlate) => void;
		/** Called on card mouseleave — receives the plate */
		oncardmouseleave?: (plate: LazyPlate) => void;
	}

	let { plates, onselect, plateVisual, oncardmousemove, oncardmouseleave }: Props = $props();
	let t = $derived(themeStore.tokens);
</script>

<section class="lazy-section">
	<div class="section-header">
		<h2 class="section-title" style:color={t.text}>Lazy Plates</h2>
		<span class="availability" style:color={t.textTertiary}>
			Available Sunday – Thursday
		</span>
	</div>
	<p class="section-desc" style:color={t.textSecondary}>
		Build your perfect meal — choose your favourites and save.
	</p>

	<div class="plates-grid">
		{#each plates as plate (plate.id)}
			{@const accent = themeStore.isDark ? plate.accentDark : plate.accentLight}
			<button
				class="plate-card"
				style:background={t.cardBg}
				style:border-color={t.surfaceBorder}
				style:--shadow={themeStore.isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.05)'}
				onclick={() => onselect(plate)}
				onmousemove={oncardmousemove ? (e) => oncardmousemove(e, plate) : undefined}
				onmouseleave={oncardmouseleave ? () => oncardmouseleave(plate) : undefined}
			>
				<!-- Glow behind plate visual -->
				<div
					class="plate-glow"
					style:background="radial-gradient(ellipse at 50% 20%, {accent}{themeStore.isDark
						? '20'
						: '10'}, transparent 70%)"
				/>

				<!-- Plate visual slot -->
				<div class="plate-visual">
					{#if plateVisual}
						{@render plateVisual(plate)}
					{:else}
						<!-- Fallback: simple coloured circle -->
						<div class="plate-fallback" style:border-color="{accent}40">
							<span style:color={accent} class="plate-count">
								{plate.sections}
							</span>
						</div>
					{/if}
				</div>

				<!-- Info -->
				<div class="plate-info">
					<h3 class="plate-name" style:color={t.text}>{plate.name}</h3>
					<p class="plate-subtitle" style:color={t.textTertiary}>
						{plate.subtitle}
					</p>
					<p class="plate-desc" style:color={t.textSecondary}>
						{plate.description}
					</p>
					<div class="plate-footer">
						<span class="plate-price" style:color={accent}>
							from £{plate.price.toFixed(2)}
						</span>
						<span
							class="plate-cta"
							style:background={accent}
							style:box-shadow="0 2px 10px {accent}40"
						>
							Build Yours →
						</span>
					</div>
				</div>
			</button>
		{/each}
	</div>
</section>

<style>
	.lazy-section {
		padding-top: 32px;
	}

	.section-header {
		display: flex;
		align-items: baseline;
		gap: 12px;
		margin-bottom: 4px;
	}

	.section-title {
		font-family: 'Playfair Display', serif;
		font-size: 28px;
		font-weight: 700;
		letter-spacing: -0.02em;
		margin: 0;
	}

	.availability {
		font-size: 12px;
		font-style: italic;
	}

	.section-desc {
		font-size: 14px;
		line-height: 1.5;
		margin: 0 0 20px;
	}

	.plates-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.plate-card {
		background: none;
		border: 1px solid;
		border-radius: 18px;
		overflow: hidden;
		position: relative;
		display: flex;
		flex-direction: column;
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		color: inherit;
		padding: 0;
		transition: all 0.3s ease;
		box-shadow: var(--shadow);
	}

	.plate-card:hover {
		transform: translateY(-3px);
		filter: brightness(1.02);
	}

	.plate-glow {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 65%;
		pointer-events: none;
	}

	.plate-visual {
		display: flex;
		justify-content: center;
		padding: 30px 20px 10px;
		position: relative;
		animation: float 5s ease-in-out infinite;
	}

	.plate-fallback {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		border: 2px dashed;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.4;
	}

	.plate-count {
		font-size: 32px;
		font-weight: 700;
	}

	.plate-info {
		padding: 6px 20px 20px;
		position: relative;
	}

	.plate-name {
		font-family: 'Playfair Display', serif;
		font-size: 20px;
		font-weight: 700;
		letter-spacing: -0.01em;
		margin: 0;
	}

	.plate-subtitle {
		font-size: 12px;
		margin: 2px 0 8px;
	}

	.plate-desc {
		font-size: 13px;
		line-height: 1.5;
		margin: 0 0 16px;
	}

	.plate-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.plate-price {
		font-size: 19px;
		font-weight: 700;
	}

	.plate-cta {
		font-size: 12px;
		font-weight: 600;
		color: #fff;
		padding: 7px 16px;
		border-radius: 9px;
		transition: transform 0.2s;
	}

	.plate-card:hover .plate-cta {
		transform: translateX(3px);
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-5px);
		}
	}

	@media (max-width: 640px) {
		.plates-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
