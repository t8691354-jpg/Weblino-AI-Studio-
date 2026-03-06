import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDJbFjYgxVaCJIHxsl52CUjrYZt9ejL8X4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "weblino-ai-studio-907ab.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "weblino-ai-studio-907ab",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "weblino-ai-studio-907ab.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "7358975715",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:7358975715:web:791a83f3e1ff74b569ffd6",
};

// Only initialize if we have a real API key to avoid crashing on load
const isConfigured = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "MISSING_API_KEY";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

if (!isConfigured) {
  console.warn("Firebase is not configured. Please set your VITE_FIREBASE_* environment variables.");
}
