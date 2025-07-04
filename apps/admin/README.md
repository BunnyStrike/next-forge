# Admin Dashboard

A comprehensive admin interface for managing your Next-Forge application.

## Features

- **User Management**: Manage users, roles, and permissions
- **Content Management**: Create, edit, and publish content
- **Analytics Dashboard**: View detailed analytics and reports
- **System Settings**: Configure system-wide settings
- **Database Management**: Manage database and migrations
- **Webhook Configuration**: Set up webhooks and integrations
- **Community Management**: Manage forums and community features
- **Security Monitoring**: Security settings and monitoring

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3003](http://localhost:3003) in your browser.

## Development

The admin app runs on port 3003 by default and is built with:

- **Next.js 15** with React 19
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Design System** components
- **Authentication** with Better Auth
- **Database** integration with Prisma

## Architecture

- `app/` - Next.js app router pages and layouts
- `components/` - Admin-specific components
- `lib/` - Utility functions and configurations
- `styles/` - Global styles and Tailwind imports

## Authentication

The admin app requires authentication and uses role-based access control (RBAC) to restrict access to administrative features.

## API Integration

The admin app communicates with the API app (`apps/api`) and uses shared packages for database access, authentication, and other core functionality. 