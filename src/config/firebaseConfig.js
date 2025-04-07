import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

// Add your Firebase configuration details here (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, etc.)
const firebaseConfig = {
  apiKey: "AIzaSyBOLnA3hDCF9GStvPaWrUAQwkkt3_hKLMs",
  authDomain: "info6132-finalproject-a938f.firebaseapp.com",
  projectId: "info6132-finalproject-a938f",
  storageBucket: "info6132-finalproject-a938f.firebasestorage.app",
  messagingSenderId: "203634483002",
  appId: "1:203634483002:web:92a42c3c304484cdfffa03",

};

let app, auth;

if (!getApps().length) {
  try {
    // Initialize Firebase app if not already initialized
    app = initializeApp(firebaseConfig);

    // Initialize Firebase Authentication with AsyncStorage persistence for React Native
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    console.log("Error initializing Firebase app: " + error);
  }
} else {
  // If Firebase is already initialized, just use the existing app instance
  app = getApp();

  // Get the existing Auth instance
  auth = getAuth(app);
}

// Initialize the Firebase Realtime Database
const db = getDatabase(app);

export { auth, db };
