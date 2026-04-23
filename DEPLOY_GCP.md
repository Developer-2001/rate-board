# Deploy Rate Board on GCP + Release Desktop and Android Apps

## 1. Deploy Website on GCP App Engine

### Prerequisites

- Google Cloud project created
- billing enabled
- `gcloud` CLI installed
- App Engine API enabled

### Login

```powershell
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Create App Engine app

Run once only:

```powershell
gcloud app create --region=asia-south1
```

### Deploy website

From project root:

```powershell
npm install
npm run build:web
gcloud app deploy app.yaml
```

### Open deployed website

```powershell
gcloud app browse
```

Website URL will be like:

```text
https://YOUR_PROJECT_ID.REGION_ID.r.appspot.com
```

### Deploy updates later

```powershell
npm run build:web
gcloud app deploy app.yaml
```

## 2. App Engine Config Used

File:

- `app.yaml`

Current config:

```yaml
runtime: nodejs24
env: standard
service: default

instance_class: F1

entrypoint: npx next start -H 0.0.0.0 -p $PORT

build_env_variables:
  GOOGLE_NODE_RUN_SCRIPTS: "build"

env_variables:
  NODE_ENV: "production"
  NEXT_PUBLIC_BASE_API_URL: "https://mobileapp.parasinfotech.co.in/api"
  NEXT_PUBLIC_SECRET_KEY: "S3cr3tK3y@123!"

automatic_scaling:
  min_instances: 1
  max_instances: 2
  target_cpu_utilization: 0.65
  target_throughput_utilization: 0.65
```

## 3. Build Windows Desktop App

### Command

```powershell
npm run build:desktop
```

### Output

```text
release\Rate Board-0.1.0-Setup.exe
```

### Install on Windows

1. Download `Rate Board-0.1.0-Setup.exe`
2. Double-click installer
3. Complete install

## 4. Build Android APK

### Build and sync Android

```powershell
npm run build:android
```

### Open Android Studio

```powershell
npm run cap:open:android
```

### Generate signed APK

In Android Studio:

1. Click `Build > Generate Signed Bundle / APK`
2. Select `APK`
3. Choose or create `.jks` keystore
4. Select `release`
5. Finish

### Output

```text
android\app\build\outputs\apk\release\app-release.apk
```

### Install on Android

1. Download `app-release.apk`
2. Allow install from unknown sources if required
3. Install APK

## 5. Host Downloads for Users

Recommended:

- host `.exe` and `.apk` in Google Cloud Storage
- add download buttons on your website

## 6. Create Download Bucket

```powershell
gcloud storage buckets create gs://YOUR_DOWNLOAD_BUCKET --location=asia-south1
```

## 7. Upload Desktop Installer

```powershell
gcloud storage cp "release\Rate Board-0.1.0-Setup.exe" gs://YOUR_DOWNLOAD_BUCKET/
```

## 8. Upload Android APK

```powershell
gcloud storage cp "android\app\build\outputs\apk\release\app-release.apk" gs://YOUR_DOWNLOAD_BUCKET/
```

## 9. Make Files Public

### Windows installer

```powershell
gcloud storage objects update "gs://YOUR_DOWNLOAD_BUCKET/Rate Board-0.1.0-Setup.exe" --add-acl-grant=entity=AllUsers,role=READER
```

### Android APK

```powershell
gcloud storage objects update gs://YOUR_DOWNLOAD_BUCKET/app-release.apk --add-acl-grant=entity=AllUsers,role=READER
```

## 10. Public Download Links

Windows:

```text
https://storage.googleapis.com/YOUR_DOWNLOAD_BUCKET/Rate%20Board-0.1.0-Setup.exe
```

Android:

```text
https://storage.googleapis.com/YOUR_DOWNLOAD_BUCKET/app-release.apk
```

## 11. Add Download Buttons on Website

Use links like:

- `Download for Windows`
- `Download for Android`

Point them to:

- public `.exe` URL
- public `.apk` URL

## 12. Daily Workflow

### Run website locally

```powershell
npm run dev
```

### Build website for production

```powershell
npm run build:web
```

### Deploy website

```powershell
gcloud app deploy app.yaml
```

### Build desktop installer

```powershell
npm run build:desktop
```

### Build Android sync

```powershell
npm run build:android
```

## 13. Verified Project Modes

- website works with Next.js server mode
- desktop works with Electron static export mode
- Android works with Capacitor static export mode

## 14. Important Notes

- Website uses Next.js route handlers and middleware
- Desktop and Android use static export build path
- `npm run build:web` is for website deployment
- `npm run build:desktop` is for Windows `.exe`
- `npm run build:android` is for Android app packaging
