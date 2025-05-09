import React, { useContext, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import styles from "./styles";
import { EventsContext } from "../../context/EventsContext";
import { UsersContext } from "../../context/UsersContext";
import Message from "../../components/Message";

const NewEventScreen = ({ navigation }) => {
  const { saveEvent } = useContext(EventsContext);
  const { users } = useContext(UsersContext);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [dateError, setDateError] = useState("");
  const [isVisible, setIsVisible] = useState(false); // Message visibility state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useFocusEffect(() => {
    navigation.getParent().setOptions({ headerShown: false }); // Hide Drawer header
  });

  // Toggle user selection
  const toggleUserSelection = (user) => {
    setSelectedUsers(
      (prev) =>
        prev.some((u) => u.id === user.id)
          ? prev.filter((u) => u.id !== user.id) // Remove if already selected
          : [...prev, user] // Add if not selected
    );
  };

  const isValidDateFormat = (date) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;

    const parsedDate = new Date(date);
    return (
      !isNaN(parsedDate) && parsedDate.toISOString().split("T")[0] === date
    );
  };

  const handleCreateEvent = async () => {
    // Reset errors before checking
    setNameError("");
    setDateError("");
    setError("");
    // Hide the error overlay
    setIsVisible(false);
    // Show the loading state
    setIsLoading(true);

    // Validate that all fields are filled
    if (!name) setNameError("Event name is required!");
    if (!date) {
      setDateError("Date is required!");
    } else {
      if (!isValidDateFormat(date))
        setDateError("Date must be in YYYY-MM-DD format!");
    }

    // Don't proceed if validation fails
    if (!name || !date || !isValidDateFormat(date)) {
      // Hide the loading state
      setIsLoading(false);
      return;
    }

    // Validate selected users
    if (selectedUsers.length < 3) {
      // Show error message
      setError("You need at least 3 participants for Secret Santa.");
      setIsVisible(true);
      // Hide the loading state
      setIsLoading(false);
      return;
    }

    try {
      // Save event using saveEvent
      await saveEvent(name, date, description, selectedUsers);
      // Navigate back after event creation
      navigation.goBack();
    } catch (error) {
      // Show error message if creation fails
      setError(error.message);
      setIsVisible(true);
    } finally {
      // Hide the loading state
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        placeholderTextColor={styles.placeholder.color}
        value={name}
        onChangeText={setName}
      />
      {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Exchange Date (YYYY-MM-DD)"
        placeholderTextColor={styles.placeholder.color}
        value={date}
        onChangeText={setDate}
      />
      {dateError ? <Text style={styles.error}>{dateError}</Text> : null}

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Event Description"
        placeholderTextColor={styles.placeholder.color}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.subTitle}>Select Participants:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <TouchableOpacity onPress={() => toggleUserSelection(item)}>
              <FontAwesome6
                name={
                  selectedUsers.some((u) => u.id === item.id)
                    ? "square-check"
                    : "square"
                }
                size={30}
                color="white"
              />
            </TouchableOpacity>

            <View style={styles.userInfo}>
              <Text style={styles.userText}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleCreateEvent}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            <FontAwesome5 name="save" size={16} /> Create Event
          </Text>
        )}
      </TouchableOpacity>

      <Message
        isVisible={isVisible}
        message={error}
        onClose={() => setIsVisible(false)}
        title="Error"
      />
    </View>
  );
};

export default NewEventScreen;
