import { describe, it, expect, vi, beforeEach } from 'vitest';
import type Stripe from 'stripe';
import { createPaymentIntent } from './payment-intents';
import * as client from './client';

// Mock the Stripe client
vi.mock('./client', () => ({
    getStripeClient: vi.fn()
}));

describe('createPaymentIntent', () => {
    let mockStripe: {
        paymentIntents: {
            create: ReturnType<typeof vi.fn>;
            retrieve: ReturnType<typeof vi.fn>;
            cancel: ReturnType<typeof vi.fn>;
            update: ReturnType<typeof vi.fn>;
        };
    };

    beforeEach(() => {
        mockStripe = {
            paymentIntents: {
                create: vi.fn(),
                retrieve: vi.fn(),
                cancel: vi.fn(),
                update: vi.fn()
            }
        };
        vi.mocked(client.getStripeClient).mockReturnValue(mockStripe as unknown as Stripe);
    });

    it('creates a payment intent with default currency', async () => {
        const mockPaymentIntent = {
            id: 'pi_test123',
            client_secret: 'pi_test123_secret',
            status: 'requires_payment_method',
            amount: 1000,
            currency: 'usd'
        };

        mockStripe.paymentIntents.create.mockResolvedValue(
            mockPaymentIntent as unknown as Stripe.PaymentIntent
        );

        const result = await createPaymentIntent({
            amount: 1000
        });

        expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
            amount: 1000,
            currency: 'usd',
            metadata: {},
            automatic_payment_methods: {
                enabled: true
            }
        });

        expect(result).toEqual({
            clientSecret: 'pi_test123_secret',
            id: 'pi_test123',
            status: 'requires_payment_method',
            amount: 1000,
            currency: 'usd'
        });
    });

    it('creates a payment intent with custom currency', async () => {
        const mockPaymentIntent = {
            id: 'pi_test123',
            client_secret: 'pi_test123_secret',
            status: 'requires_payment_method',
            amount: 2500,
            currency: 'eur'
        };

        mockStripe.paymentIntents.create.mockResolvedValue(
            mockPaymentIntent as unknown as Stripe.PaymentIntent
        );

        const result = await createPaymentIntent({
            amount: 2500,
            currency: 'eur'
        });

        expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
            expect.objectContaining({
                amount: 2500,
                currency: 'eur'
            })
        );

        expect(result.currency).toBe('eur');
    });

    it('creates a payment intent with metadata', async () => {
        const mockPaymentIntent = {
            id: 'pi_test123',
            client_secret: 'pi_test123_secret',
            status: 'requires_payment_method',
            amount: 1000,
            currency: 'usd'
        };

        mockStripe.paymentIntents.create.mockResolvedValue(
            mockPaymentIntent as unknown as Stripe.PaymentIntent
        );

        const metadata = { orderId: '12345', customerId: 'cus_123' };

        await createPaymentIntent({
            amount: 1000,
            metadata
        });

        expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
            expect.objectContaining({
                metadata
            })
        );
    });

    it('enables automatic payment methods', async () => {
        const mockPaymentIntent = {
            id: 'pi_test123',
            client_secret: 'pi_test123_secret',
            status: 'requires_payment_method',
            amount: 1000,
            currency: 'usd'
        };

        mockStripe.paymentIntents.create.mockResolvedValue(
            mockPaymentIntent as unknown as Stripe.PaymentIntent
        );

        await createPaymentIntent({
            amount: 1000
        });

        expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
            expect.objectContaining({
                automatic_payment_methods: {
                    enabled: true
                }
            })
        );
    });
});
