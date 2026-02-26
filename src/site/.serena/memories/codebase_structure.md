# Codebase Structure

```
svelte-starter/
├── src/
│   ├── routes/              # SvelteKit file-based routing
│   │   ├── +page.svelte    # Homepage
│   │   ├── +layout.svelte  # Root layout
│   │   └── *.spec.ts       # Route-level tests
│   ├── lib/                 # Shared library code
│   │   ├── index.ts        # Public API exports
│   │   └── server/         # Server-only code
│   ├── app.html            # HTML template
│   └── app.d.ts            # TypeScript declarations
│
├── static/                  # Static assets (served as-is)
├── e2e/                     # Playwright e2e tests
├── tests/                   # Additional test files
│
├── .beads/                  # bd issue tracker data
├── .claude/                 # Claude Code configuration
├── .serena/                 # Serena agent data
│
├── svelte.config.js         # SvelteKit configuration
├── vite.config.ts          # Vite + Vitest config
├── tsconfig.json           # TypeScript config (strict mode)
├── playwright.config.ts    # Playwright e2e config
├── eslint.config.js        # ESLint configuration
├── .prettierrc             # Prettier configuration
└── package.json            # Dependencies and scripts
```

## Key Directories

- **src/routes/**: Add new pages/routes here (file-based routing)
- **src/lib/**: Shared components, utilities, types
- **src/lib/server/**: Server-only code (not bundled for client)
- **static/**: favicon, images, fonts (publicly accessible)

## Generated Directories (gitignored)

- **.svelte-kit/**: SvelteKit build output
- **node_modules/**: npm dependencies
