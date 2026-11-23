# blog.kzhrk.com

Personal blog built with TanStack Start and deployed to Cloudflare Workers.

## Tech Stack

- **Framework**: TanStack Start (React 19, Vite)
- **Styling**: CSS Modules + PostCSS (autoprefixer)
- **Deployment**: Cloudflare Workers (static assets + Worker, via @cloudflare/vite-plugin)
- **Content**: Markdown files with gray-matter frontmatter
- **Lint / Format**: oxlint, oxfmt
- **Type check**: TypeScript 7
- **Test**: Vitest 5

All pages are prerendered at build time and served as static assets. The Worker handles 404 pages and the data requests made during client-side navigation.

## Setup

```bash
pnpm install
```

## Development

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Build

Build the application and prerender all pages into `dist/`:

```bash
pnpm build
```

## Preview

Preview the production build locally:

```bash
pnpm preview
```

## Lint, Format, Type check, Test

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
```

## Deploy

Deploy to Cloudflare Workers:

```bash
pnpm deploy
```

### Environment Variables

Set the following environment variables in `.env` or GitHub Secrets:

| Variable | Description |
|----------|-------------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Workers permissions |

## Project Structure

```
├── posts/              # Markdown blog posts
├── src/
│   ├── routes/         # TanStack Router file routes (__root, index, posts/$, server routes)
│   ├── pages/          # Page components and their CSS Modules
│   ├── components/     # React components and their CSS Modules
│   ├── lib/            # Utility functions (posts, markdown, chatbot)
│   ├── styles/         # Design tokens, reset, shared CSS Modules
│   └── types/          # TypeScript type definitions
├── docs/               # Implementation plans
├── vite.config.ts      # Vite / TanStack Start configuration
└── wrangler.jsonc      # Cloudflare Workers configuration
```
