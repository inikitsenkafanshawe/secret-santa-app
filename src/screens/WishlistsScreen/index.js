import React, { useContext } from "react";
import { Text, FlatList, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { WishlistsContext } from "../../context/WishlistsContext";
import { UsersContext } from "../../context/UsersContext";
import { EventsContext } from "../../context/EventsContext";
import { UserContext } from "../../context/UserContext";

const WishlistsScreen = ({ navigation }) => {
  const { wishlists } = useContext(WishlistsContext);
  const { getUserById } = useContext(UsersContext);
  const { getEventById } = useContext(EventsContext);
  const { currentUser } = useContext(UserContext);

  useFocusEffect(() => {
    navigation.getParent().setOptions({ headerShown: true }); // Show Drawer header
  });

  const renderWishlist = ({ item }) => {
    const user = getUserById(item.userId);
    const event = getEventById(item.eventId);
    const isSecretSanta = currentUser.uid === item.secretSantaId;

    return (
      <TouchableOpacity
        style={[styles.wishlistItem, isSecretSanta && styles.secretSanta]}
        onPress={() =>
          navigation.navigate("WishlistDetails", { wishlistId: item.id })
        }
      >
        <View style={styles.wishlistInfo}>
          <Text style={styles.eventText}>{event?.name || "Unnamed Event"}</Text>
          <Text style={styles.userText}>
            Created by: {user?.name || item.userId}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlists}
        keyExtractor={(item) => item.id}
        renderItem={renderWishlist}
        ListEmptyComponent={
          <Text style={styles.error}>No wishlists available</Text>
        }
      />
    </View>
  );
};

export default WishlistsScreen;
