/**
 * Basket store — manages the client-side basket state.
 *
 * NOTE: This is the UI-side basket for immediate feedback. The Andromeda
 * API manages the authoritative server-side basket. When submitting,
 * sync this with POST /baskets/{id}/items calls.
 */

import type { BasketItem, LazyPlateSelection } from '../types';

function createBasketStore() {
    let items = $state<BasketItem[]>([]);
    let count = $derived(items.length);
    let total = $derived(items.reduce((sum, item) => sum + item.price, 0));
    let isEmpty = $derived(items.length === 0);

    // Triggers a brief bounce animation on the basket icon
    let bouncing = $state(false);

    function triggerBounce() {
        bouncing = true;
        setTimeout(() => {
            bouncing = false;
        }, 400);
    }

    return {
        get items() {
            return items;
        },
        get count() {
            return count;
        },
        get total() {
            return total;
        },
        get isEmpty() {
            return isEmpty;
        },
        get bouncing() {
            return bouncing;
        },

        addItem(item: BasketItem) {
            items = [...items, { ...item, basketId: crypto.randomUUID() }];
            triggerBounce();
        },

        addLazyPlate(plate: LazyPlateSelection) {
            items = [
                ...items,
                {
                    basketId: crypto.randomUUID(),
                    name: plate.plateName,
                    price: plate.price,
                    type: 'lazy-plate',
                    selections: plate.selections
                }
            ];
            triggerBounce();
        },

        removeItem(basketId: string) {
            items = items.filter((i) => i.basketId !== basketId);
        },

        clear() {
            items = [];
        }
    };
}

export const basketStore = createBasketStore();
