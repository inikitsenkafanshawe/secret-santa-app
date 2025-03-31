import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../components/CustomDrawerContent";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import EventNavigator from "./EventNavigator";

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="EventsStack"
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTintColor: "#388E3C",
        headerStyle: {
          backgroundColor: "white",
        },
        drawerStyle: {
          backgroundColor: "white",
          width: 250,
        },
        drawerItemStyle: {
          borderRadius: 8,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
        drawerActiveTintColor: "white",
        drawerActiveBackgroundColor: "#388E3C",
        drawerInactiveTintColor: "#A9A9A9",
      }}
    >
      <Drawer.Screen
        name="EventsStack"
        component={EventNavigator}
        options={{
          title: "Events",
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="home" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ChatsStack"
        // Implement ChatNavigator
        component={EventNavigator}
        options={{
          title: "Chats",
          drawerIcon: ({ color }) => (
            <FontAwesome6 name="message" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="WishlistsStack"
        // Implement WishlistNavigator
        component={EventNavigator}
        options={{
          title: "Wishlists",
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="list-alt" size={20} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppNavigator;
