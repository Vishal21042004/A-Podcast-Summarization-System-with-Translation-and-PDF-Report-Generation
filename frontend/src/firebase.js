import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';  // Import Firebase Storage

// Firebase config (same as before)
const firebaseConfig = {
  apiKey: "AIzaSyDBXhAyxmWvRpDysshDnAFesMchECHhMg8",
  authDomain: "podcast-summarizer-b2c52.firebaseapp.com",
  projectId: "podcast-summarizer-b2c52",
  storageBucket: "podcast-summarizer-b2c52.appspot.com",  // Add this
  messagingSenderId: "144206224897",
  appId: "1:144206224897:web:ca3cb9147c9264cc0fea00",
  measurementId: "G-G86111T6HC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);  // Export Firebase Storage
