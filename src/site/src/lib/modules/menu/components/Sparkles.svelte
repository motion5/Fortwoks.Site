<!--
  Sparkles.svelte — Floating octahedron particles around the plate.
  Animated in the parent's useTask loop via the `time` prop.
-->
<script lang="ts">
    import { T, useTask } from '@threlte/core';
    import * as THREE from 'three';

    const count = 14;

    // Pre-compute stable particle data
    const particles = Array.from({ length: count }, (_, i) => {
        const a = ((i * 137.508) % 360) * (Math.PI / 180);
        const r = 1 + ((i * 31) % 140) / 100;
        const baseY = 0.2 + ((i * 17) % 100) / 100;

        return {
            x: Math.cos(a) * r,
            baseY,
            z: Math.sin(a) * r,
            speed: 0.5 + ((i * 23) % 150) / 100,
            phase: ((i * 41) % 628) / 100,
            rotSpeed: 1 + ((i * 19) % 300) / 100,
            baseScale: 0.4 + ((i * 13) % 50) / 100,
            // Mutable state for animation
            y: baseY,
            scale: 1,
            opacity: 0.5,
            rotY: 0
        };
    });

    // Animate
    useTask((delta) => {
        const t = performance.now() / 1000;
        for (const p of particles) {
            const wave = 0.5 + 0.5 * Math.sin(t * p.speed * 2 + p.phase);
            p.y = p.baseY + Math.sin(t * p.speed + p.phase) * 0.1;
            p.rotY = t * p.rotSpeed;
            p.scale = p.baseScale * (0.6 + wave * 0.4);
            p.opacity = 0.2 + wave * 0.5;
        }
    });
</script>

{#each particles as p, i (i)}
    <T.Mesh
        position.x={p.x}
        position.y={p.y}
        position.z={p.z}
        rotation.y={p.rotY}
        scale.x={p.scale}
        scale.y={p.scale}
        scale.z={p.scale}
    >
        <T.OctahedronGeometry args={[0.025, 0]} />
        <T.MeshBasicMaterial color={0xffffff} transparent opacity={p.opacity} />
    </T.Mesh>
{/each}
