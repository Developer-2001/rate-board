# Rate Board Project Context

Last reviewed: 2026-06-15

## Purpose

Rate Board is a Paras Infotech live jewellery-rate display app. It is built from one Next.js codebase and is intended to ship in three environments:

- Web app: normal Next.js browser deployment.
- Windows desktop app: Electron installer/exe.
- Android app/APK: Capacitor Android wrapper.

The main user-facing experience is a full-screen rate board for jewellery counters or displays. It authenticates a client by Corporate ID, verifies/registers the current device, then shows live gold and silver sale/purchase rates.

## Current Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Electron 37 for Windows desktop
- Capacitor 7 for Android
- CryptoJS for encrypted browser localStorage
- `electron-store` for persistent desktop device ID
- `@capacitor/preferences` for persistent Android device ID
- `@capacitor/screen-orientation` for Android landscape locking
- `@capacitor/core` `CapacitorHttp` for native Android HTTP

## Important Scripts

```powershell
npm run dev
npm run dev:electron
npm run build
npm run build:web
npm run build:static
npm run build:desktop
npm run build:android
npm run cap:sync
npm run cap:open:android
npm run lint
```

Key meanings:

- `dev`: runs Next.js dev server.
- `dev:electron`: compiles Electron TypeScript, starts Next dev, waits for port 3000, then opens Electron.
- `build` / `build:web`: normal Next.js build.
- `build:static`: runs `scripts/build-static.mjs`, temporarily moves middleware and API routes away, sets `NEXT_OUTPUT_MODE=export`, and generates `out/`.
- `build:desktop`: compiles Electron, builds static export, then runs `electron-builder --win nsis`.
- `build:android`: builds static export and syncs `out/` into the Android Capacitor project.

## Runtime Architecture

The app uses one frontend code path with runtime-specific API adapters.

### Web

- Runs Next.js with API routes under `src/app/api`.
- Browser calls internal API routes with `fetch`.
- Bearer token is stored in an HTTP-only cookie named `bearerToken`.
- Auth/session metadata is encrypted into browser `localStorage` through `src/utils/authStorage.ts`.

### Electron Desktop

- Electron entry: `electron/main.ts`.
- Preload bridge: `electron/preload.ts`.
- Production loads the static export from `out/` through a custom secure `app://-/` protocol.
- Dev loads `ELECTRON_DEV_SERVER_URL`, normally `http://localhost:3000`.
- Electron main process loads `.env.local` and `.env` itself with `dotenv`.
- Renderer calls desktop APIs through `window.desktopApi` IPC.
- Desktop device ID is persisted in `electron-store` under store name `rate-board-device`.
- Desktop build output is configured in `package.json` using `electron-builder` NSIS.

### Android / APK

- Capacitor config: `capacitor.config.ts`.
- Android native project: `android/`.
- Web assets come from `out/`.
- `npm run build:android` runs static export and `npx cap sync android`.
- Android calls remote APIs directly with `CapacitorHttp`; it does not rely on Next API routes at runtime.
- Android device ID is persisted with `@capacitor/preferences` key `device_id`.
- Home page attempts to lock screen orientation to landscape.

## App Routes

- `/`: authenticated live rate board display.
- `/corporateId`: Corporate ID login and bootstrap screen.
- `/register`: device registration request screen for unregistered devices.
- `/api/auth/token`: web-only token proxy; sets `bearerToken` cookie.
- `/api/auth/corporateId`: web-only Corporate ID lookup proxy.
- `/api/auth/verify`: web-only device verification proxy.
- `/api/auth/register`: web-only device registration proxy.
- `/api/auth/logout`: web-only logout; clears token cookie.
- `/api/rate-board/[clientId]`: web-only rate-board data proxy.
- `/api/device/register`: metadata endpoint used by lower-level device registration helper.

## Authentication Flow

Core flow is in `src/utils/clientAuthFlow.ts`.

1. Fetch bearer token.
2. Fetch Corporate ID client data.
3. Validate client license fields.
4. Store client data locally.
5. Verify current device with backend.
6. Route according to backend device status:
   - `Device === "Y"`: approved, go to `/`.
   - `Device === "N"`: denied, show access denied.
   - anything else: unregistered, go to `/register`.

