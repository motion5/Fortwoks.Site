<!--
  MenuSection.svelte
  Wraps a menu category section: heading + responsive grid of items.
  Supports optional availability text (e.g. "Available Sunday – Thursday").

  Grid: 3 columns desktop → 2 columns tablet → 2 columns mobile
-->
<script lang="ts">
	import { themeStore } from '../stores/theme.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		availability?: string;
		children: Snippet;
	}

	let { title, availability, children }: Props = $props();
	let t = $derived(themeStore.tokens);
</script>

<section class="menu-section">
	<div class="section-header">
		<h2 class="section-title" style:color={t.text}>{title}</h2>
		{#if availability}
			<span class="availability" style:color={t.textTertiary}>{availability}</span>
		{/if}
	</div>
	<div class="menu-grid">
		{@render children()}
	</div>
</section>

<style>
	.menu-section {
		padding-top: 36px;
	}

	.section-header {
		display: flex;
		align-items: baseline;
		gap: 12px;
		margin-bottom: 16px;
	}

	.section-title {
		font-family: 'Playfair Display', serif;
		font-size: 26px;
		font-weight: 700;
		letter-spacing: -0.02em;
		margin: 0;
	}

	.availability {
		font-size: 12px;
		font-style: italic;
	}

	.menu-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}

	@media (min-width: 641px) and (max-width: 1024px) {
		.menu-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.menu-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 420px) {
		.menu-grid {
			gap: 8px;
		}
	}
</style>
