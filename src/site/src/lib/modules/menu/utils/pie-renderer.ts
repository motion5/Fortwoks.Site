/**
 * Plate geometry utilities — pure Three.js, no Svelte dependency.
 *
 * These functions create the shapes, geometries, and clipping planes
 * used by the Threlte components. Keeping them here means:
 *   - They're testable without a DOM
 *   - The Svelte components stay declarative
 *   - Geometry logic is in one place if you need to extend to 5-section plates
 */

import * as THREE from 'three';
import type { PlateConfig } from './plate-config';

// ─── Pie Slice Shape ───────────────────────────────────────────────

/**
 * Creates a 2D pie-slice Shape for use with ExtrudeGeometry.
 * The shape lies in the XY plane; rotate -90° around X to lay flat.
 */
export function createPieShape(
    outerR: number,
    startDeg: number,
    endDeg: number,
    innerR = 0,
    segments = 64
): THREE.Shape {
    const shape = new THREE.Shape();
    const s = THREE.MathUtils.degToRad(startDeg);
    const e = THREE.MathUtils.degToRad(endDeg);
    const delta = e - s;
    const safeInner = Math.max(innerR, 0.001);

    // Start at inner radius
    shape.moveTo(Math.cos(s) * safeInner, Math.sin(s) * safeInner);

    // Line to outer radius at start angle
    shape.lineTo(Math.cos(s) * outerR, Math.sin(s) * outerR);

    // Arc along outer edge
    for (let i = 1; i <= segments; i++) {
        const a = s + (delta * i) / segments;
        shape.lineTo(Math.cos(a) * outerR, Math.sin(a) * outerR);
    }

    // Line back to inner radius at end angle
    shape.lineTo(Math.cos(e) * safeInner, Math.sin(e) * safeInner);

    // Arc back along inner edge (if there's a hole)
    if (innerR > 0.01) {
        for (let i = segments - 1; i >= 0; i--) {
            const a = s + (delta * i) / segments;
            shape.lineTo(Math.cos(a) * innerR, Math.sin(a) * innerR);
        }
    }

    return shape;
}

// ─── Section Layout ────────────────────────────────────────────────

export interface SectionLayout {
    startDeg: number;
    endDeg: number;
    midAngle: number; // radians — centre of the arc
    offsetX: number; // linear separation offset
    offsetZ: number;
    centerX: number; // food anchor position
    centerZ: number;
}

/**
 * Computes the layout for a pie section — its angular range,
 * linear offset direction, and food anchor position.
 */
export function computeSectionLayout(
    startDeg: number,
    endDeg: number,
    config: PlateConfig['sections']
): SectionLayout {
    const midAngle = THREE.MathUtils.degToRad((startDeg + endDeg) / 2);
    const sep = config.separation;
    const offsetX = Math.cos(midAngle) * sep;
    const offsetZ = -Math.sin(midAngle) * sep;

    // Food anchor at 50% radius along the mid-angle
    const centerX = Math.cos(midAngle) * config.outerR * 0.5 + offsetX;
    const centerZ = -Math.sin(midAngle) * config.outerR * 0.5 + offsetZ;

    return { startDeg, endDeg, midAngle, offsetX, offsetZ, centerX, centerZ };
}

// ─── Edge Wall ─────────────────────────────────────────────────────

export interface EdgeWallParams {
    angleDeg: number;
    color: string;
    midAngle: number; // section mid-angle for offset
    separation: number;
    outerR: number;
    innerR: number;
    rimHeight: number;
}

/**
 * Returns position and rotation for a straight edge wall at a given angle.
 * The component creates the BoxGeometry mesh; this just computes placement.
 */
export function computeEdgeWall(params: EdgeWallParams) {
    const rad = THREE.MathUtils.degToRad(params.angleDeg);
    const safeInner = Math.max(params.innerR, 0.01);
    const len = params.outerR - safeInner;
    const midR = (safeInner + params.outerR) / 2;

    return {
        length: len,
        position: [
            Math.cos(rad) * midR + Math.cos(params.midAngle) * params.separation,
            params.rimHeight / 2,
            -Math.sin(rad) * midR - Math.sin(params.midAngle) * params.separation
        ] as [number, number, number],
        rotationY: rad
    };
}

// ─── Clipping Planes ───────────────────────────────────────────────

export interface ClipPlaneSet {
    planes: [THREE.Plane, THREE.Plane];
    baseNormals: [THREE.Vector3, THREE.Vector3];
}

/**
 * Creates a pair of clipping planes that bound a pie section.
 * The planes are defined in local space — call `updateClipPlanes`
 * each frame to rotate them with the scene.
 */
export function createSectionClipPlanes(startDeg: number, endDeg: number): ClipPlaneSet {
    const sR = THREE.MathUtils.degToRad(startDeg);
    const eR = THREE.MathUtils.degToRad(endDeg);

    const n1 = new THREE.Vector3(-Math.sin(sR), 0, -Math.cos(sR));
    const n2 = new THREE.Vector3(Math.sin(eR), 0, Math.cos(eR));

    return {
        planes: [new THREE.Plane(n1.clone(), 0), new THREE.Plane(n2.clone(), 0)],
        baseNormals: [n1, n2]
    };
}

// Reusable temporaries (avoids GC pressure in the render loop)
const _tempNormal = new THREE.Vector3();
const _rotMatrix = new THREE.Matrix4();

/**
 * Rotates clipping plane normals to match the current scene rotation.
 * Call this in your useTask/useFrame callback.
 */
export function updateClipPlanes(clipSets: ClipPlaneSet[], rotationY: number): void {
    _rotMatrix.makeRotationY(rotationY);
    for (const set of clipSets) {
        for (let i = 0; i < 2; i++) {
            _tempNormal.copy(set.baseNormals[i]).applyMatrix4(_rotMatrix);
            set.planes[i].normal.copy(_tempNormal);
        }
    }
}

/**
 * Applies clipping planes to every mesh material in a group.
 * Works with GLB models — clones materials to avoid shared-material issues.
 */
export function applyClipping(group: THREE.Object3D, planes: THREE.Plane[]): void {
    group.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = (mesh.material as THREE.Material).clone();
            (mesh.material as THREE.Material).clippingPlanes = planes;
            (mesh.material as THREE.Material).clipShadows = true;
        }
    });
}
