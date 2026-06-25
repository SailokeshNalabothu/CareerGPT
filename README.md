# CareerGPT

CareerGPT is an AI-powered Global Career Intelligence Platform designed to automatically discover, verify, parse, and match job listings from various career pages with intelligent search and recommendations.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (via Prisma ORM)
- **Caching & Queues**: Redis & BullMQ
- **AI Engine**: Google Gemini API & Embeddings
- **Monorepo Manager**: Turborepo & pnpm

---

## Folder Structure
```
career-platform/
├── apps/
│   ├── frontend/         # Next.js App Router UI
│   └── backend/          # Express.js REST API Gateway
└── packages/
    ├── database/         # Prisma Schema & Database client exporter
    ├── shared/           # Zod validation schemas & shared TypeScript types
    └── auth/             # Helper utilities for JWT & OAuth validation
```

---

## Local Setup & Development

### 1. Prerequisites
Ensure you have the following installed on your machine:
- Node.js (v20+ LTS)
- pnpm (Run `npm install -g pnpm`)
- Docker Desktop (Running for local Redis and MongoDB)

### 2. Setup Environment
Copy `.env.example` to `.env` in the root (this is already initialized for you with local defaults):
```bash
cp .env.example .env
```

### 3. Spin up Services (MongoDB & Redis)
In an external terminal (where Docker is installed and running), run:
```bash
docker compose up -d
```
This starts MongoDB (as a single-node replica set `rs0` required by Prisma) and Redis.

### 4. Install Dependencies
Run the following from the root directory:
```bash
pnpm install
```

### 5. Generate & Push Database Schema
```bash
pnpm db:generate
pnpm db:push
```

### 6. Run the Project
Start all applications (Frontend + Backend) concurrently in development mode:
```bash
pnpm dev
```
- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:3000`
