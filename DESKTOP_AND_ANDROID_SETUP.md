# Rate Board Desktop + Android Setup

## What We Did

This project now runs in three practical environments:

- web browser through Next.js
- Windows desktop app through Electron
- Android app through Capacitor

The Android and desktop builds use a static export from Next.js:

- `Next.js output: "export"`
- Electron loads files from `out/`
- Capacitor syncs the same `out/` build into `android/`

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

- static frontend build is generated in `out/`

### 2. Desktop app with Electron

Files:

- `electron/main.ts`
- `electron/preload.ts`
- generated runtime files: `electron/main.js`, `electron/preload.js`

What they do:

- open the app in Electron
- load local exported files in production
- load `http://localhost:3000` in Electron dev mode
- expose secure IPC APIs for auth, rate-board access, and desktop device ID
- keep `contextIsolation: true` and avoid direct Node access in the renderer
- load `.env.local` and `.env` explicitly in the Electron main process using `dotenv`

Desktop build config is inside:

- `package.json`

### 3. Android app with Capacitor

Files:

- `capacitor.config.ts`
- `android/`

What they do:

- use `out/` as the mobile app web assets
- sync exported files into the Android project
- allow opening the Android project in Android Studio
- persist Android device IDs with `@capacitor/preferences`

### 4. Cross-platform device ID layer

Files:

- `src/lib/device/getDeviceId.ts`
- `src/lib/device/platform.ts`
- `src/lib/fingerprint.ts`
- `src/hooks/auth/useDeviceId.ts`
- `src/utils/identifyDevice.ts`

What they do:

- keep the existing web fingerprint flow intact
- use fingerprint on web
- use UUID + `electron-store` on Electron
- use UUID + `@capacitor/preferences` on Android
- expose shared helpers like `getDeviceId()` and `useDeviceId()`

### 5. Runtime API layer

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
- use fetch-based Next.js API routes on normal web
- keep the auth flow shared across all runtimes

## Environment Handling

- Web and the Next.js renderer continue using:
  - `process.env.NEXT_PUBLIC_BASE_API_URL`
  - `process.env.NEXT_PUBLIC_SECRET_KEY`
- These `NEXT_PUBLIC_*` values are injected by Next.js at build time for frontend code
- Capacitor does not load `.env` at runtime
- Electron main process is separate from Next.js, so it loads `.env.local` and `.env` itself with `dotenv`
- Desktop packaging includes `.env.local` and `.env` in the Electron build files list

## Registration Notes

- Android registration now shortens the detected device name before sending it to the backend
- This avoids SQL truncation errors caused by long model strings like `CPH2781 Build/...`
- If you change registration fields or device detection logic, rebuild Android before testing again

## Important Scripts

From `package.json`:

```json
{
  "dev": "next dev",
  "dev:electron": "npm run build:electron:ts && concurrently -k \"next dev\" \"wait-on tcp:3000 && cross-env ELECTRON_DEV_SERVER_URL=http://localhost:3000 electron .\"",
  "build": "next build",
  "build:web": "next build",
  "build:electron:ts": "tsc -p electron/tsconfig.json",
  "build:static": "node scripts/build-static.mjs",
  "build:desktop": "npm run build:electron:ts && npm run build:static && electron-builder --win nsis",
  "build:android": "npm run build:static && npx cap sync android",
  "cap:sync": "npx cap sync",
  "cap:open:android": "npx cap open android",
  "start": "next start",
  "start:static": "serve out"
}
```

## Folder Map

```text
rate-board/
|- android/
|- electron/
|  |- main.ts
|  |- preload.ts
|  |- main.js
|  `- preload.js
|- out/
|- release/
|- capacitor.config.ts
|- next.config.ts
|- package.json
`- src/
   |- app/
   |- hooks/
   |- lib/
   |- types/
   `- utils/
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
- `npm run build:electron:ts`
- `npm run build:desktop`
- `npm run build:android`

## Notes

- Desktop installer is generated successfully.
- Android project is created and synced successfully.
- Electron currently uses `src/app/favicon.ico` as app icon.
- `build:static` temporarily moves `middleware.ts` and `src/app/api/**` out of the way during static export, then restores them.
