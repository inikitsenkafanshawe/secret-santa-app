import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { logoutUser } from "../../services/authService";
import styles from "./styles";

const HomeScreen = ({ navigation }) => {
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Calls the logoutUser function from authService
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to the Home Screen!</Text>
        <Text style={styles.subtitle}>You're successfully logged in.</Text>

        <TouchableOpacity
          style={[styles.button, isLoggingOut && styles.buttonDisabled]}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
