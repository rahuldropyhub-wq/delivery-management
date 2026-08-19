import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBlb2LwPjUfN4JnfJVjwavCvhmTv_eFM3I",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "delivery-management-bdbbe.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "delivery-management-bdbbe",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "delivery-management-bdbbe.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "452824878087",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:452824878087:web:543c8e34cc0df71a54eea2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FCNMN7ZV9L"
};

export const isFirebaseConfigured = true;

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export default app;
