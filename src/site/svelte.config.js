import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: '404.html',
            strict: false
        }),
        paths: {
            base: dev ? '' : '/Fortwoks.Site'
        },
        prerender: {
            handleHttpError: 'warn'
        }
    }
};

export default config;
