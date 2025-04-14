import { db } from "../config/firebaseConfig";
import {
  onValue,
  orderByChild,
  ref,
  query,
  get,
  set,
  push,
  update,
  remove,
  serverTimestamp,
  equalTo,
} from "firebase/database";

// Function to fetch all users from the Realtime Database
export const fetchUsersFromDatabase = (setUsers) => {
  const usersRef = ref(db, "users/");

  // Set up the real-time listener using onValue
  const unsubscribe = onValue(
    usersRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const usersList = Object.entries(data).map(([id, user]) => ({
          id,
          ...user,
        }));
        setUsers(usersList); // Update the state with the new users data
      } else {
        setUsers([]); // If no data exists, set the users list to an empty array
      }
    },
    (error) => {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  );

  // Return the unsubscribe function to stop listening
  return unsubscribe;
};

// Function to save user data to the Realtime Database
export const saveUserToDatabase = async (userId, name, email) => {
  try {
    const userRef = ref(db, "users/" + userId);
    // Save user to database
    await set(userRef, {
      name: name,
      email: email,
    });
  } catch (error) {
    throw error;
  }
};

// Function to fetch events created by or involving the current user from the Realtime Database
export const fetchEventsFromDatabase = (currentUserId, setEvents) => {
  const eventsRef = ref(db, "events/");

  // Set up the real-time listener using onValue
  const unsubscribe = onValue(
    query(eventsRef, orderByChild("createdAt")),
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const eventsList = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .filter(
            (event) =>
              event.createdBy === currentUserId ||
              Object.keys(event.participants).includes(currentUserId)
          );
        setEvents(eventsList); // Update the state with the filtered events
      } else {
        setEvents([]); // No events found, clear the events state
      }
    },
    (error) => {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  );

  // Return the unsubscribe function to stop listening
  return unsubscribe;
};

// Function to save event data to the Realtime Database
export const saveEventToDatabase = async (
  name,
  date,
  description,
  createdBy,
  selectedUsers
) => {
  try {
    const eventsRef = ref(db, "events");

    // Assign Secret Santas randomly
    const assignedParticipants = assignSecretSantas(
      selectedUsers.map((user) => user.id)
    );

    // Push event directly (Firebase generates ID automatically)
    await push(eventsRef, {
      name,
      date,
      description,
      createdBy,
      createdAt: serverTimestamp(), // Firebase server timestamp
      participants: assignedParticipants,
    });
  } catch (error) {
    throw error;
  }
};

// Function to randomly assign Secret Santas
const assignSecretSantas = (userIds) => {
  // Fisher-Yates shuffle for a random order
  const shuffled = [...userIds];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Get a random index
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap the elements
  }

  const assignments = {};
  shuffled.forEach((userId, index) => {
    const nextIndex = (index + 1) % shuffled.length;
    assignments[userId] = { assignedTo: shuffled[nextIndex] };
  });

  return assignments;
};

// Function to delete event data from the Realtime Database
export const deleteEventFromDatabase = async (eventId) => {
  try {
    const eventRef = ref(db, `events/${eventId}`);
    // Delete event from database
    await remove(eventRef);

    // Find chats for this event
    const chatQuery = query(
      ref(db, "chats"),
      orderByChild("eventId"),
      equalTo(eventId)
    );
    const chatSnapshot = await get(chatQuery);

    if (chatSnapshot.exists()) {
      const chats = chatSnapshot.val();
      for (const [chatId, chat] of Object.entries(chats)) {
        // Delete the chat itself
        await remove(ref(db, `chats/${chatId}`));

        // Delete the messages for that chat
        await remove(ref(db, `messages/${chatId}`));

        // Delete the unreadMessages for that chat
        const { user1, user2 } = chat;
        await remove(ref(db, `unreadMessages/${user1}/${chatId}`));
        await remove(ref(db, `unreadMessages/${user2}/${chatId}`));
      }
    }
  } catch (error) {
    throw error;
  }
};

// Function to fetch chats for the current user across all events
export const fetchChatsForUser = (userId, setChats) => {
  const chatsRef = ref(db, "chats/");
  const q = query(chatsRef, orderByChild("user1"));

  const unsubscribe = onValue(q, (snapshot) => {
    if (snapshot.exists()) {
      const allChats = snapshot.val();
      const userChats = Object.entries(allChats)
        .map(([id, chat]) => ({ id, ...chat }))
        .filter((chat) => chat.user1 === userId || chat.user2 === userId);
      setChats(userChats);
    } else {
      setChats([]);
    }
  });

  return unsubscribe;
};

// Function to fetch messages for a specific chat
export const fetchMessagesForChat = (chatId, setMessages) => {
  const messagesRef = ref(db, `messages/${chatId}`);
  const unsubscribe = onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const msgs = Object.values(snapshot.val());
      setMessages(msgs.reverse()); // newest last
    } else {
      setMessages([]);
    }
  });

  return unsubscribe;
};

