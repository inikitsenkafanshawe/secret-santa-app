import { auth } from "../config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Function for user registration
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};

// Function for user login
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};

// Function for user logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Function to check auth state
export const checkAuthState = (setIsAuthenticated) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    // Update the state based on whether the user is logged in
    setIsAuthenticated(!!user);
  });

  // Return the unsubscribe function to stop listening when it's no longer needed
  return unsubscribe;
};
