import React, { useContext, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import { UserContext } from "../context/UserContext";

const RootNavigator = () => {
  const { currentUser, isLoading } = useContext(UserContext);

  useEffect(() => {
    if (!isLoading) {
      // Hide the splash screen once the auth state is determined
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {currentUser ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
