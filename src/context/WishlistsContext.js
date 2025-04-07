import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import {
  fetchWishlistsFromDatabase,
  saveWishlistToDatabase,
  updateWishlistInDatabase,
  deleteWishlistFromDatabase,
} from "../services/dbService";

// Create a context for wishlists
export const WishlistsContext = createContext();

// Create a provider component for wishlists
export const WishlistsProvider = ({ children }) => {
  const [wishlists, setWishlists] = useState([]);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    // Check if user is authenticated
    if (currentUser) {
      // Call fetchWishlistsFromDatabase to start listening for changes
      const unsubscribe = fetchWishlistsFromDatabase(
        currentUser.uid,
        setWishlists
      );

      // Cleanup listener when currentUser changes or component unmounts
      return () => {
        unsubscribe(); // Unsubscribe from the previous listener
      };
    } else {
      // Clear wishlists if no currentUser
      setWishlists([]);
    }
  }, [currentUser]);

  // Function to get a wishlist by ID
  const getWishlistById = (wishlistId) => {
    return wishlists.find((wishlist) => wishlist.id === wishlistId) || null;
  };

  // Function to get a wishlist created by a specific user for a specific event
  const getWishlistByEventAndUser = (eventId, userId) => {
    return (
      wishlists.find(
        (wishlist) => wishlist.eventId === eventId && wishlist.userId === userId
      ) || null
    );
  };

  // Function to get a wishlist assigned to a specific Santa for a specific event
  const getWishlistByEventAndSanta = (eventId, santaId) => {
    return (
      wishlists.find(
        (wishlist) =>
          wishlist.eventId === eventId && wishlist.secretSantaId === santaId
      ) || null
    );
  };

  // Function to save wishlist data to the Realtime Database
  const saveWishlist = async (eventId, items, secretSantaId) => {
    try {
      await saveWishlistToDatabase(
        eventId,
        currentUser.uid,
        items,
        secretSantaId
      );
    } catch (error) {
      console.error("Error saving wishlist:", error);
      throw error;
    }
  };

  // Function to update wishlist items in the Realtime Database
  const updateWishlist = async (wishlistId, items) => {
    try {
      await updateWishlistInDatabase(wishlistId, items);
    } catch (error) {
      console.error("Error saving wishlist:", error);
      throw error;
    }
  };

  // Function to delete wishlist data from the Realtime Database
  const deleteWishlist = async (wishlistId) => {
    try {
      await deleteWishlistFromDatabase(wishlistId);
    } catch (error) {
      console.error("Error deleting wishlist:", error);
      throw error;
    }
  };

  return (
    <WishlistsContext.Provider
      value={{
        wishlists,
        getWishlistById,
        getWishlistByEventAndUser,
        getWishlistByEventAndSanta,
        saveWishlist,
        updateWishlist,
        deleteWishlist,
      }}
    >
      {children}
    </WishlistsContext.Provider>
  );
};
