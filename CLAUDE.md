# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next Forge is a production-grade monorepo boilerplate using:
- **Monorepo**: Turborepo with pnpm workspaces
- **Frontend**: Next.js 15.3.3, React 19.1.0, Tailwind CSS 4
- **Backend**: Next.js API routes, Prisma ORM, Neon PostgreSQL
- **Mobile**: React Native 0.76 with Expo SDK 52
- **Desktop**: Electron with Next.js
- **TypeScript**: Strict mode enabled

## Essential Commands

```bash
# Development
pnpm dev              # Start all development servers
pnpm dev:app          # Start main app only (port 3000)
pnpm dev:api          # Start API only (port 3002)
pnpm dev:web          # Start marketing site (port 3001)

# Building & Testing
pnpm build            # Build all packages and apps
pnpm test             # Run all tests with Vitest
pnpm test:watch       # Run tests in watch mode
pnpm test <pattern>   # Run specific test files

# Database
pnpm migrate          # Run Prisma migrations
pnpm db:push          # Push schema changes without migration
pnpm db:studio        # Open Prisma Studio

# Code Quality
pnpm lint             # Lint all code
pnpm format           # Format with Prettier
pnpm typecheck        # Run TypeScript type checking

# Mobile Development
cd apps/mobile
pnpm start            # Start Expo development server
pnpm ios              # Run on iOS simulator
pnpm android          # Run on Android emulator
```

## Architecture & Code Organization

### Applications (`apps/`)
- **app**: Main SaaS application (Next.js App Router, port 3000)
- **api**: REST API backend (Next.js API routes, port 3002)
- **web**: Marketing/landing pages
- **mobile**: React Native app using Expo
- **desktop**: Electron desktop application
- **docs**: Documentation site (Mintlify)
- **storybook**: Component documentation
- **studio**: Content management interface

### Key Packages (`packages/`)
- **@repo/design-system**: Shared UI components (shadcn/ui based)
- **@repo/database**: Prisma schema and client
- **@repo/auth**: Better Auth implementation
- **@repo/api-actions**: Server actions for RSC
- **@repo/uploads**: File upload handling
- **@repo/payments**: Stripe integration

### Important Patterns

1. **Server Components & Actions**: Use React Server Components by default. Client components require 'use client' directive.

2. **API Responses**: Always validate with Zod:
```typescript
import { z } from 'zod';
const schema = z.object({ /* ... */ });
return NextResponse.json(schema.parse(data));
```

3. **Database Queries**: Use Prisma client from @repo/database:
```typescript
import { database } from '@repo/database';
const data = await database.user.findMany();
```

4. **Authentication**: Use Better Auth hooks and utilities:
```typescript
import { auth } from '@repo/auth/server';
const session = await auth();
```

5. **Environment Variables**: 
- Development: `.env.local` files
- Production: Set in deployment platform
- Use `NEXT_PUBLIC_` prefix for client-side vars

### Testing Strategy

- Test files: `*.test.ts`, `*.test.tsx` 
- Unit tests for utilities and hooks
- Component tests with Testing Library
- Run specific tests: `pnpm test path/to/test`

### Mobile Development Notes

- NativeWind for styling (Tailwind in React Native)
- Expo Router for navigation
- Share code via workspace packages
- Test on simulators: `pnpm ios` or `pnpm android`

### Common Gotchas

1. **Turbo Cache**: Clear with `pnpm clean` if builds are stale
2. **TypeScript Paths**: Use workspace protocol (`workspace:*`) for internal packages
3. **Environment Variables**: Must restart dev server after changes
4. **Database Changes**: Run `pnpm migrate` after schema modifications
5. **Mobile Assets**: Place in `apps/mobile/assets/`

### Deployment

- **Web Apps**: Deploy to Vercel (automatic with push to main)
- **Database**: Neon PostgreSQL (connection string in env)
- **Mobile**: Build with EAS Build (`eas build`)
- **Desktop**: Package with `pnpm package:desktop`