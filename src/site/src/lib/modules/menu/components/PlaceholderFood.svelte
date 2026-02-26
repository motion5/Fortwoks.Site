<!--
  PlaceholderFood.svelte — Procedural stand-in food for prototyping.

  Renders either a "stir-fry mound with chunks" (main) or
  "dumplings with sauce" (side) based on the `type` prop.

  When you have real GLB models, replace this component with:
    <GLTF url={modelUrl} />
  at the same anchor point.

  Clipping planes are applied via material props so food stays
  inside its section boundary.
-->
<script lang="ts">
  import { T } from '@threlte/core';
  import type { Plane } from 'three';

  export let type: 'main' | 'side';
  export let clipPlanes: Plane[] = [];

  // Deterministic "random" — seeded positions so they don't change on re-render
  const chunkColors = ['#c0392b', '#27ae60', '#f39c12', '#e74c3c', '#2ecc71'];

  // Pre-compute chunk positions (stable across renders)
  const chunks = Array.from({ length: 18 }, (_, i) => {
    const seed = i * 137.508; // golden angle spread
    const a = (seed % 360) * (Math.PI / 180);
    const r = ((i * 7 + 3) % 55) / 100;
    return {
      x: Math.cos(a) * r,
      y: 0.18 + ((i * 13) % 20) / 100,
      z: Math.sin(a) * r,
      rx: (i * 0.7) % 3,
      ry: (i * 1.3) % 3,
      rz: (i * 0.9) % 3,
      w: 0.1 + ((i * 11) % 10) / 100,
      d: 0.1 + ((i * 7) % 8) / 100,
      color: chunkColors[i % chunkColors.length],
    };
  });

  const dumplingPositions: [number, number, number][] = [
    [0, 0.12, 0], [-0.3, 0.12, 0.2], [0.28, 0.12, 0.25],
    [0, 0.12, -0.28], [0.22, 0.12, -0.08], [-0.25, 0.12, -0.18],
    [0.05, 0.26, 0.05], [-0.1, 0.26, -0.1],
  ];

  const sauceDots = Array.from({ length: 7 }, (_, i) => ({
    x: -0.2 + i * 0.07,
    z: 0.1 + Math.sin(i) * 0.06,
  }));
</script>

{#if type === 'main'}
  <T.Group>
    <!-- Stir-fry mound -->
    <T.Mesh scale.y={0.55}>
      <T.SphereGeometry args={[1.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <T.MeshStandardMaterial
        color="#b5651d"
        roughness={0.6}
        clippingPlanes={clipPlanes}
        clipShadows
      />
    </T.Mesh>

    <!-- Chunks on top -->
    {#each chunks as c, i (i)}
      <T.Mesh
        position.x={c.x} position.y={c.y} position.z={c.z}
        rotation.x={c.rx} rotation.y={c.ry} rotation.z={c.rz}
      >
        <T.BoxGeometry args={[c.w * 1.3, 0.09, c.d * 1.3]} />
        <T.MeshStandardMaterial
          color={c.color}
          roughness={0.5}
          clippingPlanes={clipPlanes}
          clipShadows
        />
      </T.Mesh>
    {/each}
  </T.Group>
{:else}
  <T.Group>
    <!-- Dumplings -->
    {#each dumplingPositions as [x, y, z], i (i)}
      <T.Mesh position.x={x} position.y={y} position.z={z} scale.y={0.55}>
        <T.SphereGeometry args={[0.35, 16, 12]} />
        <T.MeshStandardMaterial
          color="#f5e6ca"
          roughness={0.35}
          clippingPlanes={clipPlanes}
          clipShadows
        />
      </T.Mesh>
    {/each}

    <!-- Sauce drizzle -->
    {#each sauceDots as dot, i (i)}
      <T.Mesh position.x={dot.x} position.y={0.04} position.z={dot.z}>
        <T.SphereGeometry args={[0.06, 8, 8]} />
        <T.MeshStandardMaterial
          color="#8B4513"
          roughness={0.3}
          clippingPlanes={clipPlanes}
          clipShadows
        />
      </T.Mesh>
    {/each}
  </T.Group>
{/if}
