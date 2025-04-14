import React, { useContext, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./styles";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { WishlistsContext } from "../../context/WishlistsContext";
import { UsersContext } from "../../context/UsersContext";
import { EventsContext } from "../../context/EventsContext";
import { UserContext } from "../../context/UserContext";
import Message from "../../components/Message";
import ConfirmationModal from "../../components/ConfirmationModal";

const WishlistDetailsScreen = ({ navigation, route }) => {
  const { wishlistId } = route.params; // Get wishlist ID from navigation params
  const { getWishlistById, updateWishlist, deleteWishlist } =
    useContext(WishlistsContext);
  const { getUserById } = useContext(UsersContext);
  const { getEventById } = useContext(EventsContext);
  const { currentUser } = useContext(UserContext);
  const wishlist = getWishlistById(wishlistId);
  const event = wishlist ? getEventById(wishlist.eventId) : null;
  const creator = wishlist ? getUserById(wishlist.userId) : null;
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState(wishlist ? wishlist?.items : []);
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // Message visibility state
  const [isVisible, setIsVisible] = useState(false); // ConfirmationModal visibility state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useFocusEffect(() => {
    navigation.getParent().setOptions({ headerShown: false }); // Hide Drawer header
  });

  if (!wishlist) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Wishlist not found</Text>
      </View>
    );
  }

  const handleAddItem = () => {
    if (newItem.trim()) {
      const updatedItems = [newItem, ...items];
      setItems(updatedItems);
      setNewItem(""); // Reset input field
    }
  };

  const handleDeleteItem = (itemToDelete) => {
    const updatedItems = items.filter((item) => item !== itemToDelete);
    setItems(updatedItems);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item}</Text>
      {currentUser.uid === wishlist?.userId && (
        <TouchableOpacity onPress={() => handleDeleteItem(item)}>
          <FontAwesome5 name="trash-alt" size={18} color="#D32F2F" />
        </TouchableOpacity>
      )}
    </View>
  );

  const handleUpdateWishlist = async () => {
    // Reset errors before checking
    setError("");
    // Hide the error overlay
    setIsVisible(false);
    // Show the loading state
    setIsLoading(true);

    // Validate items
    if (items.length < 1) {
      // Show error message
      setError("You need to add items to your wishlist.");
      setIsVisible(true);
      // Hide the loading state
      setIsLoading(false);
      return;
    }

    try {
      // Save wishlist using saveWishlist
      await updateWishlist(wishlistId, items);
      // Navigate back after wishlist creation
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
      // Delete wishlist using deleteWishlist
      await deleteWishlist(wishlistId);
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
      <Text style={styles.eventName}>{event?.name || "Deleted"}</Text>
      <Text style={styles.createdBy}>
        Created by: {creator?.name} ({creator?.email})
      </Text>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}`}
        ListHeaderComponent={
          currentUser.uid === wishlist?.userId && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Add new item"
                placeholderTextColor={styles.placeholder.color}
                value={newItem}
                onChangeText={setNewItem}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddItem}
              >
                <FontAwesome5 name="plus" size={20} color="#D32F2F" />
              </TouchableOpacity>
            </View>
          )
        }
      />

      {currentUser.uid === wishlist?.userId && (
        <>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleUpdateWishlist}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                <FontAwesome5 name="save" size={16} /> Update Wishlist
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                <FontAwesome5 name="trash-alt" size={16} /> Delete Wishlist
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}
      <ConfirmationModal
        isVisible={isModalVisible}
        title="Delete Wishlist"
        message="Are you sure you want to delete this wishlist?"
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

export default WishlistDetailsScreen;
