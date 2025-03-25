import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import RootNavigator from "./src/navigation/RootNavigator";

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </SafeAreaProvider>
  );
};

export default App;
