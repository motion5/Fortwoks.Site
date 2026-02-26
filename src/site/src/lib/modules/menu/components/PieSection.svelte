<!--
  PieSection.svelte — A single pie section: floor + outer rim + straight edge walls.

  Props:
    startDeg / endDeg — angular range (full arc, no gap)
    floorColor / rimColor — hex strings
    active — highlights with emissive glow and brighter colour
    name — optional debug name

  The section is offset linearly from centre (not angularly) based on its mid-angle.
-->
<script lang="ts">
    import { T } from '@threlte/core';
    import * as THREE from 'three';
    import gsap from 'gsap';
    import { plateConfig as C } from '../utils/plate-config';
    import { createPieShape, computeSectionLayout, computeEdgeWall } from '../utils/pie-renderer';
    import type { SectionLayout } from '../utils/pie-renderer';

    interface Props {
        startDeg: number;
        endDeg: number;
        floorColor: string;
        rimColor: string;
        active?: boolean;
        name?: string;
    }

    let { startDeg, endDeg, floorColor, rimColor, active = false, name = '' }: Props = $props();

    // Compute layout
    const layout: SectionLayout = computeSectionLayout(startDeg, endDeg, C.sections);

    // Create geometries (these are stable — no need to recreate)
    const floorShape = createPieShape(C.sections.outerR, startDeg, endDeg, C.sections.innerR);
    const floorGeo = new THREE.ExtrudeGeometry(floorShape, {
        depth: C.sections.baseHeight,
        bevelEnabled: false
    });

    const rimShape = createPieShape(
        C.sections.outerR,
        startDeg,
        endDeg,
        C.sections.outerR - C.sections.rimThick
    );
    const rimGeo = new THREE.ExtrudeGeometry(rimShape, {
        depth: C.sections.rimHeight,
        bevelEnabled: false
    });

    // Edge walls at both boundary angles
    const startEdge = computeEdgeWall({
        angleDeg: startDeg,
        color: rimColor,
        midAngle: layout.midAngle,
        separation: C.sections.separation,
        outerR: C.sections.outerR,
        innerR: C.sections.innerR,
        rimHeight: C.sections.rimHeight
    });

    const endEdge = computeEdgeWall({
        angleDeg: endDeg,
        color: rimColor,
        midAngle: layout.midAngle,
        separation: C.sections.separation,
        outerR: C.sections.outerR,
        innerR: C.sections.innerR,
        rimHeight: C.sections.rimHeight
    });

    // ─── Emissive glow animation ──────────────────────────────
    // Boost emissive colour for active glow — moderate multiplier preserves contour/shadow detail
    const emissiveColor = new THREE.Color(floorColor);
    emissiveColor.r = Math.min(emissiveColor.r * 1.8, 1);
    emissiveColor.g = Math.min(emissiveColor.g * 1.8, 1);
    emissiveColor.b = Math.min(emissiveColor.b * 1.8, 1);
    const rimEmissiveColor = new THREE.Color(rimColor);
    rimEmissiveColor.r = Math.min(rimEmissiveColor.r * 1.8, 1);
    rimEmissiveColor.g = Math.min(rimEmissiveColor.g * 1.8, 1);
    rimEmissiveColor.b = Math.min(rimEmissiveColor.b * 1.8, 1);

    // Refs to materials for GSAP tweening
    let floorMat: THREE.MeshStandardMaterial | undefined;
    let rimMat: THREE.MeshStandardMaterial | undefined;
    let startEdgeMat: THREE.MeshStandardMaterial | undefined;
    let endEdgeMat: THREE.MeshStandardMaterial | undefined;

    function setEmissiveIntensity(intensity: number) {
        for (const mat of [floorMat, rimMat, startEdgeMat, endEdgeMat]) {
            if (mat) mat.emissiveIntensity = intensity;
        }
    }

    let currentTween: gsap.core.Tween | undefined;

    $effect(() => {
        const targetIntensity = active ? 0.7 : 0.15;
        currentTween?.kill();
        const obj = { value: floorMat?.emissiveIntensity ?? 0 };
        currentTween = gsap.to(obj, {
            value: targetIntensity,
            duration: 0.4,
            ease: 'power2.out',
            onUpdate: () => setEmissiveIntensity(obj.value)
        });
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
        bind:ref={floorMat}
        color={floorColor}
        roughness={0.12}
        metalness={0.15}
        emissive={emissiveColor}
        emissiveIntensity={0.15}
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
        bind:ref={rimMat}
        color={rimColor}
        roughness={0.08}
        metalness={0.25}
        emissive={rimEmissiveColor}
        emissiveIntensity={0.15}
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
    <T.MeshStandardMaterial
        bind:ref={startEdgeMat}
        color={rimColor}
        roughness={0.08}
        metalness={0.25}
        emissive={rimEmissiveColor}
        emissiveIntensity={0.15}
    />
</T.Mesh>

<!-- End edge wall -->
<T.Mesh
    position.x={endEdge.position[0]}
    position.y={endEdge.position[1]}
    position.z={endEdge.position[2]}
    rotation.y={endEdge.rotationY}
>
    <T.BoxGeometry args={[endEdge.length, C.sections.rimHeight, 0.03]} />
    <T.MeshStandardMaterial
        bind:ref={endEdgeMat}
        color={rimColor}
        roughness={0.08}
        metalness={0.25}
        emissive={rimEmissiveColor}
        emissiveIntensity={0.15}
    />
</T.Mesh>
