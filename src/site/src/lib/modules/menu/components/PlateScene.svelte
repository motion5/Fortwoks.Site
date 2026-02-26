<!--
  PlateScene.svelte — The 3D scene contents. Must be a child of <Canvas>.

  This component has access to Threlte context (useThrelte, useTask)
  and contains all 3D objects, the animation loop, lighting, and
  clipping plane synchronisation.

  Accepts a `sections` prop to render N pie sections dynamically.
  Accepts `activeSection` to highlight and raise a specific section.
-->
<script lang="ts">
    import { T, useTask, useThrelte } from '@threlte/core';
    import * as THREE from 'three';
    import gsap from 'gsap';
    import PlateBase from './PlateBase.svelte';
    import PieSection from './PieSection.svelte';
    import { plateConfig as C, DEFAULT_SECTIONS, type SectionDef } from '../utils/plate-config';
    import {
        computeSectionLayout,
        createSectionClipPlanes,
        updateClipPlanes,
        type ClipPlaneSet
    } from '../utils/pie-renderer';
    import { rotationState } from '../stores/menu.svelte';

    interface Props {
        sections?: SectionDef[];
        /** When set, overrides the global rotationState for this instance */
        targetRotation?: number | undefined;
        /** Index of the active/highlighted section (-1 or undefined = none) */
        activeSection?: number;
    }

    let {
        sections = DEFAULT_SECTIONS,
        targetRotation = undefined,
        activeSection = -1
    }: Props = $props();

    // ─── Renderer config ─────────────────────────────────────
    const { renderer, toneMapping, scene } = useThrelte();
    toneMapping.set(THREE.ACESFilmicToneMapping);
    renderer.toneMappingExposure = 1.0;
    renderer.localClippingEnabled = true;

    // ─── Environment map (subtle gradient for reflections) ──────
    const envCanvas = document.createElement('canvas');
    envCanvas.width = envCanvas.height = 256;
    const ectx = envCanvas.getContext('2d')!;
    const grad = ectx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#556aa0');
    grad.addColorStop(0.4, '#8a5a9a');
    grad.addColorStop(0.7, '#9a5a7a');
    grad.addColorStop(1, '#1a0a2e');
    ectx.fillStyle = grad;
    ectx.fillRect(0, 0, 256, 256);
    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTexture;

    // ─── Section layout (derived from props) ───────────────
    const sectionData = $derived(
        sections.map((sec) => {
            const layout = computeSectionLayout(sec.startDeg, sec.endDeg, C.sections);
            const clipData = createSectionClipPlanes(sec.startDeg, sec.endDeg);
            return { def: sec, layout, clipData };
        })
    );

    const allClipData: ClipPlaneSet[] = $derived(sectionData.map((s) => s.clipData));

    // ─── Animated state ──────────────────────────────────────
    let plateRotY = 0;
    let secRotY = 0;
    let secFloatY = C.plate.floatHeight + C.plate.thickness / 2;
    let plateFloatY = 0;

    // Groups need refs for rotation
    let plateGroup: THREE.Group;
    let sectionsGroup: THREE.Group;

    // ─── Per-section lift animation ───────────────────────────
    const LIFT_HEIGHT = 0.18;
    const sectionGroupRefs: Map<number, THREE.Group> = new Map();
    const sectionLiftTweens: Map<number, gsap.core.Tween> = new Map();

    function registerSectionGroup(index: number, group: THREE.Group) {
        sectionGroupRefs.set(index, group);
    }

    $effect(() => {
        // Tween each section group's Y based on whether it's active
        for (const [index, group] of sectionGroupRefs) {
            const isActive = index === activeSection;
            const targetY = isActive ? LIFT_HEIGHT : 0;

            sectionLiftTweens.get(index)?.kill();
            sectionLiftTweens.set(
                index,
                gsap.to(group.position, {
                    y: targetY,
                    duration: 0.5,
                    ease: 'back.out(1.7)'
                })
            );
        }
    });

    // ─── Animation loop ──────────────────────────────────────
    useTask((delta) => {
        const t = performance.now() / 1000;

        // Determine rotation target: prop override or global state
        let target: number;
        if (targetRotation !== undefined) {
            target = targetRotation;
        } else {
            if (rotationState.autoRotate) {
                rotationState.rotation += 0.003;
            }
            target = rotationState.rotation;
        }

        // Smooth rotation
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
<T.PerspectiveCamera
    {...{ makeDefault: true } as any}
    fov={C.camera.fov}
    position={C.camera.position}
    oncreate={(ref) => ref.lookAt(...C.camera.lookAt)}
/>

<!-- Lighting -->
<T.AmbientLight intensity={0.38} />
<T.DirectionalLight intensity={0.8} position={[5, 8, 4]} />
<T.DirectionalLight color="#c471f5" intensity={0.15} position={[-4, 3, -2]} />
<T.DirectionalLight color="#00d2d3" intensity={0.15} position={[0, 2, -5]} />
<T.PointLight color="#fa71cd" intensity={0.12} distance={8} position={[0, -1.5, 0]} />

<!-- Base plate -->
<T.Group bind:ref={plateGroup}>
    <PlateBase floatY={plateFloatY} />
</T.Group>

<!-- Floating sections -->
<T.Group bind:ref={sectionsGroup} position.y={secFloatY}>
    {#each sectionData as sec, i (i)}
        <!-- Per-section group for lift animation -->
        <T.Group oncreate={(ref) => registerSectionGroup(i, ref)}>
            <PieSection
                startDeg={sec.def.startDeg}
                endDeg={sec.def.endDeg}
                floorColor={sec.def.floorColor}
                rimColor={sec.def.rimColor}
                active={i === activeSection}
                name="section-{i}"
            />
        </T.Group>
    {/each}
</T.Group>