Startup behavior:

- If no recoverable Corporate ID/session exists, `/` redirects to `/corporateId`.
- If a Corporate ID/session is stored, startup re-runs the backend auth and device verification flow instead of trusting the stored `isVerified` flag.
- This keeps web, Electron exe, and Android APK aligned with the latest backend device approval status every time the app opens or bootstraps.

Important files:

- `src/hooks/auth/useClientAuthentication.ts`: form submit flow for Corporate ID login.
- `src/hooks/auth/useAuthBootstrap.ts`: restores and revalidates sessions on `/` and `/corporateId`.
- `src/context/ClientContext.tsx`: in-memory client session state.
- `src/utils/authStorage.ts`: encrypted localStorage auth snapshot.
- `src/utils/authApi.ts`: runtime-aware auth adapter.

## Device ID Strategy

Important files:

- `src/lib/device/getDeviceId.ts`
- `src/lib/device/platform.ts`
- `src/hooks/auth/useDeviceId.ts`
- `src/lib/fingerprint.ts`
- `src/utils/identifyDevice.ts`

Strategy:

- Web: fingerprint-based ID from `getFingerprintId()`.
- Electron: UUID from Electron main process, persisted in `electron-store`.
- Android: UUID from Capacitor Preferences.
- Backend registration and verification use the prefixed device ID shape `R_{deviceId}`.

For compatibility, `useDeviceId()` mirrors the resolved ID into localStorage key `fingerId`.

## Rate Board Data Flow

Important files:

- `src/hooks/useRateBoard.ts`
- `src/utils/rateBoardApi.ts`
- `src/types/rateBoard.ts`
- `src/utils/rateFormatter.ts`
- `src/app/page.tsx`

Remote rate endpoint:

```text
https://report-api-742717265610.asia-south1.run.app/api/Report/rate/Rate-{clientId}
```

Polling:

- `useRateBoard` refreshes every 2 minutes.
- It tracks consecutive failures.
- After 4 consecutive failures, the home page schedules an automatic reload.
- It marks a fresh update when the rate payload signature changes.

Rate normalization:

- `Metal_name === "G"` becomes Gold.
- Other supported display metal is Silver.
- Only Gold and Silver rows are displayed.
- Rows with zero sale or purchase rate are filtered out.
- Gold can display per gram or 10 grams.
- Silver can display per gram or kilogram.
- Gold sorts before Silver; caret sorts descending inside a metal group.

## UI Features

Home page:

- Full-screen live display layout.
- Date, day, time, seconds, firm name, and live indicator.
- Sale and purchase columns.
- Settings drawer for themes, unit selection, logout, and metal label overrides.
- Fullscreen toggle button.
- Floating controls auto-hide after mouse inactivity.
- Android landscape orientation lock.

Themes:

- Theme context: `src/context/ThemeContext.tsx`.
- Theme definitions: `src/utils/rateBoardTheme.ts`.
- Default theme: `pearl` / "Ivory & Gold".
- Theme ID persists in localStorage key `rate-board.ui.theme`.
- Current theme default version key: `rate-board.ui.theme-default-version`.

User preferences stored in localStorage:

- `rate-board-gold-unit`
- `rate-board-silver-unit`
- `rate-board-metal-overrides`
- `rate-board.ui.theme`

## Environment Variables

Required:

```text
NEXT_PUBLIC_BASE_API_URL
NEXT_PUBLIC_SECRET_KEY
```

Notes:

- `NEXT_PUBLIC_BASE_API_URL` is used for auth backend endpoints.
- `NEXT_PUBLIC_SECRET_KEY` is used by CryptoJS encryption/decryption for browser-side stored auth data.
- Next.js injects `NEXT_PUBLIC_*` values into frontend code at build time.
- Capacitor does not load `.env` at runtime, so values must be available when building the static export.
- Electron main process loads `.env.local` and `.env` directly because it runs outside the Next.js renderer.
- Electron package config currently includes `.env` and `.env.local` in packaged files.

