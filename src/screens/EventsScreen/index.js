import React, { useContext, useState } from "react";
import {
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import styles from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { EventsContext } from "../../context/EventsContext";

const EventsScreen = ({ navigation }) => {
  const { events } = useContext(EventsContext);
  const [search, setSearch] = useState("");

  useFocusEffect(() => {
    navigation.getParent().setOptions({ headerShown: true }); // Show Drawer header
  });

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {events && events.length > 0 ? (
        <FlatList
          ListHeaderComponent={
            <TextInput
              style={styles.searchBar}
              placeholder="Search by name..."
              placeholderTextColor={styles.placeholder.color}
              value={search}
              onChangeText={setSearch}
            />
          }
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.eventItem}
              onPress={() =>
                navigation.navigate("EventDetails", { eventId: item.id })
              }
            >
              <Text style={styles.eventText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.error}>Events not found</Text>
          }
        />
      ) : (
        <View style={styles.empty}>
          <Image
            source={require("../../../assets/mailbox.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Looks a little empty here...</Text>
          <Text style={styles.subtitle}>
            Tap the + button to create your first event and kick off the holiday
            magic.
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("NewEvent")}
      >
        <FontAwesome5 name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default EventsScreen;
