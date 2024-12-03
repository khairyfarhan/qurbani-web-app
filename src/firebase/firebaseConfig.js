// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace the values with your Firebase credentials
const firebaseConfig = {
    apiKey: "AIzaSyBavzsPibkz2KpG9LjxxgEmvyppHOqwkvo",
    authDomain: "qurbani-web-app.firebaseapp.com",
    projectId: "qurbani-web-app",
    storageBucket: "qurbani-web-app.firebasestorage.app",
    messagingSenderId: "677807261306",
    appId: "1:677807261306:web:22029dda826e6d7e279dc3"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);