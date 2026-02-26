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
        mainDegrees: 216,
        sideDegrees: 144,
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
        mainFloor: '#e84393',
        mainRim: '#e84393',
        sideFloor: '#2ecc71',
        sideRim: '#2ecc71',
        glowMain: '#000000',
        glowSide: '#000000',
    },

    camera: {
        fov: 42,
        position: [3.0, 2.2, 4] as [number, number, number],
        lookAt: [0, 0.15, 0] as [number, number, number],
    },
} as const;

export type PlateConfig = typeof plateConfig;
