import Stripe from 'stripe';
import { stripeConfig } from './config';

/**
 * Stripe API client instance
 * Lazy-loaded to avoid initialization issues
 */
let stripeClient: Stripe | null = null;

/**
 * Get or create Stripe client instance
 */
export function getStripeClient(): Stripe {
    if (!stripeClient) {
        stripeClient = new Stripe(stripeConfig.secretKey, {
            apiVersion: stripeConfig.apiVersion,
            typescript: true
        });
    }
    return stripeClient;
}
