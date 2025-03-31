import { db } from "../config/firebaseConfig";
import { onValue, orderByChild, ref, query, set, push, remove, serverTimestamp } from "firebase/database";

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
  } catch (error) {
    throw error;
  }
};
