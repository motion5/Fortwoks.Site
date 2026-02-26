export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Path to GLB model, e.g. '/models/chilli-beef.glb' */
  modelUrl?: string;
  /** Per-item scale/offset overrides */
  modelScale?: number;
  modelYOffset?: number;
  image?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  type: 'main' | 'side';
  items: MenuItem[];
}

export type SectionId = 'main' | 'side' | 'none';

export interface PlateSelection {
  main: MenuItem | null;
  side: MenuItem | null;
}

/** Config for placeholder/prototype food per item */
export interface FoodModelConfig {
  scale: number;
  yOffset: number;
  modelUrl?: string;
}
