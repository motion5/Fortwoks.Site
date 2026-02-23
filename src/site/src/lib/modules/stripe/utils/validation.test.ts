import { describe, it, expect } from 'vitest';
import {
    validateAmount,
    validateCurrency,
    validateEmail,
    isTerminalStatus,
    requiresAction
} from './validation';

describe('validateAmount', () => {
    it('accepts positive amounts', () => {
        expect(validateAmount(100)).toBe(true);
        expect(validateAmount(1000)).toBe(true);
        expect(validateAmount(50000)).toBe(true);
    });

    it('rejects zero and negative amounts', () => {
        expect(validateAmount(0)).toBe(false);
        expect(validateAmount(-100)).toBe(false);
    });

    it('rejects amounts over $1M (99999999 cents)', () => {
        expect(validateAmount(99999999)).toBe(true);
        expect(validateAmount(100000000)).toBe(false);
    });
});

describe('validateCurrency', () => {
    it('accepts valid currency codes', () => {
        expect(validateCurrency('usd')).toBe(true);
        expect(validateCurrency('USD')).toBe(true);
        expect(validateCurrency('eur')).toBe(true);
        expect(validateCurrency('gbp')).toBe(true);
    });

    it('rejects invalid currency codes', () => {
        expect(validateCurrency('xyz')).toBe(false);
        expect(validateCurrency('')).toBe(false);
    });
});

describe('validateEmail', () => {
    it('accepts valid email addresses', () => {
        expect(validateEmail('test@example.com')).toBe(true);
        expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
        expect(validateEmail('notanemail')).toBe(false);
        expect(validateEmail('@example.com')).toBe(false);
        expect(validateEmail('test@')).toBe(false);
        expect(validateEmail('')).toBe(false);
    });
});

describe('isTerminalStatus', () => {
    it('returns true for terminal statuses', () => {
        expect(isTerminalStatus('succeeded')).toBe(true);
        expect(isTerminalStatus('canceled')).toBe(true);
    });

    it('returns false for non-terminal statuses', () => {
        expect(isTerminalStatus('processing')).toBe(false);
        expect(isTerminalStatus('requires_action')).toBe(false);
        expect(isTerminalStatus('requires_payment_method')).toBe(false);
    });
});

describe('requiresAction', () => {
    it('returns true only for requires_action status', () => {
        expect(requiresAction('requires_action')).toBe(true);
    });

    it('returns false for other statuses', () => {
        expect(requiresAction('succeeded')).toBe(false);
        expect(requiresAction('processing')).toBe(false);
        expect(requiresAction('canceled')).toBe(false);
    });
});
