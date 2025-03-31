import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import {
  fetchUsersFromDatabase,
  saveUserToDatabase,
} from "../services/dbService";

// Create a context for users
export const UsersContext = createContext();

// Create a provider component for users
export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    // Check if user is authenticated
    if (currentUser) {
      // Call fetchUsersFromDatabase to start listening for changes
      const unsubscribe = fetchUsersFromDatabase(setUsers);

      // Cleanup listener when currentUser changes or component unmounts
      return () => {
        unsubscribe(); // Unsubscribe from the previous listener
      };
    } else {
      // Clear users if no currentUser
      setUsers([]);
    }
  }, [currentUser]); // Run the effect when currentUser changes

  // Function to get a user by ID
  const getUserById = (userId) => {
    return users.find((user) => user.id === userId) || null;
  };

  // Function to save user data to the Realtime Database
  const saveUser = async (userId, name, email) => {
    try {
      await saveUserToDatabase(userId, name, email);
    } catch (error) {
      console.error("Error saving user: ", error);
      throw error;
    }
  };

  return (
    <UsersContext.Provider value={{ users, getUserById, saveUser }}>
      {children}
    </UsersContext.Provider>
  );
};