## External Backend Endpoints

Auth base comes from `NEXT_PUBLIC_BASE_API_URL`:

- `POST /sysfunction/gettokenmob`
- `GET /login/corporateid/{corporateId}`
- `GET /login/device/{clientId}/{SysName}/{fingerPrintId}`
- `POST /login/register_device`

Rate board endpoint is currently hard-coded:

- `GET https://report-api-742717265610.asia-south1.run.app/api/Report/rate/Rate-{clientId}`

Bearer token credentials are currently hard-coded in app code:

```json
{ "userid": "abc", "password": "xyz" }
```

## Static Export Notes

`next.config.ts` only enables static export when:

```text
NEXT_OUTPUT_MODE=export
```

Static export settings:

- `output: "export"`
- `trailingSlash: true`
- `images.unoptimized: true`

`scripts/build-static.mjs` temporarily moves these away because static export cannot include server middleware/routes:

- `middleware.ts`
- `src/app/api/auth/token/route.ts`
- `src/app/api/auth/corporateId/route.ts`
- `src/app/api/auth/verify/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/device/register/route.ts`
- `src/app/api/rate-board/[clientId]/route.ts`

The script restores moved files in `finally`.

## Desktop Build Notes

Electron builder settings live in `package.json`.

- App ID: `com.parasinfotech.rateboard`
- Product name: `Rate Board`
- Main entry: `electron/main.js`
- Output directory: `release`
- Windows target: NSIS x64
- Installer artifact: `Rate Board-0.1.0-Setup.exe`
- Icon: `src/app/favicon.ico`
- Packaged files include `out/**/*`, `electron/**/*`, env files, and `package.json`.

## Android Build Notes

Capacitor settings:

- App ID: `com.parasinfotech.rateboard`
- App name: `Rate Board`
- Web dir: `out`
- Android scheme: `https`

Common flow:

```powershell
npm run build:android
npm run cap:open:android
```

In Android Studio:

1. Open `android/`.
2. Use `Build > Generate Signed Bundle / APK`.
3. Choose APK.
4. Select/create keystore.
5. Build release.

Expected release APK path:

```text
android\app\build\outputs\apk\release\app-release.apk
```

## Folder Map

```text
rate-board/
|- android/                         Capacitor Android native project
|- electron/                        Electron main/preload source and compiled JS
|- public/                          static assets and local rate-board fonts
|- scripts/build-static.mjs         static export helper for Electron/Android
|- src/app/                         Next.js App Router pages and API routes
|- src/components/                  UI components and modals
|- src/context/                     Client and theme providers
|- src/hooks/                       rate-board and auth hooks
|- src/lib/                         fingerprint and device helpers
|- src/types/                       runtime/auth/rate-board types
|- src/utils/                       auth, rate, platform, theme, device utilities
|- capacitor.config.ts              Capacitor app config
|- next.config.ts                   Next.js config
|- package.json                     scripts, dependencies, Electron builder config
`- DESKTOP_AND_ANDROID_SETUP.md      existing build/setup notes
```

## Known Development Notes

- The generated `electron/main.js` and `electron/preload.js` are present beside TypeScript sources.
- The repo has `.next/` and `node_modules/` locally.
- `README.md` is still mostly the default Next.js README; project-specific notes live in `DESKTOP_AND_ANDROID_SETUP.md` and this file.
- Some rendered rupee symbols in `src/app/page.tsx` appear mojibake in terminal output (`â‚¹`), but may still be intended as `₹`; verify in browser before changing encoding-sensitive text.
- `build:static` mutates files temporarily, so interrupted builds should be checked for `.static-build-backup` or missing API route files.
- The app relies on localStorage and browser/native storage, so SSR-sensitive code is guarded with `"use client"` and runtime checks.

## Recommended Verification Before Release

For web:

```powershell
npm run lint
npm run build
```

For desktop:

```powershell
npm run build:electron:ts
npm run build:desktop
```

Then install/run the generated installer from `release/`.

For Android:

```powershell
npm run build:android
npm run cap:open:android
```

Then build/sign APK in Android Studio and test on a real device.
