/**
 * Sample menu data for development and prototyping.
 *
 * In production, this data comes from:
 *   GET /tenants/{tenantId}/sites/{siteId}/menu
 *
 * This file exists so you can develop the UI without a live API.
 * Replace with real data from the Andromeda menu endpoint.
 */

import type { MenuCategory, MenuItem, LazyPlate, LazyPlateItemsMap } from '../types';

export const CATEGORIES: MenuCategory[] = [
	{ id: 'lazy-plates', label: 'Lazy Plates', icon: '🍱' },
	{ id: 'starters', label: 'Starters', icon: '🥟' },
	{ id: 'sides', label: 'Sides', icon: '🥢' },
	{ id: 'crispy-duck', label: 'Crispy Duck', icon: '🦆' },
	{ id: 'mains', label: 'Mains', icon: '🔥' },
	{ id: 'bases', label: 'Bases', icon: '🍜' },
	{ id: 'sauce', label: 'Sauce', icon: '🫙' },
	{ id: 'extras', label: 'Extras', icon: '✨' },
	{ id: 'drinks', label: 'Drinks', icon: '🥤' },
	{ id: 'desserts', label: 'Desserts', icon: '🍡' }
];

export const LAZY_PLATES: LazyPlate[] = [
	{
		id: 'saver',
		name: 'Saver Plate',
		subtitle: 'Combo Meal Kit · Choose 2',
		description: 'Choose a main dish and a side to create your perfect combination.',
		price: 12.99,
		steps: [
			{ label: 'Choose your Main', key: 'main' },
			{ label: 'Choose your Side', key: 'side' }
		],
		accentDark: '#e04530',
		accentLight: '#c4352a',
		sections: 2
	},
	{
		id: 'premium',
		name: 'Premium Plate',
		subtitle: 'Choose 5 · Free sauce pot or drink',
		description: 'Build the ultimate feast with five dishes of your choice.',
		price: 19.99,
		steps: [
			{ label: 'Choose your Main', key: 'main' },
			{ label: 'Choose your Base', key: 'base' },
			{ label: 'Choose your Side', key: 'side1' },
			{ label: 'Choose another Side', key: 'side2' },
			{ label: 'Choose Sauce or Drink', key: 'bonus' }
		],
		accentDark: '#e8a830',
		accentLight: '#c48a20',
		sections: 5
	}
];

/**
 * Maps lazy plate step keys to available item names.
 * In production, these come from the Deal's ProductList references
 * in the Andromeda menu response.
 */
export const LAZY_PLATE_ITEMS: LazyPlateItemsMap = {
	main: [
		'Sweet & Sour Chicken',
		'Salt & Pepper Chicken',
		'Cashew Chicken',
		'Chicken Curry',
		'Peanut Satay Chicken',
		'Honey Sesame Chicken',
		'Smoked Chicken',
		'Black Bean Beef',
		'Black Bean Chicken',
		"General Tso's Chicken",
		'Sticky Orange Chicken',
		'Lemon Chicken',
		'Sweet Chilli Chicken',
		'Kung Pao Chicken'
	],
	side: [
		'Veggie Spring Rolls',
		'Mini Chicken Balls',
		'Prawn Crackers',
		'Salt & Pepper Chips',
		'Egg Fried Rice',
		'Chicken Wings',
		'Edamame Beans',
		'Seaweed'
	],
	base: [
		'Egg Fried Rice',
		'Steamed Rice',
		'Noodles',
		'Chow Mein',
		'Singapore Noodles',
		'Salt & Pepper Chips',
		'Yummy Chips'
	],
	side1: [
		'Veggie Spring Rolls',
		'Mini Chicken Balls',
		'Prawn Crackers',
		'Salt & Pepper Chips',
		'Chicken Wings',
		'Edamame Beans'
	],
	side2: [
		'Veggie Spring Rolls',
		'Mini Chicken Balls',
		'Prawn Crackers',
		'Salt & Pepper Chips',
		'Chicken Wings',
		'Edamame Beans'
	],
	bonus: [
		'Sweet Chilli Sauce',
		'Curry Sauce',
		'BBQ Sauce',
		'Soy Sauce Pot',
		'Can of Coke',
		'Can of Fanta',
		'Sprite',
		'Water'
	]
};

export const STARTERS: MenuItem[] = [
	{ name: 'Satay Chicken Skewers', desc: '4 pieces', price: 6.99, emoji: '🍢' },
	{ name: 'Chicken & Sweetcorn Soup', desc: '', price: 3.99, emoji: '🥣' },
	{ name: 'Hot & Sour Soup', desc: '', price: 4.49, emoji: '🥣' },
	{ name: 'BBQ Spare Ribs', desc: '', price: 7.99, emoji: '🍖' },
	{ name: 'Salt & Pepper Ribs', desc: '', price: 8.49, emoji: '🍖' },
	{ name: 'Capital Ribs', desc: '', price: 8.49, emoji: '🍖' },
	{ name: 'Salt & Pepper Prawns', desc: '', price: 8.49, emoji: '🍤' },
	{ name: 'Salt & Pepper Wings', desc: '', price: 6.99, emoji: '🍗' },
	{
		name: 'Spice Bag',
		desc: 'Salt & Pepper Chicken & Yummy Chips',
		price: 8.99,
		emoji: '🌶️'
	},
	{
		name: 'Veggie Spice Bag',
		desc: 'Veggie Spring Rolls & Yummy Chips',
		price: 7.99,
		emoji: '🥬'
	},
	{ name: 'Crispy Duck Loaded Fries', desc: '', price: 9.99, emoji: '🦆' },
	{ name: 'BBQ Pork Loaded Fries', desc: '', price: 8.99, emoji: '🍟' }
];

export const SIDES: MenuItem[] = [
	{ name: 'Veggie Spring Rolls', desc: '4 pieces', price: 4.49, emoji: '🥟' },
	{ name: 'Sweet & Sour Chicken Balls', desc: '', price: 6.49, emoji: '🥮' },
	{ name: 'Mini Chicken Balls', desc: '', price: 5.49, emoji: '🥮' },
	{ name: 'Prawn Crackers', desc: '', price: 2.99, emoji: '🍘' },
	{ name: 'Salt & Pepper Chips', desc: '', price: 4.99, emoji: '🍟' },
	{ name: 'Egg Fried Rice', desc: '', price: 3.99, emoji: '🍚' },
	{ name: 'Edamame Beans', desc: '', price: 3.99, emoji: '🫛' },
	{ name: 'Seaweed', desc: 'Crispy aromatic', price: 4.49, emoji: '🌿' }
];
