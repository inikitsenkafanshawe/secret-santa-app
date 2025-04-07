import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { UserContext } from "../../context/UserContext";
import { ChatsContext } from "../../context/ChatsContext";
import styles from "./styles";

const ChatDetailsScreen = ({ route }) => {
  // Get the chat ID, event name, and chat display name from nav params
  const { chatId, eventName, chatName } = route.params;

  // Get current user from context
  const { currentUser } = React.useContext(UserContext);

  // Get chat related functions from context
  const { messages, sendMessageToChat, markMessagesAsRead } =
    useContext(ChatsContext);

  // Input state for message text
  const [input, setInput] = useState("");
  // Track if user is at the bottom of scroll
  const [isAtBottom, setIsAtBottom] = useState(true);
  // Get messages for current chat from chat context
  const chatMessages = messages[chatId] || [];

  // Ref to control FlatList scroll position
  const flatListRef = useRef();

  // Function to handle sending a new message
  const handleSend = async () => {
    if (input.trim()) {
      // Send message
      await sendMessageToChat(chatId, currentUser.uid, input.trim());
      // Clear input after sending message
      setInput("");
    }
  };

  // Render each message in the list
  const renderItem = ({ item }) => {
    // Determine whether or not the message is sent by the current user
    const isMine = item.sender === currentUser.uid;

    // Format the timestamp into date and 12 hour time
    const timestamp = new Date(item.timestamp);
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
    const day = timestamp.getDate();
    const month = timestamp.toLocaleString("default", { month: "short" });
    const year = timestamp.getFullYear();
    const formattedDate = `${month} ${day}, ${year}`;

    return (
      <View
        style={[
          styles.messageContainer,
          isMine ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestampText}>
          {formattedDate} at {formattedTime}
        </Text>
      </View>
    );
  };

  // Scroll to the bottom if needed
  useEffect(() => {
    if (isAtBottom) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [chatMessages, isAtBottom]);

  // Mark messages as read when screen mounts
  useEffect(() => {
    if (chatId && currentUser?.uid) {
      markMessagesAsRead(chatId);
    }
  }, [chatId, currentUser]);

  // Check if user is at the bottom of the list
  const onScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    const distanceFromBottom = contentHeight - layoutHeight - contentOffsetY;
    // If user is within 10 pixels of the bottom, set isAtBottom to true
    if (distanceFromBottom < 10) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.textRow}>
        <Text style={styles.chatText}>Event: </Text>
        <Text style={styles.chatTextBold}>{eventName}</Text>
      </View>

      <View style={styles.textRow}>
        <Text style={styles.chatText}>From: </Text>
        <Text style={styles.chatTextBold}>{chatName}</Text>
      </View>

      {chatMessages.length === 0 && (
        <Text style={styles.error}>No messages yet</Text>
      )}

      <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={(item) => `${item.timestamp}-${item.sender}`} // Unique key
        renderItem={renderItem}
        inverted
        onScroll={onScroll} // Track scroll position
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatDetailsScreen;
