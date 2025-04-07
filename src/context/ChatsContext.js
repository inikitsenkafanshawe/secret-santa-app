import React, { createContext, useState, useEffect } from "react";
import {
  fetchChatsForUser,
  fetchMessagesForChat,
  sendMessageToChat as dbSendMessageToChat,
  startChatForEvent as dbStartChatForEvent,
  fetchUnreadCounts,
  markMessagesAsRead as dbMarkMessagesAsRead,
} from "../services/dbService";
import { UserContext } from "./UserContext";

export const ChatsContext = createContext();

export const ChatsProvider = ({ children }) => {
  const { currentUser } = React.useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});

  // Fetch chats for user
  useEffect(() => {
    if (currentUser?.uid) {
      const unsubscribe = fetchChatsForUser(currentUser.uid, setChats);
      return unsubscribe;
    }
  }, [currentUser]);

  // Fetch messages for each chat and store them
  useEffect(() => {
    chats.forEach((chat) => {
      fetchMessagesForChat(chat.id, (newMessages) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [chat.id]: newMessages,
        }));
      });
    });
  }, [chats]);

  // Track unread messages
  useEffect(() => {
    if (currentUser?.uid) {
      const unsubscribe = fetchUnreadCounts(currentUser.uid, setUnreadCounts);
      return unsubscribe;
    }
  }, [currentUser]);

  // Function to handle sending a message
  const sendMessageToChat = async (chatId, senderId, text) => {
    // Call the DB service to send the message
    await dbSendMessageToChat(chatId, senderId, text);

    // After sending the message, fetch the updated messages
    fetchMessagesForChat(chatId, (newMessages) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [chatId]: newMessages, // Update the messages for this chat
      }));
    });
  };

  // Function to start a chat for an event
  const startChatForEvent = async (eventId, myId, recipientId, type) => {
    try {
      const newChatId = await dbStartChatForEvent(
        eventId,
        myId,
        recipientId,
        type
      );
      return newChatId;
    } catch (error) {
      console.error("Error in starting chat:", error);
      throw error;
    }
  };

  // Mark all messages in a chat as read
  const markMessagesAsRead = async (chatId) => {
    if (currentUser?.uid) {
      await dbMarkMessagesAsRead(chatId, currentUser.uid);
    }
  };

  // Get total unread count
  const getTotalUnreadCount = () => {
    return Object.values(unreadCounts).reduce((acc, count) => acc + count, 0);
  };

  // Function to refresh the unread counts (for after event is deleted)
  const refreshUnreadCounts = () => {
    if (currentUser?.uid) {
      fetchUnreadCounts(currentUser.uid, setUnreadCounts);
    }
  };

  return (
    <ChatsContext.Provider
      value={{ chats, messages, sendMessageToChat, startChatForEvent, markMessagesAsRead,  unreadCounts, getTotalUnreadCount, refreshUnreadCounts }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
