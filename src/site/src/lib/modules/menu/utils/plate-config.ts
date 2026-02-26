/**
 * Plate Configurator — all tuneable values.
 * Adjust these to change plate proportions, colours, and behaviour
 * without touching geometry or component code.
 */

export const plateConfig = {
    plate: {
        radius: 2.0,
        thickness: 0.08,
        floatHeight: 0.2,
    },

    sections: {
        separation: 0.06,
        baseHeight: 0.09,
        rimHeight: 0.26,
        rimThick: 0.065,
        outerR: 1.85,
        innerR: 0.0,
    },

    colors: {
        plateBase: '#e8e0f0',
        plateGold: '#c4a44a',
        plateBlue: '#4a6fa5',
    },

    camera: {
        fov: 40,
        position: [3.0, 1.2, 5] as [number, number, number],
        lookAt: [0, 0.05, 0] as [number, number, number],
    },

    // Plate rotation (in radians) — static tilt applied to outer wrapper group.
    // The animated carousel spin is on a separate inner group so it doesn't
    // clobber these values.
    plateRotation: {
        x: Math.PI * 60 / 180,      // +60 deg — tilt top face toward camera
        y: -Math.PI * 80 / 180,     // -80 deg — anticlockwise turn
        z: Math.PI * 10 / 180,      // +10 deg — slight clockwise roll
    },

    /** Section rotation — auto-rotate plate to center the active section */
    sectionRotation: {
        enabled: true,
    },
} as const;

export type PlateConfig = typeof plateConfig;

/**
 * Compute the Y-rotation (radians) needed to center a given section in front
 * of the camera.  The camera sits at roughly +X/+Z, so we rotate the section's
 * angular midpoint to face that direction.
 *
 * `rotationState.rotation` starts at π/2, which is the "home" position.
 * We offset from there so section 0's midpoint stays centred at the default view.
 */
export function computeSectionTargetRotation(
    sectionIndex: number,
    sections: SectionDef[],
): number {
    if (sectionIndex < 0 || sectionIndex >= sections.length) return 0;

    const sec = sections[sectionIndex];
    const midDeg = (sec.startDeg + sec.endDeg) / 2;
    const midRad = (midDeg * Math.PI) / 180;

    // Section 0 midpoint as the baseline — rotating so each section's
    // midpoint arrives at the same camera-facing angle.
    const sec0 = sections[0];
    const baseMidRad = ((sec0.startDeg + sec0.endDeg) / 2 * Math.PI) / 180;

    // Return the base rotation (π/2) minus the angular offset from section 0
    return Math.PI / 2 - (midRad - baseMidRad);
}

// ─── Section definition ─────────────────────────────────────────

/** Per-section config passed to PlateScene */
export interface SectionDef {
    startDeg: number;
    endDeg: number;
    floorColor: string;
    rimColor: string;
}

/** Palette used by createSectionDefs to colour N sections.
 *  [floorColor, rimColor] — mid-tone base colours.
 *  Active glow uses the emissive multiplier in PieSection to punch up to full vibrancy. */
const SECTION_PALETTE: [string, string][] = [
    ['#b8365e', '#b8365e'],   // deep rose
    ['#1a9e50', '#1a9e50'],   // forest green
    ['#b8860b', '#b8860b'],   // dark goldenrod
    ['#1e5fa8', '#1e5fa8'],   // deep blue
    ['#8b2fc9', '#8b2fc9'],   // rich purple
];

/**
 * Creates an array of SectionDef for a given count.
 * - 2 sections: classic 60/40 split (216° / 144°)
 * - N sections: equal angular distribution
 *
 * When `color` is provided, all sections use that single color
 * (matching the deal's accent). Falls back to SECTION_PALETTE cycling.
 */
export function createSectionDefs(count: number, color?: string): SectionDef[] {
    if (count < 1) return [];

    if (count === 2) {
        const c0 = color ?? SECTION_PALETTE[0][0];
        const c1 = color ?? SECTION_PALETTE[1][0];
        return [
            { startDeg: 0, endDeg: 216, floorColor: c0, rimColor: c0 },
            { startDeg: 216, endDeg: 360, floorColor: c1, rimColor: c1 },
        ];
    }

    const slice = 360 / count;
    return Array.from({ length: count }, (_, i) => {
        const c = color ?? SECTION_PALETTE[i % SECTION_PALETTE.length][0];
        return {
            startDeg: i * slice,
            endDeg: (i + 1) * slice,
            floorColor: c,
            rimColor: c,
        };
    });
}

/** Default 2-section plate (Saver) */
export const DEFAULT_SECTIONS = createSectionDefs(2);
