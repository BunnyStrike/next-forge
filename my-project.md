# Next-Forge Project Documentation

## Overview

This is a monorepo containing multiple applications and shared packages built with modern web and mobile technologies.

## Applications

### Web App (`apps/app`)

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Authentication**: Better Auth (migrated from Clerk)
- **Features**: Server-side rendering, authentication, database integration
- **Port**: 3000

### Mobile App (`apps/mobile`)

- **Framework**: Expo SDK 52 with React Native 0.76
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Features**: Cross-platform mobile app (iOS/Android), Expo Router for navigation
- **New Architecture**: Enabled by default for better performance

### Desktop App (`apps/desktop`)

- **Framework**: Electron with Next.js 15
- **Styling**: Tailwind CSS 4
- **Features**: Cross-platform desktop application (Windows, macOS, Linux)
- **Port**: 3001 (development)

### API App (`apps/api`)

- **Framework**: Next.js API routes
- **Features**: RESTful API endpoints for mobile and desktop apps
- **Port**: 3002

## Packages

### API Actions (`packages/api-actions`)

- **Purpose**: RSC-compatible queries and actions
- **Features**:
  - Server-side data fetching functions
  - Type-safe API responses
  - Error handling
  - Zod validation for inputs

### Design System (`packages/design-system`)

- **Purpose**: Shared UI components
- **Features**:
  - Compatible with web, mobile, and desktop apps
  - Tailwind CSS styling
  - TypeScript support

### Authentication (`packages/auth`)

- **Purpose**: Better Auth implementation
- **Features**:
  - Email/password authentication
  - Social providers (Google, GitHub)
  - Session management
  - Role-based access control
  - Type-safe with full TypeScript support
  - Edge-compatible middleware
  - Unified user model
  - Cost-effective ($0 vs Clerk pricing)

### Admin (`packages/admin`)

- **Purpose**: Content and collection management system
- **Features**:
  - Sliding sidebar interface from the right
  - Content management for page editing
  - Collection management for data structures
  - Type-safe with full TypeScript support
  - Integration with auth and design system packages
  - Responsive design for all screen sizes

### Uploads (`packages/uploads`)

- **Purpose**: Comprehensive file upload system
- **Features**:
  - Drag & drop interface with visual feedback
  - Real-time upload progress tracking
  - Image optimization, resizing, and thumbnail generation
  - Cloud storage integration (S3, Cloudinary, Vercel Blob)
  - File validation (type, size, quantity)
  - Rich file previews with metadata display
  - TypeScript support with full type safety
  - Customizable UI components
  - Support for images, documents, media, and archives
  - Progress indicators and error handling
  - Batch upload capabilities

## Database Schema

The project uses Prisma with the following main entities:

### User (Better Auth Unified Model)

- `id`: String (primary key, UUID)
- `email`: String (unique, required)
- `name`: String (default: "")
- `image`: String (nullable)
- `emailVerified`: Boolean (default: false)
- `twoFactorEnabled`: Boolean (default: false)
- `createdAt`: DateTime (auto-generated)
- `updatedAt`: DateTime (auto-updated)
- `tenantId`: String (nullable, foreign key)

**Relations:**
- `accounts`: Account[] (Better Auth accounts)
- `sessions`: Session[] (Better Auth sessions)
- `tenant`: Tenant (optional)
- `tenants`: Tenant[] (many-to-many)
- `roles`: UserRole[]
- `customers`: Customer[]
- `profile`: Profile (one-to-one)
- `notifications`: Notification[]
- `notificationPreferences`: NotificationPreferences
- `notificationDeliveries`: NotificationDelivery[]

### Session (Better Auth)

- `id`: String (primary key)
- `expiresAt`: DateTime (required)
- `token`: String (unique, required)
- `createdAt`: DateTime (auto-generated)
- `updatedAt`: DateTime (auto-updated)
- `ipAddress`: String (nullable)
- `userAgent`: String (nullable)
- `userId`: String (foreign key, required)

**Relations:**
- `user`: User (belongs to)

### Account (Better Auth)

- `id`: String (primary key, CUID)
- `accountId`: String (required)
- `providerId`: String (required)
- `userId`: String (foreign key, required)
- `accessToken`: String (nullable)
- `refreshToken`: String (nullable)
- `idToken`: String (nullable)
- `accessTokenExpiresAt`: DateTime (nullable)
- `refreshTokenExpiresAt`: DateTime (nullable)
- `scope`: String (nullable)
- `password`: String (nullable, for email/password auth)
- `createdAt`: DateTime (auto-generated)
- `updatedAt`: DateTime (auto-updated)

**Relations:**
- `user`: User (belongs to)

**Constraints:**
- Unique combination of `providerId` and `accountId`

### Verification (Better Auth)

- `id`: String (primary key, CUID)
- `identifier`: String (required)
- `value`: String (required)
- `expiresAt`: DateTime (required)
- `createdAt`: DateTime (auto-generated)
- `updatedAt`: DateTime (auto-updated)

**Constraints:**
- Unique combination of `identifier` and `value`

### Organization

- `id`: String (primary key)
- `name`: String
- `slug`: String (unique)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Page

- `id`: String (primary key)
- `name`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

### OrganizationMembership

- `id`: String (primary key)
- `role`: String
- `userId`: String (foreign key)
- `organizationId`: String (foreign key)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Authentication System

