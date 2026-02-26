<!--
  MenuCard.svelte — A card with the 3D plate floating above it.

  The outer wrapper is invisible and contains both the plate and the
  visible card. The visible card is wider and starts halfway down
  the plate area, so the plate appears to sit on top of it.

  Usage:
    <MenuCard title="Build Your Plate" description="Pick a main and a side" />
-->
<script lang="ts">
  import MenuPie from './MenuPie.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    description?: string;
    children?: Snippet;
  }

  let { title = 'Build Your Plate', description = '', children }: Props = $props();
</script>

<div class="menu-card-outer">
  <!-- Plate floats above everything -->
  <div class="plate-layer">
    <MenuPie showControls={false} />
  </div>

  <!-- Visible card starts halfway under the plate -->
  <div class="visible-card">
    <div class="card-body">
      <h3 class="card-title">{title}</h3>
      {#if description}
        <p class="card-description">{description}</p>
      {/if}
      {#if children}{@render children()}{/if}
    </div>
  </div>
</div>

<style>
  .menu-card-outer {
    position: relative;
    max-width: 420px;
    /* plate height + the portion of the card that sticks out below */
  }

  .plate-layer {
    position: relative;
    z-index: 2;
    width: 80%;
    height: 260px;
    margin: 0 auto;
    pointer-events: none;
  }

  .visible-card {
    position: relative;
    z-index: 1;
    margin-top: -130px;
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    box-shadow: 0 4px 24px 0 rgb(0 0 0 / 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
    padding-top: 140px;
  }

  .card-body {
    padding: 0 2rem 2rem;
  }

  .card-title {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: #f0eef5;
  }

  .card-description {
    margin: 0;
    color: rgba(200, 195, 220, 0.7);
    line-height: 1.6;
  }
</style>
