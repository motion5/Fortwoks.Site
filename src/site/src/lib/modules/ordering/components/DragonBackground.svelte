<!--
  DragonBackground.svelte
  Renders a tiled dragon watermark across the viewport at low opacity
  for the light theme. Uses the hand-drawn red line-art PNG.
-->
<script lang="ts">
    import dragonBg from '$lib/assets/dragon-bg.png';
</script>

<div class="dragon-bg" style:background-image="url({dragonBg})" aria-hidden="true" />

<style>
    .dragon-bg {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        background-repeat: repeat;
        background-size: 420px;
        opacity: 0.06;
    }
</style>
