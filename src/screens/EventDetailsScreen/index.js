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
import { WishlistsContext } from "../../context/WishlistsContext";
import { UserContext } from "../../context/UserContext";
import Message from "../../components/Message";
import ConfirmationModal from "../../components/ConfirmationModal";
import { ChatsContext } from "../../context/ChatsContext";

const EventDetailsScreen = ({ navigation, route }) => {
  const { eventId } = route.params; // Get event ID from navigation params
  const { getEventById, deleteEvent } = useContext(EventsContext);
  const { getUserById } = useContext(UsersContext);
  const { getWishlistByEventAndUser, getWishlistByEventAndSanta } =
    useContext(WishlistsContext);
  const { currentUser } = useContext(UserContext);
  const { startChatForEvent, refreshUnreadCounts } = useContext(ChatsContext);
  const event = getEventById(eventId);
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

  const creator = event ? getUserById(event.createdBy) : null;

  const myWishlist = getWishlistByEventAndUser(eventId, currentUser.uid);
  const participantsWishlist = getWishlistByEventAndSanta(
    eventId,
    currentUser.uid
  );
  const secretSantaId = Object.entries(event.participants).find(
    ([id, data]) => data.assignedTo === currentUser.uid
  )?.[0];

  // Check if current user is a participant in the current event
  const isParticipant = Object.keys(event.participants).includes(
    currentUser.uid
  );

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
      // Force update the unread counts after deletion
      refreshUnreadCounts();
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

  // Function to create a new chat if it doesn't already exist and to navigate to chat
  const handleStartChat = async (type) => {
    const myId = currentUser.uid;

    // Find the recipientId based on the type (secret_santa or recipient)
    const recipientId =
      type === "secret_santa"
        ? Object.entries(event.participants).find(
            ([, v]) => v.assignedTo === myId
          )?.[0]
        : event.participants[myId]?.assignedTo;

    // Exit early if no recipient is found
    if (!recipientId) return;

    try {
      // Create or find the chat with roles for both users
      const newChatId = await startChatForEvent(
        eventId,
        myId,
        recipientId,
        type
      );
      // Fetch name to display
      const otherUser = getUserById(recipientId);
      const chatName =
        type === "secret_santa" ? "Secret Santa" : otherUser?.name;

      // Pass eventName and chatName as params when navigating to the ChatDetails screen
      navigation.navigate("ChatsStack", {
        screen: "ChatDetails",
        params: {
          chatId: newChatId,
          chatName,
          eventName: event.name,
        },
        initial: false,
      });
    } catch (error) {
      console.error("Error in starting chat:", error);
    }
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

      {isParticipant && (
        <>
        <TouchableOpacity
           style={styles.button}
           onPress={() => handleStartChat("secret_santa")}
         >
           <Text style={styles.buttonText}>Chat with Secret Santa</Text>
         </TouchableOpacity>
 
         <TouchableOpacity
           style={styles.button}
           onPress={() => handleStartChat("recipient")}
         >
           <Text style={styles.buttonText}>Chat with Gift Recipient</Text>
         </TouchableOpacity>

          {!myWishlist && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("WishlistsStack", {
                  screen: "NewWishlist",
                  params: { eventId, secretSantaId },
                  initial: false,
                });
              }}
            >
              <Text style={styles.buttonText}>Create My Wishlist</Text>
            </TouchableOpacity>
          )}
          {myWishlist && (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("WishlistsStack", {
                  screen: "WishlistDetails",
                  params: { wishlistId: myWishlist.id },
                  initial: false,
                })
              }
            >
              <Text style={styles.buttonText}>Open My Wishlist</Text>
            </TouchableOpacity>
          )}
          {participantsWishlist && (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("WishlistsStack", {
                  screen: "WishlistDetails",
                  params: { wishlistId: participantsWishlist.id },
                  initial: false,
                })
              }
            >
              <Text style={styles.buttonText}>Open Recipient's Wishlist </Text>
            </TouchableOpacity>
          )}
        </>
      )}

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
