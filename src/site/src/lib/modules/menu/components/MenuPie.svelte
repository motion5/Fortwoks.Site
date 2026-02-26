<!--
  MenuPie.svelte — The public-facing plate configurator component.

  This is the component you import and use in your routes/modals.
  It wraps <Canvas> and layers HTML controls on top.

  Usage:
    <script>
      import { MenuPie } from '$lib/modules/menu';
    </script>

    <div style="width: 100%; height: 500px;">
      <MenuPie />
    </div>

  The component fills its container — give the parent explicit dimensions.
-->
<script lang="ts">
  import { Canvas } from '@threlte/core';
  import PlateScene from './PlateScene.svelte';
  import { menuState, rotationState } from '../stores/menu.svelte';
  import type { SectionId } from '../types';

  export let selectedSection: SectionId = 'main';
  export let showControls = true;

  $: menuState.selectedSection = selectedSection;

  function selectSection(s: SectionId) {
    menuState.selectedSection = s;
    selectedSection = s;
  }
</script>

<div class="menu-pie-wrapper">
  <Canvas>
    <PlateScene />
  </Canvas>

  {#if showControls}
    <!-- Section selector buttons -->
    <div class="section-buttons">
      <button
        class="section-btn"
        class:active={menuState.selectedSection === 'main'}
        on:click={() => selectSection('main')}
      >
        Main Dish
      </button>
      <button
        class="section-btn"
        class:active={menuState.selectedSection === 'side'}
        on:click={() => selectSection('side')}
      >
        Side
      </button>
      <button
        class="section-btn"
        on:click={() => selectSection('none')}
      >
        Reset
      </button>
    </div>

    <!-- Rotation controls -->
    <div class="rotation-controls">
      <button class="rot-btn" on:click={() => rotationState.nudge(-0.3)}>◀</button>
      <input
        type="range"
        min="0"
        max="360"
        step="1"
        value={((rotationState.rotation * 180) / Math.PI) % 360}
        on:input={(e) => {
          rotationState.rotation = (parseFloat(e.currentTarget.value) * Math.PI) / 180;
        }}
      />
      <button class="rot-btn" on:click={() => rotationState.nudge(0.3)}>▶</button>
      <button
        class="rot-btn"
        class:active={rotationState.autoRotate}
        on:click={() => (rotationState.autoRotate = !rotationState.autoRotate)}
      >
        ⟳
      </button>
    </div>
  {/if}
</div>

<style>
  .menu-pie-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .section-buttons {
    position: absolute;
    bottom: 5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.75rem;
    z-index: 10;
  }

  .section-btn {
    padding: 0.5rem 1.25rem;
    border: 1px solid #d1d5db;
    border-radius: 50px;
    background: white;
    color: #374151;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  .section-btn:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  .section-btn.active {
    border-color: #e84393;
    background: rgba(232, 67, 147, 0.08);
    color: #e84393;
  }

  .rotation-controls {
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    align-items: center;
    z-index: 10;
  }

  .rot-btn {
    background: white;
    border: 1px solid #d1d5db;
    color: #374151;
    padding: 0.4rem 0.6rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background 0.2s;
  }

  .rot-btn:hover {
    background: #f3f4f6;
  }

  .rot-btn.active {
    background: rgba(232, 67, 147, 0.08);
    border-color: #e84393;
    color: #e84393;
  }

  input[type='range'] {
    width: 10rem;
    accent-color: #e84393;
  }
</style>
