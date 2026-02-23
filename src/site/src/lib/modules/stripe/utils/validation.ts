/**
 * Validate amount is positive and reasonable
 */
export function validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 99999999; // Max ~$1M
}

/**
 * Validate currency code (ISO 4217)
 */
export function validateCurrency(currency: string): boolean {
    const validCurrencies = ['usd', 'eur', 'gbp', 'cad', 'aud', 'jpy'];
    return validCurrencies.includes(currency.toLowerCase());
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Check if payment status is terminal
 */
export function isTerminalStatus(status: string): boolean {
    return ['succeeded', 'canceled'].includes(status);
}

/**
 * Check if payment requires action
 */
export function requiresAction(status: string): boolean {
    return status === 'requires_action';
}
