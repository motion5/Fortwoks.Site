<script lang="ts">
    let activeExample = $state('state');

    const examples: Record<string, { title: string; code: string }> = {
        state: {
            title: 'Reactive State',
            code: `let count = $state(0);

function increment() {
    count++;
}`
        },
        derived: {
            title: 'Derived Values',
            code: `let count = $state(0);
let doubled = $derived(count * 2);
let message = $derived(\`Count is \${count}\`);`
        },
        effect: {
            title: 'Side Effects',
            code: `$effect(() => {
    console.log(\`Count: \${count}\`);
    document.title = \`Count: \${count}\`;
});`
        }
    };

    const features = [
        {
            icon: '⚡',
            title: 'Svelte 5 with Runes',
            description:
                'Leverage the latest Svelte 5 features including $state, $derived, and $effect for powerful reactivity.'
        },
        {
            icon: '🏗️',
            title: 'Modular Architecture',
            description:
                'Feature-based module system for scalable codebases with clear separation of concerns.'
        },
        {
            icon: '🧪',
            title: 'Comprehensive Testing',
            description:
                'Vitest for unit tests and Playwright for E2E testing, with browser-based component tests.'
        },
        {
            icon: '🎯',
            title: 'Route Groups',
            description:
                'Organized routes for different layouts (app vs. marketing) without affecting URLs.'
        },
        {
            icon: '📦',
            title: 'Type Safety',
            description:
                'Full TypeScript support throughout with ESLint and Prettier for code quality.'
        },
        {
            icon: '🚀',
            title: 'Production Ready',
            description:
                'Deploy anywhere with adapter-auto: Vercel, Netlify, Cloudflare, or Node.js.'
        }
    ];
</script>

