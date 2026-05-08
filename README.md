This project is about **me** learning how to plan **before a single line of code is written**, and how to architect **LLM systems** to build the best possible version of a project.

## Inspiration & Credits

The development workflow and planning-first approach used in this project were inspired by [JavaScript Mastery](https://www.youtube.com/@javascriptmastery) on YouTube. I learned this LLM-assisted architecture style coding from [his video](https://youtu.be/14RP8liACqo).


# Ghost AI

**Ghost AI** is a real-time collaborative system design workspace. Users describe a system in plain English, an AI agent maps it onto a shared canvas, collaborators refine the architecture, and the app generates a technical specification from the resulting graph.

## Tech Stack

- **Next.js** — full-stack React framework
- **Liveblocks** — real-time collaboration (shared canvas, presence, cursors)
- **React Flow** — canvas rendering for nodes and edges
- **Claude AI** — AI architecture generation and spec generation
- **Neon (PostgreSQL)** — project metadata and artifact storage

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Clerk (Auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=

# Database (Prisma / PostgreSQL)
DATABASE_URL=

# Liveblocks
LIVEBLOCKS_PUBLIC_KEY=
LIVEBLOCKS_SECRET_KEY=
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
