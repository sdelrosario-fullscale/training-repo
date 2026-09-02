# Training Repo

A React Native baseline with strict TypeScript, Zustand for local state, TanStack Query for server state, Jest and React Native Testing Library for tests, and ESLint and Prettier for code quality.

## Requirements

- Node.js 24.3 or newer (Node.js 22.13 or newer is also supported)
- npm 10 or newer
- Android Studio and the Android SDK for Android development
- Xcode, Ruby, Bundler, and CocoaPods for iOS development

## Setup

```sh
npm ci
```

Start the workforce mock API in a separate terminal:

```sh
npm run api
curl http://localhost:3001/shifts
```

The configured routes also expose the supplied `swapRequests` collection at `/swap-requests`.

The default API URL is `http://localhost:3001` for iOS and `http://10.0.2.2:3001` for the Android emulator. Use `createApiClient` with another base URL when testing on a physical device.

For iOS, install the native dependencies once after cloning and whenever they change:

```sh
bundle install
cd ios && bundle exec pod install && cd ..
```

## Run

Start Metro in one terminal:

```sh
npm start
```

Then launch a platform from another terminal:

```sh
npm run ios
npm run android
```

## Quality checks

```sh
npm run validate
```

The validation command runs strict type checking, ESLint, Prettier verification, and the Jest test suite. The same checks run in GitHub Actions for every pull request to `main`.

## Project structure

```text
src/
├── api/        Typed API client, workforce models, and request functions
├── providers/  Application-wide providers
├── screens/    Screen components
└── store/      Zustand stores
```

See [TypeScript Migration Strategy](ts-migration-strategy.md) for the incremental approach to adopting strict typing in an existing JavaScript codebase.

## Contribution workflow

`main` is protected. Create a branch, open a pull request, wait for the `quality` check and an approving review, then merge. Direct pushes, force-pushes, branch deletion, and self-approval are not allowed.
