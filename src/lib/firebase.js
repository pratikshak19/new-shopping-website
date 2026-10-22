import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId)
export const firebaseApp = firebaseEnabled
  ? (getApps()[0] || initializeApp(firebaseConfig))
  : null
export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null
export const firestore = firebaseApp ? getFirestore(firebaseApp) : null
export const firebaseStorage = firebaseApp ? getStorage(firebaseApp) : null

export function requireFirebase() {
  if (!firebaseEnabled) throw new Error('Firebase is not configured. Copy .env.example to .env.local and add your Firebase web config.')
  return { firebaseApp, firebaseAuth, firestore, firebaseStorage }
}
