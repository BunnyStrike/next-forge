# Mobile App

A cross-platform mobile application built with Expo SDK 52 and React Native 0.76.

## Features

- **Expo SDK 52**: Latest Expo features with React Native 0.76
- **New Architecture**: Enabled by default for better performance
- **NativeWind**: Tailwind CSS for React Native styling
- **Expo Router**: File-based routing system
- **TypeScript**: Full type safety
- **Design System**: Shared components with web and desktop apps

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
cd apps/mobile
pnpm install
```

### Development

```bash
# Start the development server
pnpm start

# Run on iOS Simulator
pnpm ios

# Run on Android Emulator
pnpm android

# Run on web
pnpm web
```

### Building

```bash
# Create development build
npx expo run:ios
npx expo run:android

# Create production build with EAS
pnpm build:ios
pnpm build:android
```

## Project Structure

```
apps/mobile/
├── app/                    # App screens (Expo Router)
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home screen
│   │   └── explore.tsx    # Explore screen
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 screen
├── assets/                # Static assets
├── components/            # Reusable components
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
├── metro.config.js       # Metro bundler configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── global.css           # Global styles
```

## Configuration

### Expo Configuration (`app.json`)

- **New Architecture**: Enabled by default
- **Bundle Identifier**: `com.nextforge.mobile`
- **Expo Router**: Configured for file-based routing
- **Typed Routes**: Enabled for better TypeScript support

### NativeWind Setup

The app uses NativeWind for styling, which allows you to use Tailwind CSS classes in React Native components.

```tsx
import { View, Text } from 'react-native'

export default function MyComponent() {
  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Text className='text-2xl font-bold text-gray-800'>
        Hello NativeWind!
      </Text>
    </View>
  )
}
```

## Shared Components

The mobile app can use components from the `@repo/design-system` package that are compatible with React Native.

## API Integration

The mobile app communicates with the API app through REST endpoints:

- `GET /api/mobile/pages` - Fetch pages
- `GET /api/mobile/user` - Get current user
- `GET /api/mobile/organizations` - Get organizations

## Deployment

### Development Builds

For development, you can create development builds that include your custom native code:

```bash
npx expo run:ios
npx expo run:android
```

### Production Builds

For production deployment, use EAS Build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **iOS Simulator not found**: Make sure Xcode is installed
3. **Android emulator issues**: Ensure Android Studio and emulator are set up correctly

### New Architecture

If you encounter issues with the New Architecture, you can temporarily disable it by setting `newArchEnabled: false` in `app.json`, but this is not recommended for new projects.
