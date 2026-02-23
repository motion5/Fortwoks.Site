// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }

    interface ImportMetaEnv {
        // Server-side environment variables
        STRIPE_SECRET_KEY: string;
        STRIPE_WEBHOOK_SECRET: string;

        // Public environment variables
        PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    }
}

export {};
