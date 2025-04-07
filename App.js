import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import RootNavigator from "./src/navigation/RootNavigator";
import { UserProvider } from "./src/context/UserContext";
import { UsersProvider } from "./src/context/UsersContext";
import { EventsProvider } from "./src/context/EventsContext";
import { ChatsProvider } from "./src/context/ChatsContext";

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
      {/* Provide currentUser context first */}
      <UserProvider>
        {/* Provide users context next, depends on currentUser */}
        <UsersProvider>
          {/* Provide events context last, depends on users */}
          <EventsProvider>
            <ChatsProvider>
              <StatusBar style="auto" />
              <RootNavigator />
            </ChatsProvider>
          </EventsProvider>
        </UsersProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
};

export default App;