// Function to send a message in a chat
export const sendMessageToChat = async (chatId, senderId, text) => {
  const messagesRef = ref(db, `messages/${chatId}`);
  const newMsgRef = push(messagesRef);
  const timestamp = serverTimestamp();

  // Get chat to determine recipient
  const chatSnapshot = await get(ref(db, `chats/${chatId}`));
  if (!chatSnapshot.exists()) return;

  const chat = chatSnapshot.val();
  const recipientId = chat.user1 === senderId ? chat.user2 : chat.user1;

  await set(newMsgRef, {
    text,
    sender: senderId,
    timestamp,
  });

  // Increment unread count for recipient
  const unreadRef = ref(db, `unreadMessages/${recipientId}/${chatId}`);
  const currentUnreadSnap = await get(unreadRef);
  const currentUnread = currentUnreadSnap.exists() ? currentUnreadSnap.val() : 0;
  await set(unreadRef, currentUnread + 1);
};

// Function to start chat between two users for an event
export const startChatForEvent = async (eventId, user1, user2, displayAs) => {
  // Create a query to check if any chat for this event already exists
  const chatQuery = query(
    ref(db, "chats"),
    orderByChild("eventId"),
    equalTo(eventId)
  );

  try {
    // Get the snapshot of the chats for the eventId
    const snapshot = await get(chatQuery);

    if (snapshot.exists()) {
      const chats = snapshot.val();
      for (const [chatId, chat] of Object.entries(chats)) {
        if (
          (chat.user1 === user1 && chat.user2 === user2) ||
          (chat.user1 === user2 && chat.user2 === user1)
        ) {
          // If a chat already exists, return the chatId
          return chatId;
        }
      }
    }

    // If no existing chat, create a new one
    const chatsRef = ref(db, "chats/");
    const newChatRef = push(chatsRef);
    const chatId = newChatRef.key;

    // Define the roles for both users based on the `displayAs` value
    const user1Role = displayAs; // user1's role
    const user2Role =
      displayAs === "secret_santa" ? "recipient" : "secret_santa"; // user2's role

    // Set the chat data including both roles for user1 and user2
    await set(newChatRef, {
      user1,
      user2,
      eventId,
      roles: {
        [user1]: user1Role,
        [user2]: user2Role,
      },
    });

    // Return the new chatId
    return chatId;
  } catch (error) {
    throw error;
  }
};

// Function to fetch unread message counts for a user
export const fetchUnreadCounts = (userId, setUnreadCounts) => {
  const unreadRef = ref(db, `unreadMessages/${userId}`);
  const unsubscribe = onValue(unreadRef, (snapshot) => {
    if (snapshot.exists()) {
      setUnreadCounts(snapshot.val());
    } else {
      setUnreadCounts({});
    }
  });
  return unsubscribe;
};

// Function to mark messages in a chat as read for a user
export const markMessagesAsRead = async (chatId, userId) => {
  try {
    const unreadRef = ref(db, `unreadMessages/${userId}/${chatId}`);
    await set(unreadRef, 0);
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};

// Fetch wishlists created by or involving the current user from the Realtime Database
export const fetchWishlistsFromDatabase = (currentUserId, setWishlists) => {
  const wishlistsRef = ref(db, "wishlists/");

  // Set up the real-time listener using onValue
  const unsubscribe = onValue(
    wishlistsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const wishlistsList = Object.entries(data)
          .filter(
            ([_, wishlist]) =>
              wishlist.userId === currentUserId ||
              wishlist.secretSantaId === currentUserId
          )
          .map(([id, wishlist]) => ({
            id,
            ...wishlist,
          }));

        setWishlists(wishlistsList); // Update the state with the filtered wishlists
      } else {
        setWishlists([]); // No events found, clear the wishlists state
      }
    },
    (error) => {
      console.error("Error fetching wishlists:", error);
      setWishlists([]);
    }
  );

  // Return the unsubscribe function to stop listening
  return unsubscribe;
};

// Function to save wishlist data to the Realtime Database
export const saveWishlistToDatabase = async (
  eventId,
  userId,
  items,
  secretSantaId
) => {
  try {
    const wishlistRef = ref(db, "wishlists");

    // Push wishlist directly (Firebase generates ID automatically)
    await push(wishlistRef, {
      eventId,
      userId,
      secretSantaId,
      items,
    });
  } catch (error) {
    throw error;
  }
};

// Function to update wishlist items in the Realtime Database
export const updateWishlistInDatabase = async (wishlistId, items) => {
  try {
    const wishlistRef = ref(db, `wishlists/${wishlistId}`);

    // Update wishlist
    await update(wishlistRef, {
      items,
    });
  } catch (error) {
    throw error;
  }
};

// Function to delete wishlist data from the Realtime Database
export const deleteWishlistFromDatabase = async (wishlistId) => {
  try {
    const wishlistRef = ref(db, `wishlists/${wishlistId}`);
    // Delete wishlist from database
    await remove(wishlistRef);
  } catch (error) {
    throw error;
  }
};
