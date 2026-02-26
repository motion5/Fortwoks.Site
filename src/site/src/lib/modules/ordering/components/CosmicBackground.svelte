<!--
  CosmicBackground.svelte
  Fixed-position starfield with twinkling animations and nebula-like
  radial gradient glows. Only renders when dark theme is active.

  Performance: Stars are generated once on mount. Animation is pure CSS
  with staggered delays — no JS animation loop.
-->
<script lang="ts">
	interface Star {
		x: number;
		y: number;
		size: number;
		opacity: number;
		delay: number;
		duration: number;
	}

	const STAR_COUNT = 180;

	// Generate stars deterministically on creation
	const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: Math.random() * 2.5 + 0.5,
		opacity: Math.random() * 0.7 + 0.1,
		delay: Math.random() * 4,
		duration: Math.random() * 3 + 2
	}));
</script>

<div class="cosmic" aria-hidden="true">
	{#each stars as star}
		<div
			class="star"
			style:left="{star.x}%"
			style:top="{star.y}%"
			style:width="{star.size}px"
			style:height="{star.size}px"
			style:opacity={star.opacity}
			style:animation-delay="{star.delay}s"
			style:animation-duration="{star.duration}s"
		/>
	{/each}

	<!-- Nebula glows -->
	<div class="nebula nebula-red" />
	<div class="nebula nebula-amber" />
	<div class="nebula nebula-purple" />
</div>

<style>
	.cosmic {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		overflow: hidden;
	}

	.star {
		position: absolute;
		border-radius: 50%;
		background: #fff;
		animation: twinkle ease-in-out infinite alternate;
		will-change: opacity;
	}

	.nebula {
		position: absolute;
		border-radius: 50%;
		filter: blur(60px);
	}

	.nebula-red {
		top: 5%;
		right: 10%;
		width: 400px;
		height: 400px;
		background: radial-gradient(circle, rgba(196, 30, 58, 0.08) 0%, transparent 70%);
	}

	.nebula-amber {
		bottom: 15%;
		left: 5%;
		width: 350px;
		height: 350px;
		background: radial-gradient(circle, rgba(255, 179, 71, 0.06) 0%, transparent 70%);
		filter: blur(50px);
	}

	.nebula-purple {
		top: 40%;
		left: 50%;
		transform: translateX(-50%);
		width: 500px;
		height: 300px;
		background: radial-gradient(circle, rgba(120, 80, 200, 0.04) 0%, transparent 70%);
		filter: blur(80px);
	}

	@keyframes twinkle {
		0% {
			opacity: 0.15;
			transform: scale(1);
		}
		50% {
			opacity: 0.8;
			transform: scale(1.3);
		}
		100% {
			opacity: 0.15;
			transform: scale(1);
		}
	}
</style>
