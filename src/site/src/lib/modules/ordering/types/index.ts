/** Menu category for the navigation bar */
export interface MenuCategory {
	id: string;
	label: string;
	icon: string;
}

/** A standard menu item (starters, sides, mains, etc.) */
export interface MenuItem {
	name: string;
	desc: string;
	price: number;
	emoji: string;
	/** Andromeda product ID (string) */
	productId?: string;
	outOfStock?: boolean;
}

/** A step in the lazy plate builder flow */
export interface LazyPlateStep {
	label: string;
	/** Key into the available items map, e.g. 'main', 'side', 'base' */
	key: string;
}

/** Lazy plate deal definition (Saver Plate / Premium Plate) */
export interface LazyPlate {
	id: string;
	name: string;
	subtitle: string;
	description: string;
	price: number;
	steps: LazyPlateStep[];
	/** Accent colour for dark theme */
	accentDark: string;
	/** Accent colour for light theme */
	accentLight: string;
	/** Number of plate sections (matches steps.length, used for PlateSVG) */
	sections: number;
}

/** User's completed lazy plate selections */
export interface LazyPlateSelection {
	plateName: string;
	plateId: string;
	price: number;
	/** Map of step key → selected item name */
	selections: Record<string, string>;
}

/** An item in the basket */
export interface BasketItem {
	basketId: string;
	name: string;
	price: number;
	type?: 'item' | 'lazy-plate';
	/** Only present for lazy plates */
	selections?: Record<string, string>;
	/** Andromeda product ID */
	productId?: string;
}

/** Available items for each lazy plate step key */
export type LazyPlateItemsMap = Record<string, string[]>;
