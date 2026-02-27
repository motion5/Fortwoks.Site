// ordering module — barrel export
// Components
export { default as CategoryNav } from './components/CategoryNav.svelte';
export { default as MenuItemCard } from './components/MenuItemCard.svelte';
export { default as MenuSection } from './components/MenuSection.svelte';
export { default as LazyPlatesSection } from './components/LazyPlatesSection.svelte';
export { default as LazyPlateBuilder } from './components/LazyPlateBuilder.svelte';
export { default as BasketBar } from './components/BasketBar.svelte';
export { default as ThemeToggle } from './components/ThemeToggle.svelte';
export { default as CosmicBackground } from './components/CosmicBackground.svelte';
export { default as DragonBackground } from './components/DragonBackground.svelte';

// Stores
export { themeStore } from './stores/theme.svelte';
export { basketStore } from './stores/basket.svelte';

// Types
export type * from './types';
