import React, { useContext } from "react";
import { View, FlatList, Text, TouchableOpacity, Image } from "react-native";
import { ChatsContext } from "../../context/ChatsContext";
import { UsersContext } from "../../context/UsersContext";
import { UserContext } from "../../context/UserContext";
import styles from "./styles";
import { EventsContext } from "../../context/EventsContext";

const ChatsScreen = ({ navigation }) => {
  // Access global chats and unread counts
  const { chats, unreadCounts } = useContext(ChatsContext);
  const { getUserById } = useContext(UsersContext);
  const { getEventById } = useContext(EventsContext);
  const { currentUser } = useContext(UserContext);

  const renderItem = ({ item }) => {
    // Determine who the other user is by checking current user
    const otherUserId =
      item.user1 === currentUser.uid ? item.user2 : item.user1;
    // Get the other user's data
    const otherUser = getUserById(otherUserId);
    // Get event name to display
    const eventName = getEventById(item.eventId)?.name || "Unknown Event";

    // Fetch the role of the current user (secret_santa or recipient)
    const userRole = item.roles[currentUser.uid];

    // Set the display name based on the current user's role
    const chatName =
      userRole === "secret_santa"
        ? "Secret Santa"
        : otherUser?.name || "Recipient"; // Display recipient's name instead of "Recipient"

    // Get unread count for the chat for the current user
    const unreadCount = unreadCounts[item.id] || 0;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate("ChatDetails", {
            chatId: item.id,
            chatName,
            eventName,
          })
        }
      >
        <View style={styles.textRow}>
          <Text style={styles.chatText}>Event: </Text>
          <Text style={styles.chatTextBold}>{eventName}</Text>
        </View>

        <View style={styles.textRow}>
          <Text style={styles.chatText}>From: </Text>
          <Text style={styles.chatTextBold}>{chatName}</Text>
        </View>

        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {chats && chats.length > 0 ? (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.error}>No chats yet</Text>}
        />
      ) : (
        <View style={styles.empty}>
          <Image
            source={require("../../../assets/letter.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Let’s break the ice!</Text>
          <Text style={styles.subtitle}>
            Go to your event to meet your Santa or surprise your giftee.
          </Text>
        </View>
      )}
    </View>
  );
};

export default ChatsScreen;
