// Public API for the menu module.
// Import from '$lib/modules/menu' in your routes.

export { default as MenuPie } from './components/MenuPie.svelte';
export { default as MenuCard } from './components/MenuCard.svelte';
export { menuState, rotationState } from './stores/menu.svelte';
export { plateConfig } from './utils/plate-config';
export type {
  MenuItem,
  MenuCategory,
  SectionId,
  PlateSelection,
  FoodModelConfig,
} from './types';
