/**
 * Plate Configurator — all tuneable values.
 * Adjust these to change plate proportions, colours, and behaviour
 * without touching geometry or component code.
 */

export const plateConfig = {
    plate: {
        radius: 2.0,
        thickness: 0.08,
        floatHeight: 0.2
    },

    sections: {
        separation: 0.06,
        baseHeight: 0.09,
        rimHeight: 0.26,
        rimThick: 0.065,
        outerR: 1.85,
        innerR: 0.0
    },

    colors: {
        plateBase: '#e8e0f0',
        plateGold: '#c4a44a',
        plateBlue: '#4a6fa5'
    },

    camera: {
        fov: 40,
        position: [3.0, 1.2, 5] as [number, number, number],
        lookAt: [0, 0.05, 0] as [number, number, number]
    },

    // Plate rotation (in radians) — static tilt applied to outer wrapper group.
    // The animated carousel spin is on a separate inner group so it doesn't
    // clobber these values.
    plateRotation: {
        x: (Math.PI * 60) / 180, // +60 deg — tilt top face toward camera
        y: (-Math.PI * 80) / 180, // -80 deg — anticlockwise turn
        z: (Math.PI * 10) / 180 // +10 deg — slight clockwise roll
    },

    /** Section rotation — auto-rotate plate to center the active section */
    sectionRotation: {
        enabled: true
    },

    /** Per-plate-type rotation offsets (radians) indexed by section count.
     *  Applied to the base π/2 rotation so each plate type starts
     *  with its most important section facing the camera. */
    rotationOffsets: {
        2: Math.PI, // +180° — show the big section first
        5: (50 * Math.PI) / 180 // +50°  — slight offset for premium
    } as Record<number, number>
} as const;

export type PlateConfig = typeof plateConfig;

/**
 * Base rotation for a plate type — π/2 plus the per-plate offset.
 * Used by both section targeting and mouse-tracking in the page.
 */
export function getPlateBaseRotation(sectionCount: number): number {
    return Math.PI / 2 + (plateConfig.rotationOffsets[sectionCount] ?? 0);
}

/**
 * Compute the Y-rotation (radians) needed to bring a section into view.
 *
 * - For 2-section plates: rotates by the target section's arc width
 *   (less dramatic than midpoint-to-midpoint).
 * - For N-section plates: centres the section's midpoint in front of
 *   the camera using the classic midpoint approach.
 */
export function computeSectionTargetRotation(sectionIndex: number, sections: SectionDef[]): number {
    if (sectionIndex < 0 || sectionIndex >= sections.length) return 0;

    const base = getPlateBaseRotation(sections.length);

    // Section 0 always sits at the base rotation
    if (sectionIndex === 0) return base;

    const sec = sections[sectionIndex];

    // 2-section plates: step by the target section's arc width
    if (sections.length === 2) {
        const arcRad = ((sec.endDeg - sec.startDeg) * Math.PI) / 180;
        return base - arcRad;
    }

    // N-section plates: centre on midpoint
    const midRad = (((sec.startDeg + sec.endDeg) / 2) * Math.PI) / 180;
    const sec0 = sections[0];
    const baseMidRad = (((sec0.startDeg + sec0.endDeg) / 2) * Math.PI) / 180;

    return base - (midRad - baseMidRad);
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
    ['#b8365e', '#b8365e'], // deep rose
    ['#1a9e50', '#1a9e50'], // forest green
    ['#b8860b', '#b8860b'], // dark goldenrod
    ['#1e5fa8', '#1e5fa8'], // deep blue
    ['#8b2fc9', '#8b2fc9'] // rich purple
];

/** Premium plate angular distribution:
 *  Main 130° | Base 72° | Side1 60° | Side2 60° | Bonus 38° */
const PREMIUM_ARCS = [130, 72, 60, 60, 38];

export function createSectionDefs(count: number, color?: string): SectionDef[] {
    if (count < 1) return [];

    if (count === 2) {
        const c0 = color ?? SECTION_PALETTE[0][0];
        const c1 = color ?? SECTION_PALETTE[1][0];
        return [
            { startDeg: 0, endDeg: 216, floorColor: c0, rimColor: c0 },
            { startDeg: 216, endDeg: 360, floorColor: c1, rimColor: c1 }
        ];
    }

    if (count === 5) {
        const defs: SectionDef[] = [];
        let cursor = 0;
        for (let i = 0; i < 5; i++) {
            const c = color ?? SECTION_PALETTE[i % SECTION_PALETTE.length][0];
            const arc = PREMIUM_ARCS[i];
            defs.push({ startDeg: cursor, endDeg: cursor + arc, floorColor: c, rimColor: c });
            cursor += arc;
        }
        return defs;
    }

    const slice = 360 / count;
    return Array.from({ length: count }, (_, i) => {
        const c = color ?? SECTION_PALETTE[i % SECTION_PALETTE.length][0];
        return {
            startDeg: i * slice,
            endDeg: (i + 1) * slice,
            floorColor: c,
            rimColor: c
        };
    });
}

/** Default 2-section plate (Saver) */
export const DEFAULT_SECTIONS = createSectionDefs(2);
