# Trendify Firebase setup

This repo now includes Firebase Web SDK wiring, Firestore rules, Storage rules, and Firebase Hosting configuration. The existing localStorage demo remains the fallback until a Firebase project is connected.

## 1. Create the project

1. Open Firebase Console and use the existing project `trendora-shopping` (or create a new Firebase project).
2. Add or open the Web app and copy its configuration values.
3. Enable Authentication → Sign-in method → Email/Password.
4. Use the existing Firestore database, or create one in production mode if it does not exist.
5. Enable Storage.
6. Install Firebase CLI and sign in:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
```

## 2. Configure the web app

```bash
cp .env.example .env.local
```

Fill in all `VITE_FIREBASE_*` values from the Web app settings. Never commit `.env.local`.

## 3. Deploy rules and the site

```bash
npm run build
firebase deploy --only firestore:rules,storage,hosting
```

## 4. Admin claims

Admin access is protected by custom claims, not a client-side email check. Set claims from a trusted server or Firebase Admin SDK:

```js
await getAuth().setCustomUserClaims(uid, { admin: true })
// or owner: true
```

Sign out and back in after changing claims.

## Current migration boundary

The Firebase client is initialized when environment variables exist. Firestore and Storage rules are ready for users, products, orders, reviews, tickets, coupons, and settings. The current demo store still reads and writes its complete state from `trendify-store-v2` in localStorage; the next migration step is replacing StoreContext operations with Firestore repositories and Firebase Auth listeners. This is intentional so the site remains runnable without credentials.
