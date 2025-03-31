import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import {
  fetchEventsFromDatabase,
  saveEventToDatabase,
  deleteEventFromDatabase,
} from "../services/dbService";

// Create a context for events
export const EventsContext = createContext();

// Create a provider component for events
export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    // Check if user is authenticated
    if (currentUser) {
      // Call fetchEventsFromDatabase to start listening for changes
      const unsubscribeEvents = fetchEventsFromDatabase(
        currentUser.uid,
        setEvents
      );

      // Cleanup listener when currentUser changes or component unmounts
      return () => {
        unsubscribeEvents(); // Unsubscribe from the previous listener
      };
    } else {
      // Clear events if no currentUser
      setEvents([]);
    }
  }, [currentUser]); // Run the effect when currentUser changes

  // Function to get an event by ID
  const getEventById = (eventId) => {
    return events.find((event) => event.id === eventId) || null;
  };

  // Function to save event data to the Realtime Database
  const saveEvent = async (name, description, selectedUsers) => {
    try {
      await saveEventToDatabase(
        name,
        description,
        currentUser.uid,
        selectedUsers
      );
    } catch (error) {
      console.error("Error saving event: ", error);
      throw error;
    }
  };

  // Function to delete event data from the Realtime Database
  const deleteEvent = async (eventId) => {
    try {
      await deleteEventFromDatabase(eventId);
    } catch (error) {
      console.error("Error deleting event: ", error);
      throw error;
    }
  };

  return (
    <EventsContext.Provider
      value={{ events, getEventById, saveEvent, deleteEvent }}
    >
      {children}
    </EventsContext.Provider>
  );
};
