import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

// Add your Firebase configuration details here (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, etc.)
const firebaseConfig = {

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
