/**
 * Menu state — Svelte 5 runes.
 *
 * Manages which section is selected, what food is in each slot,
 * and rotation controls. Import and use directly in components.
 */

import type { MenuItem, SectionId, PlateSelection } from '../types';

// ─── Selection state ───────────────────────────────────────────────

let _selectedSection = $state<SectionId>('main');
let _selection = $state<PlateSelection>({ main: null, side: null });

export const menuState = {
    get selectedSection() {
        return _selectedSection;
    },
    set selectedSection(v: SectionId) {
        _selectedSection = v;
    },

    get selection() {
        return _selection;
    },

    selectFood(section: 'main' | 'side', item: MenuItem | null) {
        _selection = { ..._selection, [section]: item };
    },

    reset() {
        _selection = { main: null, side: null };
        _selectedSection = 'none';
    }
};

// ─── Rotation state ────────────────────────────────────────────────

let _rotation = $state(Math.PI / 2);
let _autoRotate = $state(true);

export const rotationState = {
    get rotation() {
        return _rotation;
    },
    set rotation(v: number) {
        _rotation = v;
        _autoRotate = false;
    },

    get autoRotate() {
        return _autoRotate;
    },
    set autoRotate(v: boolean) {
        _autoRotate = v;
    },

    nudge(delta: number) {
        _rotation += delta;
        _autoRotate = false;
    }
};
