/**
 * Format amount in cents to currency string
 */
export function formatAmount(amountInCents: number, currency = 'USD'): string {
    const amount = amountInCents / 100;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount);
}

/**
 * Convert dollars to cents
 */
export function dollarsToCents(dollars: number): number {
    return Math.round(dollars * 100);
}

/**
 * Convert cents to dollars
 */
export function centsToDollars(cents: number): number {
    return cents / 100;
}

/**
 * Format card brand for display
 */
export function formatCardBrand(brand: string): string {
    const brands: Record<string, string> = {
        visa: 'Visa',
        mastercard: 'Mastercard',
        amex: 'American Express',
        discover: 'Discover',
        diners: 'Diners Club',
        jcb: 'JCB',
        unionpay: 'UnionPay'
    };
    return brands[brand.toLowerCase()] || brand;
}

/**
 * Format card number display (e.g., "**** 4242")
 */
export function formatCardNumber(last4: string): string {
    return `•••• ${last4}`;
}

/**
 * Format expiration date (e.g., "12/25")
 */
export function formatExpiration(month: number, year: number): string {
    const monthStr = month.toString().padStart(2, '0');
    const yearStr = year.toString().slice(-2);
    return `${monthStr}/${yearStr}`;
}
