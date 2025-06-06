# Next-Forge Project Documentation

## Overview
This is a monorepo containing multiple applications and shared packages built with modern web and mobile technologies.

## Applications

### Web App (`apps/app`)
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
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

### Admin (`packages/admin`)
- **Purpose**: Content and collection management system
- **Features**:
  - Sliding sidebar interface from the right
  - Content management for page editing
  - Collection management for data structures
  - Type-safe with full TypeScript support
  - Integration with auth and design system packages
  - Responsive design for all screen sizes

## Database Schema

The project uses Prisma with the following main entities:

### User
- `id`: String (primary key)
- `name`: String (nullable)
- `email`: String (unique)
- `image`: String (nullable)
- `createdAt`: DateTime
- `updatedAt`: DateTime

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

## Development

### Prerequisites
- Node.js 18+
- pnpm (package manager)
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

3. Run database migrations:
   ```bash
   pnpm migrate
   ```

4. Start development servers:
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
- **Neon**: PostgreSQL database
- **Better Auth**: Authentication system

### Development Tools
- **TypeScript**: Type safety
- **Turbo**: Monorepo build system
- **pnpm**: Package manager
- **Biome**: Linting and formatting
- **Vitest**: Testing framework

## Deployment

### Web App
- Deploy to Vercel, Netlify, or any Node.js hosting platform

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