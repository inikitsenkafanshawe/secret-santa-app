import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import RootNavigator from "./src/navigation/RootNavigator";
import { OnboardingProvider } from "./src/context/OnboardingContext";
import { UserProvider } from "./src/context/UserContext";
import { UsersProvider } from "./src/context/UsersContext";
import { EventsProvider } from "./src/context/EventsContext";
import { ChatsProvider } from "./src/context/ChatsContext";
import { WishlistsProvider } from "./src/context/WishlistsContext";

const App = () => {
  useEffect(() => {
    // Prevent the splash screen from hiding automatically
    SplashScreen.preventAutoHideAsync();

    // Hide splash screen on unmount
    return () => {
      SplashScreen.hideAsync();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <OnboardingProvider>
        {/* Provide currentUser context first */}
        <UserProvider>
          {/* Provide users context next, depends on currentUser */}
          <UsersProvider>
            {/* Provide events context last, depends on users */}
            <EventsProvider>
              <ChatsProvider>
                <WishlistsProvider>
                  <StatusBar style="auto" />
                  <RootNavigator />
                </WishlistsProvider>
              </ChatsProvider>
            </EventsProvider>
          </UsersProvider>
        </UserProvider>
      </OnboardingProvider>
    </SafeAreaProvider>
  );
};

export default App;
