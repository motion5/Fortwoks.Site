<!--
  PlateScene.svelte — The 3D scene contents. Must be a child of <Canvas>.

  This component has access to Threlte context (useThrelte, useTask)
  and contains all 3D objects, the animation loop, lighting, and
  clipping plane synchronisation.
-->
<script lang="ts">
  import { T, useTask, useThrelte } from '@threlte/core';
  import * as THREE from 'three';
  import PlateBase from './PlateBase.svelte';
  import PieSection from './PieSection.svelte';
  import PlaceholderFood from './PlaceholderFood.svelte';
  import { plateConfig as C } from '../utils/plate-config';
  import {
    computeSectionLayout,
    createSectionClipPlanes,
    updateClipPlanes,
  } from '../utils/pie-renderer';
  import { menuState, rotationState } from '../stores/menu.svelte';

  // ─── Renderer config ─────────────────────────────────────
  const { renderer, toneMapping, scene } = useThrelte();
  toneMapping.set(THREE.ACESFilmicToneMapping);
  renderer.toneMappingExposure = 1.3;
  renderer.localClippingEnabled = true;

  // ─── Environment map (gradient) ──────────────────────────
  const envCanvas = document.createElement('canvas');
  envCanvas.width = envCanvas.height = 256;
  const ectx = envCanvas.getContext('2d')!;
  const grad = ectx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#667eea');
  grad.addColorStop(0.4, '#c471f5');
  grad.addColorStop(0.7, '#fa71cd');
  grad.addColorStop(1, '#1a0a2e');
  ectx.fillStyle = grad;
  ectx.fillRect(0, 0, 256, 256);
  const envTexture = new THREE.CanvasTexture(envCanvas);
  envTexture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = envTexture;

  // ─── Section layout ──────────────────────────────────────
  const mS = 0;
  const mE = C.sections.mainDegrees;
  const sS = C.sections.mainDegrees;
  const sE = 360;

  const mainLayout = computeSectionLayout(mS, mE, C.sections);
  const sideLayout = computeSectionLayout(sS, sE, C.sections);

  // ─── Clipping planes ────────────────────────────────────
  const mainClipData = createSectionClipPlanes(mS, mE);
  const sideClipData = createSectionClipPlanes(sS, sE);
  const allClipData = [mainClipData, sideClipData];

  // ─── Animated state ──────────────────────────────────────
  let plateRotY = 0;
  let secRotY = 0;
  let secFloatY = C.plate.floatHeight + C.plate.thickness / 2;
  let plateFloatY = 0;

  // Groups need refs for rotation
  let plateGroup: THREE.Group;
  let sectionsGroup: THREE.Group;

  // ─── Animation loop ──────────────────────────────────────
  useTask((delta) => {
    const t = performance.now() / 1000;

    // Auto-rotate
    if (rotationState.autoRotate) {
      rotationState.rotation += 0.003;
    }

    // Smooth rotation
    const target = rotationState.rotation;
    plateRotY += (target - plateRotY) * 0.08;
    secRotY += (target - secRotY) * 0.08;

    // Apply to groups
    if (plateGroup) plateGroup.rotation.y = plateRotY;
    if (sectionsGroup) sectionsGroup.rotation.y = secRotY;

    // Float
    const hv = Math.sin(t * 1.2) * 0.04;
    secFloatY = C.plate.floatHeight + C.plate.thickness / 2 + hv;
    plateFloatY = hv * 0.35;

    if (sectionsGroup) sectionsGroup.position.y = secFloatY;

    // Sync clipping planes with rotation
    updateClipPlanes(allClipData, secRotY);
  });

</script>

<!-- Camera -->
<!-- @ts-ignore makeDefault is a Threlte shorthand prop -->
<T.PerspectiveCamera
  makeDefault={true}
  fov={C.camera.fov}
  position={C.camera.position}
  oncreate={(ref) => ref.lookAt(...C.camera.lookAt)}
/>

<!-- Lighting -->
<T.AmbientLight intensity={0.5} />
<T.DirectionalLight intensity={0.9} position={[5, 8, 4]} />
<T.DirectionalLight color="#c471f5" intensity={0.25} position={[-4, 3, -2]} />
<T.DirectionalLight color="#00d2d3" intensity={0.35} position={[0, 2, -5]} />
<T.PointLight color="#fa71cd" intensity={0.2} distance={8} position={[0, -1.5, 0]} />

<!-- Base plate -->
<T.Group bind:ref={plateGroup}>
  <PlateBase floatY={plateFloatY} />
</T.Group>

<!-- Floating sections -->
<T.Group bind:ref={sectionsGroup} position.y={secFloatY}>
  <!-- Main section -->
  <PieSection
    startDeg={mS}
    endDeg={mE}
    floorColor={C.colors.mainFloor}
    rimColor={C.colors.mainRim}
    name="mainSection"
  />

  <!-- Main food anchor -->
  <T.Group
    position.x={mainLayout.centerX}
    position.y={C.sections.baseHeight + 0.05}
    position.z={mainLayout.centerZ}
  >
    <PlaceholderFood type="main" clipPlanes={mainClipData.planes} />
  </T.Group>

  <!-- Side section -->
  <PieSection
    startDeg={sS}
    endDeg={sE}
    floorColor={C.colors.sideFloor}
    rimColor={C.colors.sideRim}
    name="sideSection"
  />

  <!-- Side food anchor -->
  <T.Group
    position.x={sideLayout.centerX}
    position.y={C.sections.baseHeight + 0.05}
    position.z={sideLayout.centerZ}
  >
    <PlaceholderFood type="side" clipPlanes={sideClipData.planes} />
  </T.Group>
</T.Group>
