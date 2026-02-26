<!--
  PlateBase.svelte — The physical plate underneath the floating sections.
  Cylinder body + gold rim torus + blue decorative ring.
-->
<script lang="ts">
  import { T } from '@threlte/core';
  import { plateConfig as C } from '../utils/plate-config';

  interface Props {
    floatY?: number;
  }

  let { floatY = 0 }: Props = $props();
</script>

<T.Group position.y={floatY}>
  <!-- Main plate body -->
  <T.Mesh>
    <T.CylinderGeometry args={[C.plate.radius, C.plate.radius * 1.01, C.plate.thickness, 64]} />
    <T.MeshPhysicalMaterial
      color={C.colors.plateBase}
      metalness={0.1}
      roughness={0.08}
      clearcoat={1.0}
      clearcoatRoughness={0.05}
      reflectivity={0.8}
    />
  </T.Mesh>

  <!-- Gold rim -->
  <T.Mesh rotation.x={Math.PI / 2} position.y={C.plate.thickness / 2}>
    <T.TorusGeometry args={[C.plate.radius - 0.02, 0.025, 12, 64]} />
    <T.MeshPhysicalMaterial
      color={C.colors.plateGold}
      metalness={0.8}
      roughness={0.1}
      clearcoat={1.0}
      clearcoatRoughness={0.05}
      reflectivity={0.8}
    />
  </T.Mesh>

  <!-- Blue decorative ring -->
  <T.Mesh rotation.x={Math.PI / 2} position.y={C.plate.thickness / 2 + 0.004}>
    <T.TorusGeometry args={[C.plate.radius * 0.7, 0.012, 8, 64]} />
    <T.MeshPhysicalMaterial
      color={C.colors.plateBlue}
      metalness={0.1}
      roughness={0.3}
      clearcoat={1.0}
      clearcoatRoughness={0.05}
      reflectivity={0.8}
    />
  </T.Mesh>
</T.Group>