<div class="landing">
    <section class="hero">
        <div class="container">
            <h1 class="hero-title">SvelteKit Starter</h1>
            <p class="hero-subtitle">
                A modern, production-ready template featuring Svelte 5 with runes, modular
                architecture, and comprehensive testing.
            </p>
            <div class="hero-actions">
                <a href="#getting-started" class="btn btn-primary">Get Started</a>
                <a href="https://github.com/yourusername/svelte-starter" class="btn btn-secondary"
                    >View on GitHub</a
                >
            </div>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <h2 class="section-title">Features</h2>
            <div class="feature-grid">
                {#each features as feature}
                    <div class="feature-card">
                        <div class="feature-icon">{feature.icon}</div>
                        <h3 class="feature-title">{feature.title}</h3>
                        <p class="feature-description">{feature.description}</p>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <section class="runes-demo">
        <div class="container">
            <h2 class="section-title">Svelte 5 Runes in Action</h2>
            <p class="section-subtitle">Experience the power of Svelte 5's new reactivity system</p>
            <div class="demo-container">
                <div class="demo-tabs">
                    {#each Object.keys(examples) as key}
                        <button
                            class="demo-tab"
                            class:active={activeExample === key}
                            onclick={() => (activeExample = key)}
                        >
                            {examples[key].title}
                        </button>
                    {/each}
                </div>
                <div class="demo-content">
                    <pre><code>{examples[activeExample].code}</code></pre>
                </div>
            </div>
        </div>
    </section>

    <section class="structure">
        <div class="container">
            <h2 class="section-title">Project Structure</h2>
            <p class="section-subtitle">Clean, organized architecture for scalable applications</p>
            <div class="structure-container">
                <div class="structure-tree">
                    <pre><code
                            >svelte-starter/
├── src/
│   ├── lib/
│   │   ├── components/      # Shared UI components
│   │   │   ├── ui/          # Generic UI (buttons, inputs)
│   │   │   └── layout/      # Layout components
│   │   └── modules/         # Feature modules
│   │       └── _template/   # Template for new modules
│   └── routes/
│       ├── (app)/           # Authenticated routes
│       └── (marketing)/     # Public routes
├── static/                  # Static assets
└── e2e/                     # E2E tests</code
                        ></pre>
                </div>
                <div class="structure-explanation">
                    <div class="explanation-item">
                        <h4>Feature Modules</h4>
                        <p>
                            Self-contained units in <code>src/lib/modules/</code> with components, stores,
                            types, and utilities. Each module exports a clean public API.
                        </p>
                    </div>
                    <div class="explanation-item">
                        <h4>Route Groups</h4>
                        <p>
                            Organize routes with different layouts without affecting URLs.
                            <code>(app)</code> for authenticated pages, <code>(marketing)</code> for public
                            content.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="getting-started" class="getting-started">
        <div class="container">
            <h2 class="section-title">Getting Started</h2>
            <div class="steps">
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>Install Dependencies</h3>
                        <pre><code>npm install</code></pre>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>Install Playwright Browsers</h3>
                        <pre><code>npx playwright install</code></pre>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>Start Development Server</h3>
                        <pre><code>npm run dev</code></pre>
                        <p class="step-note">
                            Visit <a href="http://localhost:5173">http://localhost:5173</a> to see your
                            app
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="testing">
        <div class="container">
            <h2 class="section-title">Testing Built In</h2>
            <div class="testing-grid">
                <div class="testing-card">
                    <h3>Vitest</h3>
                    <p>Fast unit and component tests with browser mode support</p>
                    <pre><code>npm run test:unit</code></pre>
                </div>
                <div class="testing-card">
                    <h3>Playwright</h3>
                    <p>Reliable end-to-end testing across all browsers</p>
                    <pre><code>npm run test:e2e</code></pre>
                </div>
                <div class="testing-card">
                    <h3>Type Checking</h3>
                    <p>Full TypeScript support with strict type checking</p>
                    <pre><code>npm run check</code></pre>
                </div>
                <div class="testing-card">
                    <h3>Code Quality</h3>
                    <p>ESLint and Prettier for consistent code style</p>
                    <pre><code>npm run lint</code></pre>
                </div>
            </div>
        </div>
    </section>

    <section class="modules">
        <div class="container">
            <h2 class="section-title">Create a New Module</h2>
            <div class="module-steps">
                <div class="module-step">
                    <code>cp -r src/lib/modules/_template src/lib/modules/your-feature</code>
                    <p>Copy the module template</p>
                </div>
                <div class="module-step">
                    <code
                        >// src/lib/modules/your-feature/index.ts export &#123; default as
                        YourComponent &#125; from './components/YourComponent.svelte'; export &#123;
                        yourStore &#125; from './stores/your-store.svelte'; export type &#123;
                        YourType &#125; from './types';</code
                    >
                    <p>Export your public API</p>
                </div>
                <div class="module-step">
                    <code>mkdir -p src/routes/(app)/your-feature</code>
                    <p>Create routes for your feature</p>
                </div>
            </div>
        </div>
    </section>

    <section class="stripe-module">
        <div class="container">
            <h2 class="section-title">Stripe Payment Integration</h2>
            <p class="section-subtitle">
                Production-ready Stripe module with complete payment processing
            </p>
            <div class="stripe-content">
                <div class="stripe-overview">
                    <h3>What's Included</h3>
                    <ul class="stripe-features">
                        <li>
                            <span class="check-icon">✓</span>
                            <strong>Payment Components</strong> - Ready-to-use PaymentForm and CheckoutButton
                            components
                        </li>
                        <li>
                            <span class="check-icon">✓</span>
                            <strong>Server Integration</strong> - Payment intent creation, webhooks, and
                            server-side utilities
                        </li>
                        <li>
                            <span class="check-icon">✓</span>
                            <strong>TypeScript Support</strong> - Full type safety with comprehensive
                            TypeScript types
                        </li>
                        <li>
                            <span class="check-icon">✓</span>
                            <strong>Utility Functions</strong> - Formatting, validation, and helper functions
                        </li>
                    </ul>
                    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                    <a href="/stripe-demo#documentation" class="docs-link">
                        📖 View Complete Documentation →
                    </a>
                </div>
                <div class="stripe-examples">
                    <h3>Quick Start Example</h3>
                    <div class="code-example">
                        <div class="code-label">Add a checkout button:</div>
                        <pre><code
                                >&lt;script&gt;
    import &#123; CheckoutButton, dollarsToCents &#125; from '$lib/modules/stripe';
&lt;/script&gt;

&lt;CheckoutButton
    amount=&#123;dollarsToCents(29.99)&#125;
    currency="usd"
    metadata=&#123;&#123; productId: '123', plan: 'pro' &#125;&#125;
/&gt;</code
                            ></pre>
                    </div>
                    <div class="code-example">
                        <div class="code-label">Or use the payment form:</div>
                        <pre><code
                                >&lt;script&gt;
    import &#123; PaymentForm &#125; from '$lib/modules/stripe';

    function handleSuccess(paymentIntent) &#123;
        console.log('Payment succeeded!', paymentIntent);
    &#125;
&lt;/script&gt;

&lt;PaymentForm
    &#123;clientSecret&#125;
    amount=&#123;2999&#125;
    currency="USD"
    onSuccess=&#123;handleSuccess&#125;
/&gt;</code
                            ></pre>
                    </div>
                    <div class="demo-link">
                        <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                        <a href="/stripe-demo" class="btn btn-primary">Try Live Demo →</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="cta">
        <div class="container">
            <h2>Ready to Build Something Amazing?</h2>
            <p>Get started with the most comprehensive SvelteKit starter template</p>
            <div class="cta-actions">
                <a href="#getting-started" class="btn btn-primary">Get Started Now</a>
                <a href="https://svelte.dev/docs/kit" class="btn btn-secondary"
                    >Read SvelteKit Docs</a
                >
            </div>
        </div>
    </section>
</div>

<style>
    :global(body) {
        margin: 0;
        font-family:
            -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
            sans-serif;
        color: #333;
        line-height: 1.6;
    }

    :global(*) {
        box-sizing: border-box;
    }

    .landing {
        width: 100%;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    /* Hero Section */
    .hero {
        background: linear-gradient(135deg, #ff3e00 0%, #ff8a00 100%);
        color: white;
        padding: 120px 20px;
        text-align: center;
    }

    .hero-title {
        font-size: 4rem;
        margin: 0 0 1rem 0;
        font-weight: 700;
    }

    .hero-subtitle {
        font-size: 1.5rem;
        margin: 0 0 2rem 0;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
        opacity: 0.95;
    }

    .hero-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .btn {
        display: inline-block;
        padding: 1rem 2rem;
        font-size: 1.125rem;
        font-weight: 600;
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.2s;
        border: 2px solid transparent;
    }

    .btn-primary {
        background: white;
        color: #ff3e00;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .btn-secondary {
        background: transparent;
        color: white;
        border-color: white;
    }

    .btn-secondary:hover {
        background: white;
        color: #ff3e00;
    }

    /* Features Section */
    .features {
        padding: 80px 20px;
        background: #f8f9fa;
    }

    .section-title {
        font-size: 2.5rem;
        text-align: center;
        margin: 0 0 1rem 0;
        color: #1a1a1a;
    }

    .section-subtitle {
        text-align: center;
        font-size: 1.25rem;
        color: #666;
        margin: 0 0 3rem 0;
    }

    .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
    }

    .feature-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        transition:
            transform 0.2s,
            box-shadow 0.2s;
    }

    .feature-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .feature-title {
        font-size: 1.5rem;
        margin: 0 0 0.5rem 0;
        color: #1a1a1a;
    }

    .feature-description {
        color: #666;
        margin: 0;
    }

    /* Runes Demo Section */
    .runes-demo {
        padding: 80px 20px;
        background: white;
    }

    .demo-container {
        max-width: 800px;
        margin: 0 auto;
        background: #1e1e1e;
        border-radius: 12px;
        overflow: hidden;
    }

    .demo-tabs {
        display: flex;
        background: #2d2d2d;
        border-bottom: 1px solid #404040;
    }

    .demo-tab {
        flex: 1;
        padding: 1rem;
        background: transparent;
        border: none;
        color: #ccc;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
    }

    .demo-tab:hover {
        background: #353535;
        color: #fff;
    }

    .demo-tab.active {
        background: #1e1e1e;
        color: #ff3e00;
        border-bottom: 2px solid #ff3e00;
    }

    .demo-content {
        padding: 2rem;
    }

    .demo-content pre {
        margin: 0;
    }

    .demo-content code {
        color: #d4d4d4;
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        font-size: 0.95rem;
        line-height: 1.6;
    }

    /* Structure Section */
    .structure {
        padding: 80px 20px;
        background: #f8f9fa;
    }

    .structure-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        margin-top: 3rem;
    }

    .structure-tree {
        background: #1e1e1e;
        padding: 2rem;
        border-radius: 12px;
        overflow-x: auto;
    }

    .structure-tree code {
        color: #d4d4d4;
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        font-size: 0.9rem;
        line-height: 1.8;
    }

    .structure-explanation {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .explanation-item h4 {
        font-size: 1.25rem;
        margin: 0 0 0.5rem 0;
        color: #1a1a1a;
    }

    .explanation-item p {
        margin: 0;
        color: #666;
    }

    .explanation-item code {
        background: #e9ecef;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-size: 0.9rem;
    }

    /* Getting Started Section */
    .getting-started {
        padding: 80px 20px;
        background: white;
    }

    .steps {
        max-width: 800px;
        margin: 3rem auto 0;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .step {
        display: flex;
        gap: 1.5rem;
        align-items: start;
    }

    .step-number {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        background: #ff3e00;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 700;
    }

    .step-content {
        flex: 1;
    }

    .step-content h3 {
        margin: 0 0 0.5rem 0;
        color: #1a1a1a;
    }

    .step-content pre {
        background: #1e1e1e;
        padding: 1rem;
        border-radius: 8px;
        margin: 0.5rem 0;
        overflow-x: auto;
    }

    .step-content code {
        color: #d4d4d4;
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    }

    .step-note {
        margin: 0.5rem 0 0 0;
        color: #666;
        font-size: 0.95rem;
    }

    .step-note a {
        color: #ff3e00;
        text-decoration: none;
    }

    .step-note a:hover {
        text-decoration: underline;
    }

    /* Testing Section */
    .testing {
        padding: 80px 20px;
        background: #f8f9fa;
    }

    .testing-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
    }

    .testing-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .testing-card h3 {
        margin: 0 0 0.5rem 0;
        color: #1a1a1a;
    }

    .testing-card p {
        margin: 0 0 1rem 0;
        color: #666;
    }

    .testing-card pre {
        background: #1e1e1e;
        padding: 0.75rem;
        border-radius: 6px;
        margin: 0;
    }

    .testing-card code {
        color: #d4d4d4;
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        font-size: 0.9rem;
    }

    /* Modules Section */
    .modules {
        padding: 80px 20px;
        background: white;
    }

    .module-steps {
        max-width: 800px;
        margin: 3rem auto 0;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .module-step {
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 12px;
        border-left: 4px solid #ff3e00;
    }

    .module-step code {
        display: block;
        background: #1e1e1e;
        color: #d4d4d4;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 0.5rem;
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        font-size: 0.9rem;
        overflow-x: auto;
        white-space: pre;
    }

    .module-step p {
        margin: 0;
        color: #666;
    }

    /* Stripe Module Section */
    .stripe-module {
        padding: 80px 20px;
        background: #f8f9fa;
    }

    .stripe-content {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 3rem;
        margin-top: 3rem;
    }

    .stripe-overview h3,
    .stripe-examples h3 {
        font-size: 1.5rem;
        margin: 0 0 1.5rem 0;
        color: #1a1a1a;
    }

    .stripe-features {
        list-style: none;
        padding: 0;
        margin: 0 0 2rem 0;
    }

    .stripe-features li {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        color: #333;
        line-height: 1.6;
    }

    .check-icon {
        color: #22c55e;
        font-size: 1.25rem;
        font-weight: bold;
        flex-shrink: 0;
    }

    .docs-link {
        display: inline-block;
        color: #ff3e00;
        text-decoration: none;
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        transition: all 0.2s;
    }

    .docs-link:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .stripe-examples {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .code-example {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .code-label {
        background: #2d2d2d;
        color: #ccc;
        padding: 0.75rem 1.25rem;
        font-size: 0.9rem;
        border-bottom: 1px solid #404040;
    }

    .code-example pre {
        background: #1e1e1e;
        padding: 1.5rem;
        margin: 0;
        overflow-x: auto;
    }

    .code-example code {
        color: #d4d4d4;
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        font-size: 0.9rem;
        line-height: 1.6;
    }

    .demo-link {
        text-align: center;
        margin-top: 1rem;
    }

    /* CTA Section */
    .cta {
        padding: 80px 20px;
        background: linear-gradient(135deg, #ff3e00 0%, #ff8a00 100%);
        color: white;
        text-align: center;
    }

    .cta h2 {
        font-size: 2.5rem;
        margin: 0 0 1rem 0;
    }

    .cta p {
        font-size: 1.25rem;
        margin: 0 0 2rem 0;
        opacity: 0.95;
    }

    .cta-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .hero-title {
            font-size: 2.5rem;
        }

        .hero-subtitle {
            font-size: 1.125rem;
        }

        .section-title {
            font-size: 2rem;
        }

        .structure-container {
            grid-template-columns: 1fr;
        }

        .feature-grid,
        .testing-grid {
            grid-template-columns: 1fr;
        }

        .demo-tabs {
            flex-direction: column;
        }

        .step {
            flex-direction: column;
        }

        .stripe-content {
            grid-template-columns: 1fr;
        }
    }
</style>
