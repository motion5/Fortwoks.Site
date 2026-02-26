<!--
  PieSection.svelte — A single pie section: floor + outer rim + straight edge walls.

  Props:
    startDeg / endDeg — angular range (full arc, no gap)
    floorColor / rimColor — hex strings
    active — highlights with emissive glow
    glowColor — hex for the emissive highlight

  The section is offset linearly from centre (not angularly) based on its mid-angle.
-->
<script lang="ts">
  import { T } from '@threlte/core';
  import * as THREE from 'three';
  import { plateConfig as C } from '../utils/plate-config';
  import { createPieShape, computeSectionLayout, computeEdgeWall } from '../utils/pie-renderer';
  import type { SectionLayout } from '../utils/pie-renderer';

  export let startDeg: number;
  export let endDeg: number;
  export let floorColor: string;
  export let rimColor: string;
  export let name = '';

  // Compute layout
  const layout: SectionLayout = computeSectionLayout(startDeg, endDeg, C.sections);

  // Create geometries (these are stable — no need to recreate)
  const floorShape = createPieShape(C.sections.outerR, startDeg, endDeg, C.sections.innerR);
  const floorGeo = new THREE.ExtrudeGeometry(floorShape, {
    depth: C.sections.baseHeight,
    bevelEnabled: false,
  });

  const rimShape = createPieShape(
    C.sections.outerR,
    startDeg,
    endDeg,
    C.sections.outerR - C.sections.rimThick,
  );
  const rimGeo = new THREE.ExtrudeGeometry(rimShape, {
    depth: C.sections.rimHeight,
    bevelEnabled: false,
  });

  // Edge walls at both boundary angles
  const startEdge = computeEdgeWall({
    angleDeg: startDeg,
    color: rimColor,
    midAngle: layout.midAngle,
    separation: C.sections.separation,
    outerR: C.sections.outerR,
    innerR: C.sections.innerR,
    rimHeight: C.sections.rimHeight,
  });

  const endEdge = computeEdgeWall({
    angleDeg: endDeg,
    color: rimColor,
    midAngle: layout.midAngle,
    separation: C.sections.separation,
    outerR: C.sections.outerR,
    innerR: C.sections.innerR,
    rimHeight: C.sections.rimHeight,
  });

</script>

<!-- Floor -->
<T.Mesh
  geometry={floorGeo}
  rotation.x={-Math.PI / 2}
  position.x={layout.offsetX}
  position.z={layout.offsetZ}
  {name}
>
  <T.MeshStandardMaterial
    color={floorColor}
    roughness={0.4}
    metalness={0.05}
  />
</T.Mesh>

<!-- Outer rim -->
<T.Mesh
  geometry={rimGeo}
  rotation.x={-Math.PI / 2}
  position.x={layout.offsetX}
  position.z={layout.offsetZ}
>
  <T.MeshStandardMaterial
    color={rimColor}
    roughness={0.15}
    metalness={0.2}
  />
</T.Mesh>

<!-- Start edge wall -->
<T.Mesh
  position.x={startEdge.position[0]}
  position.y={startEdge.position[1]}
  position.z={startEdge.position[2]}
  rotation.y={startEdge.rotationY}
>
  <T.BoxGeometry args={[startEdge.length, C.sections.rimHeight, 0.03]} />
  <T.MeshStandardMaterial color={rimColor} roughness={0.15} metalness={0.2} />
</T.Mesh>

<!-- End edge wall -->
<T.Mesh
  position.x={endEdge.position[0]}
  position.y={endEdge.position[1]}
  position.z={endEdge.position[2]}
  rotation.y={endEdge.rotationY}
>
  <T.BoxGeometry args={[endEdge.length, C.sections.rimHeight, 0.03]} />
  <T.MeshStandardMaterial color={rimColor} roughness={0.15} metalness={0.2} />
</T.Mesh>
