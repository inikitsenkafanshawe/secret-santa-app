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
import { EventsContext } from "../../context/EventsContext";
import Message from "../../components/Message";

const NewWishlistScreen = ({ navigation, route }) => {
  const { eventId, secretSantaId } = route.params; // Get event ID and secret Santa ID from navigation params
  const { saveWishlist } = useContext(WishlistsContext);
  const { getEventById } = useContext(EventsContext);
  const event = getEventById(eventId);
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false); // Message visibility state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useFocusEffect(() => {
    navigation.getParent().setOptions({ headerShown: false }); // Hide Drawer header
  });

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

  const handleSaveWishlist = async () => {
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
      await saveWishlist(eventId, items, secretSantaId);
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

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item}</Text>
      <TouchableOpacity onPress={() => handleDeleteItem(item)}>
        <FontAwesome5 name="trash-alt" size={18} color="#D32F2F" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.eventName}>Event: {event?.name || "Deleted"}</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}`}
        ListHeaderComponent={
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add new item"
              placeholderTextColor={styles.placeholder.color}
              value={newItem}
              onChangeText={setNewItem}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <FontAwesome5 name="plus" size={20} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSaveWishlist}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Create</Text>
        )}
      </TouchableOpacity>

      <Message
        isVisible={isVisible}
        message={error}
        onClose={() => setIsVisible(false)}
        title="Error"
      />
    </View>
  );
};

export default NewWishlistScreen;
