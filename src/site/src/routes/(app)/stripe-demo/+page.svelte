<script lang="ts">
    import { CheckoutButton } from '$lib/modules/stripe';
    import { dollarsToCents } from '$lib/modules/stripe';

    const products = [
        { id: 1, name: 'Basic Plan', price: 9.99 },
        { id: 2, name: 'Pro Plan', price: 29.99 },
        { id: 3, name: 'Enterprise Plan', price: 99.99 }
    ];
</script>

<svelte:head>
    <title>Stripe Payment Demo</title>
</svelte:head>

<div class="demo-page">
    <div class="container">
        <h1>Stripe Payment Demo</h1>
        <p class="subtitle">
            Example implementation of Stripe payment integration using the stripe module.
        </p>

        <div class="products-grid">
            {#each products as product (product.id)}
                <div class="product-card">
                    <h3>{product.name}</h3>
                    <div class="price">${product.price}/month</div>
                    <ul class="features">
                        <li>Feature 1</li>
                        <li>Feature 2</li>
                        <li>Feature 3</li>
                    </ul>
                    <CheckoutButton
                        amount={dollarsToCents(product.price)}
                        currency="usd"
                        metadata={{ productId: product.id.toString(), productName: product.name }}
                    />
                </div>
            {/each}
        </div>

        <div class="info-section">
            <h2>Implementation Details</h2>
            <p>This demo showcases:</p>
            <ul>
                <li>
                    <strong>CheckoutButton</strong> component that creates a payment intent and redirects
                    to checkout
                </li>
                <li><strong>PaymentForm</strong> component with Stripe Elements integration</li>
                <li>Server-side API routes for payment intent creation</li>
                <li>Webhook handling for payment events</li>
                <li>Success page after payment completion</li>
            </ul>

            <h3>Test Cards</h3>
            <p>Use these test card numbers in the checkout form:</p>
            <ul>
                <li><code>4242 4242 4242 4242</code> - Successful payment</li>
                <li><code>4000 0000 0000 9995</code> - Declined payment</li>
                <li><code>4000 0025 0000 3155</code> - Requires authentication (3D Secure)</li>
            </ul>
            <p>Use any future expiration date and any 3-digit CVC.</p>
        </div>
    </div>
</div>

<style>
    .demo-page {
        min-height: 100vh;
        padding: 3rem 1.5rem;
        background: #f9fafb;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
    }

    h1 {
        margin: 0 0 0.5rem;
        font-size: 2.5rem;
        font-weight: 800;
        color: #111827;
        text-align: center;
    }

    .subtitle {
        margin: 0 0 3rem;
        text-align: center;
        color: #6b7280;
        font-size: 1.125rem;
    }

    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin-bottom: 4rem;
    }

    .product-card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        display: flex;
        flex-direction: column;
    }

    .product-card h3 {
        margin: 0 0 1rem;
        font-size: 1.5rem;
        font-weight: 700;
        color: #111827;
    }

    .price {
        margin-bottom: 1.5rem;
        font-size: 2rem;
        font-weight: 800;
        color: #635bff;
    }

    .features {
        margin: 0 0 2rem;
        padding: 0;
        list-style: none;
        flex-grow: 1;
    }

    .features li {
        padding: 0.5rem 0;
        color: #6b7280;
    }

    .features li::before {
        content: '✓ ';
        color: #10b981;
        font-weight: bold;
        margin-right: 0.5rem;
    }

    .info-section {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    }

    .info-section h2 {
        margin: 0 0 1rem;
        font-size: 1.5rem;
        font-weight: 700;
        color: #111827;
    }

    .info-section h3 {
        margin: 2rem 0 1rem;
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
    }

    .info-section p {
        margin: 0 0 1rem;
        color: #4b5563;
        line-height: 1.6;
    }

    .info-section ul {
        margin: 0 0 1rem;
        padding-left: 1.5rem;
        color: #4b5563;
        line-height: 1.8;
    }

    .info-section code {
        padding: 0.25rem 0.5rem;
        background: #f3f4f6;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.875rem;
        color: #1f2937;
    }
</style>
