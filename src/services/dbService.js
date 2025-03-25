import { db } from "../config/firebaseConfig";
import { ref, set } from "firebase/database";

// Function to save user data to the Realtime Database
export const saveUserToDatabase = async (userId, name, email) => {
  try {
    const userRef = ref(db, "users/" + userId);
    await set(userRef, {
      name: name,
      email: email,
    });
  } catch (error) {
    throw error;
  }
};
