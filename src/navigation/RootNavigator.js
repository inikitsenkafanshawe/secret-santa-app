// src/navigation/RootNavigator.js

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import { checkAuthState } from "../services/authService";

const RootNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Set up the listener
    const unsubscribe = checkAuthState(setIsAuthenticated);  

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    // Loading state while checking authentication status
    return null;
    //<ActivityIndicator size="large" color="#0000ff" />
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
