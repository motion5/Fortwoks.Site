import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
    it('should render hero section with title', async () => {
        render(Page);

        const heading = page.getByRole('heading', { level: 1, name: /SvelteKit Starter/i });
        await expect.element(heading).toBeInTheDocument();
    });

    it('should render feature cards', async () => {
        render(Page);

        const featuresHeading = page.getByRole('heading', { level: 2, name: /Features/i });
        await expect.element(featuresHeading).toBeInTheDocument();
    });

    it('should render getting started section', async () => {
        render(Page);

        const gettingStartedHeading = page.getByRole('heading', {
            level: 2,
            name: /Getting Started/i
        });
        await expect.element(gettingStartedHeading).toBeInTheDocument();
    });
});
