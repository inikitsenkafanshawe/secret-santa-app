import React, { createContext, useState, useEffect } from "react";
import { checkAuthState } from "../services/authService";

// Create a context for currentUser
export const UserContext = createContext();

// Create a provider component for currentUser
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Call checkAuthState to listen for auth state changes
    const unsubscribe = checkAuthState(setCurrentUser, setIsLoading);

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
