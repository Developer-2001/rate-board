# Rate Board Desktop + Android Setup

## What We Did

This project was converted from a standard Next.js app into:

- a Windows desktop app using Electron
- an Android app using Capacitor

The app now builds as a static export with:

- `Next.js output: "export"`
- Electron loading local files from `out/`
- Capacitor using the same exported `out/` build for Android

## Main Changes

### 1. Static Next.js build

File:

- `next.config.ts`

Important config:

```ts
output: "export"
trailingSlash: true
images: { unoptimized: true }
```

Result:

- static web build is generated in `out/`

### 2. Desktop app with Electron

Files:

- `electron/main.js`
- `electron/preload.js`

What they do:

- open the app in Electron
- load local exported files in production
- load `http://localhost:3000` in Electron dev mode
- expose secure IPC APIs for auth and rate-board requests

Desktop build config is inside:

- `package.json`

### 3. Android app with Capacitor

Files:

- `capacitor.config.ts`
- `android/`

What they do:

- use `out/` as the mobile app web assets
- sync exported files into Android project
- allow opening the Android project in Android Studio

### 4. Runtime API layer

Files:

- `src/utils/authApi.ts`
- `src/utils/rateBoardApi.ts`
- `src/utils/platform.ts`
- `src/utils/authMessages.ts`
- `src/types/runtime.d.ts`

What they do:

- detect Electron / Android / browser runtime
- use Electron IPC on desktop
- use Capacitor native HTTP on Android
- use direct HTTP/static-friendly requests instead of Next.js API routes

## Important Removed Server-Side Parts

These were removed because static export does not support them:

- `middleware.ts`
- `src/app/api/**`

## Important Scripts

From `package.json`:

```json
{
  "dev": "next dev",
  "dev:electron": "concurrently -k \"next dev\" \"wait-on tcp:3000 && cross-env ELECTRON_DEV_SERVER_URL=http://localhost:3000 electron .\"",
  "build": "next build",
  "build:web": "next build",
  "build:desktop": "npm run build:web && electron-builder --win nsis",
  "build:android": "npm run build:web && npx cap sync android",
  "cap:sync": "npx cap sync",
  "cap:open:android": "npx cap open android",
  "start": "serve out"
}
```

## Folder Map

```text
rate-board/
├─ android/
├─ electron/
│  ├─ main.js
│  └─ preload.js
├─ out/
├─ release/
├─ capacitor.config.ts
├─ next.config.ts
├─ package.json
└─ src/
   ├─ hooks/
   ├─ types/
   └─ utils/
```

## Commands To Use

### Install dependencies

```powershell
npm install
```

### Run normal Next.js dev

```powershell
npm run dev
```

### Run Electron dev

```powershell
npm run dev:electron
```

### Build static web export

```powershell
npm run build:web
```

### Build Windows `.exe`

```powershell
npm run build:desktop
```

Output:

```text
release\Rate Board-0.1.0-Setup.exe
```

### Add Android platform

```powershell
npx cap add android
```

### Build and sync Android

```powershell
npm run build:android
```

### Open Android Studio

```powershell
npm run cap:open:android
```

## Android APK Build

In Android Studio:

1. Open `android/`
2. Click `Build > Generate Signed Bundle / APK`
3. Choose `APK`
4. Select or create keystore
5. Choose `release`
6. Finish

APK output:

```text
android\app\build\outputs\apk\release\app-release.apk
```

## Verified

These were already run successfully:

- `npm run lint`
- `npm run build`
- `npm run build:desktop`
- `npx cap add android`
- `npm run build:android`

## Notes

- Desktop installer is generated successfully.
- Android project is created and synced successfully.
- Electron currently uses `src/app/favicon.ico` as app icon.
- Static export means no Next.js API routes and no middleware.
