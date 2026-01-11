import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔐 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAO6OlSCeb2DFXutuyRTCT4PyP5o5xjn1E",
  authDomain: "fundhub-c116b.firebaseapp.com",
  projectId: "fundhub-c116b",
  storageBucket: "fundhub-c116b.appspot.com",
  messagingSenderId: "9372877382",
  appId: "1:9372877382:web:f6cde9c31bdefc40098047",
  measurementId: "G-NQFVW82FNR",
};

// 🧠 Prevent re-initialization (important for React)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🔑 Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