### Better Auth Configuration

The authentication system uses Better Auth with the following features:

- **Email/Password Authentication**: Built-in support with optional email verification
- **Social Providers**: Google and GitHub OAuth integration
- **Session Management**: Cookie-based sessions with 7-day expiration
- **Role-Based Access**: Admin plugin with configurable roles
- **Database Integration**: Prisma adapter with PostgreSQL
- **Edge Compatibility**: Middleware works with Vercel Edge Runtime
- **TypeScript Support**: Full type safety throughout

### Environment Variables

Required environment variables for Better Auth:

```bash
# Better Auth Core
BETTER_AUTH_SECRET="your-32-character-secret-key"
BETTER_AUTH_URL="http://localhost:3000" # or your domain
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/database"

# Social Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"  
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### API Routes

- `GET/POST /api/auth/[...all]` - Better Auth API handler
- All authentication flows handled by Better Auth

### Migration from Clerk

The project has been successfully migrated from Clerk to Better Auth with the following benefits:

- **Cost Reduction**: $0 vs Clerk's pricing
- **Full Control**: Own authentication logic and user data
- **Performance**: No external API calls
- **Privacy**: User data stays in your database
- **Customization**: Unlimited customization options
- **Edge Compatibility**: Works with edge runtimes

## Development

### Prerequisites

- Node.js 18+
- pnpm (package manager)
- PostgreSQL database
- Expo CLI (for mobile development)
- Electron (for desktop development)

### Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Configure database and authentication:

   ```bash
   # Add to .env.local files
   BETTER_AUTH_SECRET="your-32-character-secret"
   DATABASE_URL="your-database-url"
   ```

4. Run database migrations:

   ```bash
   pnpm migrate
   ```

5. Start development servers:

   ```bash
   # All apps
   pnpm dev

   # Individual apps
   pnpm --filter app dev          # Web app
   pnpm --filter mobile dev       # Mobile app
   pnpm --filter desktop dev      # Desktop app
   pnpm --filter api dev          # API app
   ```

### Mobile Development

The mobile app uses Expo SDK 52 with the New Architecture enabled by default. To run on different platforms:

```bash
cd apps/mobile

# iOS Simulator
pnpm ios

# Android Emulator
pnpm android

# Web
pnpm web

# Physical device (requires Expo Go or development build)
pnpm start
```

### Desktop Development

The desktop app uses Electron with Next.js:

```bash
cd apps/desktop

# Development mode
pnpm dev

# Build for production
pnpm build:electron
```

## API Endpoints

### Authentication Routes

- `POST /api/auth/sign-in` - Email/password sign in
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/auth/social/*` - Social provider authentication

### Mobile API Routes (`/api/mobile/`)

- `GET /api/mobile/pages` - Get all pages
- `GET /api/mobile/user` - Get current user
- `GET /api/mobile/organizations` - Get user organizations

### Desktop API Routes

Desktop app can use the same API endpoints as the mobile app or direct database access through the API actions package.

## Shared Components

The design system package provides components that work across all platforms:

- **Web**: Standard React components with Tailwind CSS
- **Mobile**: React Native compatible components with NativeWind
- **Desktop**: Same as web (Electron renders web technologies)

## Technology Stack

### Frontend

- **React 19**: Latest React features
- **Next.js 15**: Full-stack React framework
- **Expo SDK 52**: React Native development platform
- **Electron**: Desktop app framework
- **Tailwind CSS 4**: Utility-first CSS framework
- **NativeWind**: Tailwind CSS for React Native

### Backend

- **Next.js API Routes**: Serverless API endpoints
- **Prisma**: Database ORM
- **PostgreSQL**: Database (via Neon or other providers)
- **Better Auth**: Self-hosted authentication system

### Development Tools

- **TypeScript**: Type safety
- **Turbo**: Monorepo build system
- **pnpm**: Package manager
- **Biome**: Linting and formatting
- **Vitest**: Testing framework

## Deployment

### Web App

- Deploy to Vercel, Netlify, or any Node.js hosting platform
- Ensure `runtime = "nodejs"` for Better Auth compatibility

### Mobile App

- **iOS**: Build and deploy to App Store using EAS Build
- **Android**: Build and deploy to Google Play Store using EAS Build

### Desktop App

- **Windows**: Build .exe installer
- **macOS**: Build .dmg installer
- **Linux**: Build AppImage

### API

- Deploy alongside web app or as separate service

## Recent Updates

### Migrated from Clerk to Better Auth

- Complete authentication system migration
- New database schema with Better Auth models
- Updated middleware for Better Auth compatibility
- Created new sign-in/sign-up pages
- Environment variable updates
- Cost reduction to $0
- Full control over authentication logic

### Added Mobile App (Expo SDK 52)

- New React Native app with NativeWind styling
- Expo Router for navigation
- New Architecture enabled for better performance
- Integration with shared design system

### Added Desktop App (Electron)

- Cross-platform desktop application
- Next.js 15 with React 19
- Tailwind CSS 4 styling
- Shared components with web app

### Added API Actions Package

- RSC-compatible server functions
- Type-safe API responses
- Centralized data fetching logic
- Zod validation for inputs

### Enhanced API App

- New endpoints for mobile and desktop apps
- Integration with API actions package
- Improved error handling
