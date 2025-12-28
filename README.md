# blog.kzhrk.com

Personal blog built with Next.js and deployed to Cloudflare Workers.

## Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Workers + KV (via @opennextjs/cloudflare)
- **Content**: Markdown files with gray-matter frontmatter

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

Build the application for production:

```bash
pnpm build
```

## Preview

Preview the production build locally with Cloudflare Workers:

```bash
pnpm preview
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
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   ├── lib/            # Utility functions (posts, markdown)
│   └── types/          # TypeScript type definitions
├── open-next.config.ts # OpenNext configuration for Cloudflare
└── wrangler.jsonc      # Cloudflare Workers configuration
```
