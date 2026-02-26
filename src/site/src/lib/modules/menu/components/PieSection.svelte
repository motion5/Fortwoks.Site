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

    // ─── Active highlight: brighter base color ─────────────────
    // Instead of emissive glow (which washes out), tween the material
    // color to a brighter version when active.
    const baseFloorColor = new THREE.Color(floorColor);
    const brightFloorColor = baseFloorColor.clone();
    brightFloorColor.offsetHSL(0, 0.1, 0.2); // slightly more saturated + lighter

    const baseRimColor = new THREE.Color(rimColor);
    const brightRimColor = baseRimColor.clone();
    brightRimColor.offsetHSL(0, 0.1, 0.2);

    // Subtle emissive for a hint of self-illumination (not the main effect)
    const emissiveColor = new THREE.Color(floorColor).multiplyScalar(0.3);
    const rimEmissiveColor = new THREE.Color(rimColor).multiplyScalar(0.3);

    // Refs to materials for GSAP tweening
    let floorMat: THREE.MeshPhysicalMaterial | undefined;
    let rimMat: THREE.MeshPhysicalMaterial | undefined;
    let startEdgeMat: THREE.MeshPhysicalMaterial | undefined;
    let endEdgeMat: THREE.MeshPhysicalMaterial | undefined;

    let currentTween: gsap.core.Tween | undefined;

    $effect(() => {
        const t = active ? 1 : 0;
        currentTween?.kill();
        const obj = { value: floorMat ? (floorMat.userData._t ?? 0) : 0 };
        currentTween = gsap.to(obj, {
            value: t,
            duration: 0.4,
            ease: 'power2.out',
            onUpdate: () => {
                const v = obj.value;
                for (const mat of [floorMat, startEdgeMat, endEdgeMat]) {
                    if (!mat) continue;
                    mat.color.copy(baseFloorColor).lerp(brightFloorColor, v);
                    mat.emissiveIntensity = 0.02 + v * 0.05;
                    mat.userData._t = v;
                }
                if (rimMat) {
                    rimMat.color.copy(baseRimColor).lerp(brightRimColor, v);
                    rimMat.emissiveIntensity = 0.02 + v * 0.05;
                }
            }
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
    <T.MeshPhysicalMaterial
        bind:ref={floorMat}
        color={floorColor}
        roughness={0.04}
        metalness={0.15}
        emissive={emissiveColor}
        emissiveIntensity={0.02}
        envMapIntensity={1.5}
        clearcoat={1.0}
        clearcoatRoughness={0.05}
        reflectivity={0.8}
    />
</T.Mesh>

<!-- Outer rim -->
<T.Mesh
    geometry={rimGeo}
    rotation.x={-Math.PI / 2}
    position.x={layout.offsetX}
    position.z={layout.offsetZ}
>
    <T.MeshPhysicalMaterial
        bind:ref={rimMat}
        color={rimColor}
        roughness={0.03}
        metalness={0.2}
        emissive={rimEmissiveColor}
        emissiveIntensity={0.02}
        envMapIntensity={1.8}
        clearcoat={1.0}
        clearcoatRoughness={0.03}
        reflectivity={0.9}
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
    <T.MeshPhysicalMaterial
        bind:ref={startEdgeMat}
        color={floorColor}
        roughness={0.04}
        metalness={0.15}
        emissive={emissiveColor}
        emissiveIntensity={0.02}
        envMapIntensity={1.5}
        clearcoat={1.0}
        clearcoatRoughness={0.05}
        reflectivity={0.8}
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
    <T.MeshPhysicalMaterial
        bind:ref={endEdgeMat}
        color={floorColor}
        roughness={0.04}
        metalness={0.15}
        emissive={emissiveColor}
        emissiveIntensity={0.02}
        envMapIntensity={1.5}
        clearcoat={1.0}
        clearcoatRoughness={0.05}
        reflectivity={0.8}
    />
</T.Mesh>
