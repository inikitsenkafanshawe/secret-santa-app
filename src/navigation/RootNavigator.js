import React, { useContext, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import OnboardingNavigator from "./OnboardingNavigator";
import { UserContext } from "../context/UserContext";
import { OnboardingContext } from "../context/OnboardingContext";

const RootNavigator = () => {
  const { currentUser, isLoading } = useContext(UserContext);
  const { hasSeenOnboarding } = useContext(OnboardingContext);

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
      {!currentUser ? (
        <AuthNavigator />
      ) : hasSeenOnboarding ? (
        <AppNavigator />
      ) : (
        <OnboardingNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
