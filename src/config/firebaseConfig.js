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
  apiKey: "AIzaSyBTsCf3aHfEqyGHfsMJh_gAV-ECRiRv2qI",
  authDomain: "info-6132-88642.firebaseapp.com",
  databaseURL: "https://info-6132-88642-default-rtdb.firebaseio.com",
  projectId: "info-6132-88642",
  storageBucket: "info-6132-88642.firebasestorage.app",
  messagingSenderId: "1066729218122",
  appId: "1:1066729218122:web:9556fcd6eea53a27bb06b3"
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
