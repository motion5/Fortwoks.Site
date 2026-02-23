import { describe, it, expect } from 'vitest';
import {
    formatAmount,
    dollarsToCents,
    centsToDollars,
    formatCardBrand,
    formatCardNumber,
    formatExpiration
} from './format';

describe('formatAmount', () => {
    it('formats USD amounts correctly', () => {
        expect(formatAmount(1000, 'USD')).toBe('$10.00');
        expect(formatAmount(2550, 'USD')).toBe('$25.50');
        expect(formatAmount(100, 'USD')).toBe('$1.00');
    });

    it('handles different currencies', () => {
        expect(formatAmount(1000, 'EUR')).toContain('10');
        expect(formatAmount(1000, 'GBP')).toContain('10');
    });

    it('defaults to USD', () => {
        expect(formatAmount(1000)).toBe('$10.00');
    });
});

describe('dollarsToCents', () => {
    it('converts dollars to cents correctly', () => {
        expect(dollarsToCents(10)).toBe(1000);
        expect(dollarsToCents(25.5)).toBe(2550);
        expect(dollarsToCents(0.99)).toBe(99);
    });

    it('rounds to nearest cent', () => {
        expect(dollarsToCents(10.556)).toBe(1056);
        expect(dollarsToCents(10.554)).toBe(1055);
    });
});

describe('centsToDollars', () => {
    it('converts cents to dollars correctly', () => {
        expect(centsToDollars(1000)).toBe(10);
        expect(centsToDollars(2550)).toBe(25.5);
        expect(centsToDollars(99)).toBe(0.99);
    });
});

describe('formatCardBrand', () => {
    it('formats known card brands', () => {
        expect(formatCardBrand('visa')).toBe('Visa');
        expect(formatCardBrand('mastercard')).toBe('Mastercard');
        expect(formatCardBrand('amex')).toBe('American Express');
    });

    it('handles case insensitivity', () => {
        expect(formatCardBrand('VISA')).toBe('Visa');
        expect(formatCardBrand('MasterCard')).toBe('Mastercard');
    });

    it('returns original value for unknown brands', () => {
        expect(formatCardBrand('unknown')).toBe('unknown');
    });
});

describe('formatCardNumber', () => {
    it('formats card number with bullets and last 4', () => {
        expect(formatCardNumber('4242')).toBe('•••• 4242');
        expect(formatCardNumber('1234')).toBe('•••• 1234');
    });
});

describe('formatExpiration', () => {
    it('formats expiration date correctly', () => {
        expect(formatExpiration(12, 2025)).toBe('12/25');
        expect(formatExpiration(1, 2024)).toBe('01/24');
        expect(formatExpiration(3, 2030)).toBe('03/30');
    });

    it('pads single-digit months', () => {
        expect(formatExpiration(1, 2025)).toBe('01/25');
        expect(formatExpiration(9, 2025)).toBe('09/25');
    });
});
