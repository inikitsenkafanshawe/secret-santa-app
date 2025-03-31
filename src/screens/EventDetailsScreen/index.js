import React, { useContext, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./styles";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { EventsContext } from "../../context/EventsContext";
import { UsersContext } from "../../context/UsersContext";
import { UserContext } from "../../context/UserContext";
import Message from "../../components/Message";
import ConfirmationModal from "../../components/ConfirmationModal";

const EventDetailsScreen = ({ navigation, route }) => {
  const { eventId } = route.params; // Get event ID from navigation params
  const { getEventById, deleteEvent } = useContext(EventsContext);
  const { getUserById } = useContext(UsersContext);
  const { currentUser } = useContext(UserContext);
  const event = getEventById(eventId);
  const creator = event ? getUserById(event.createdBy) : null;
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // Message visibility state
  const [isVisible, setIsVisible] = useState(false); // ConfirmationModal visibility state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useFocusEffect(() => {
    navigation.getParent().setOptions({ headerShown: false }); // Hide Drawer header
  });

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Event not found</Text>
      </View>
    );
  }

  const renderParticipant = ({ item }) => {
    const user = getUserById(item);
    const assignedTo = event.participants[item]?.assignedTo;
    const isSecretSanta = currentUser.uid === item;

    return (
      <View style={[styles.userItem, isSecretSanta && styles.secretSanta]}>
        <View style={styles.userInfo}>
          <Text style={styles.userText}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          {isSecretSanta && assignedTo && (
            <View style={styles.assignedContainer}>
              <FontAwesome5 name="gifts" size={18} color="white" />
              <Text style={styles.assignedTo}>
                {" "}
                {getUserById(assignedTo)?.name}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const handleDelete = async () => {
    // Reset errors
    setError("");
    // Show confirmation modal
    setIsModalVisible(true);
  };

  const confirmDelete = async () => {
    // Show the loading state
    setIsLoading(true);
    // Hide confirmation modal
    setIsModalVisible(false);
    try {
      // Delete event using deleteEvent
      await deleteEvent(eventId);
      // Navigate back after event deletion
      navigation.goBack();
    } catch (error) {
      // Show error message if deletion fails
      setError(error.message);
      setIsVisible(true);
    } finally {
      // Hide the loading state
      setIsLoading(false);
    }
  };

  const cancelDelete = () => {
    // Close the modal without deleting
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eventName}>{event.name}</Text>
      <Text style={styles.eventDescription}>{event.description}</Text>
      <Text style={styles.createdBy}>
        Created by: {creator?.name} ({creator?.email})
      </Text>

      <Text style={styles.subTitle}>Participants:</Text>
      <FlatList
        data={Object.keys(event.participants)}
        keyExtractor={(item) => item}
        renderItem={renderParticipant}
      />

      {currentUser.uid === event.createdBy && (
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Delete Event</Text>
          )}
        </TouchableOpacity>
      )}
      <ConfirmationModal
        isVisible={isModalVisible}
        title="Delete Event"
        message="Are you sure you want to delete this event?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <Message
        isVisible={isVisible}
        message={error}
        onClose={() => setIsVisible(false)}
        title="Error"
      />
    </View>
  );
};

export default EventDetailsScreen;
