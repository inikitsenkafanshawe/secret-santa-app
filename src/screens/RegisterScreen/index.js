import React, { useState } from "react";
import {
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { registerUser } from "../../services/authService";
import { saveUserToDatabase } from "../../services/dbService";
import Message from "../../components/Message";
import styles from "./styles";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [isVisible, setIsVisible] = useState(false); // Message visibility state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleRegister = async () => {
    // Reset errors before checking
    setEmailError("");
    setPasswordError("");
    setNameError("");
    setError("");
    // Hide the error overlay
    setIsVisible(false);
    // Show the loading state
    setIsLoading(true);

    // Validate that all fields are filled
    if (!name) setNameError("Name is required!");
    if (!email) setEmailError("Email is required!");
    if (!password) setPasswordError("Password is required!");

    // Don't proceed if validation fails
    if (!name || !email || !password) {
      // Hide the loading state
      setIsLoading(false);
      return;
    }

    try {
      // Register the user using authService
      const user = await registerUser(email, password, name);

      // Save additional user data to the database using dbService
      await saveUserToDatabase(user.uid, name, email);
    } catch (error) {
      // Show error message if registration fails
      setError(error.message);
      setIsVisible(true);
    } finally {
      // Hide the loading state
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={styles.placeholder.color}
          value={name}
          onChangeText={setName}
        />
        {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={styles.placeholder.color}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={styles.placeholder.color}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {passwordError ? (
          <Text style={styles.error}>{passwordError}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            Login here
          </Text>
        </Text>

        <Message
          isVisible={isVisible}
          message={error}
          onClose={() => setIsVisible(false)}
          title="Error"
        />
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;
