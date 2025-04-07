import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import CustomDrawerContent from "../components/CustomDrawerContent";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import EventNavigator from "./EventNavigator";
import ChatNavigator from "./ChatNavigator";
import { ChatsContext } from "../context/ChatsContext";

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  // Unread messages count for chat Drawer Screen icon
  const { getTotalUnreadCount } = useContext(ChatsContext);
  const unreadCount = getTotalUnreadCount?.() || 0;

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
        component={ChatNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "Chats";
      
          return {
            title: "Chats",
            headerShown: routeName !== "ChatDetails",
            drawerIcon: ({ color }) => (
              <View style={{ position: "relative" }}>
                <FontAwesome6 name="message" size={20} color={color} />
                {unreadCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -8,
                      backgroundColor: "red",
                      borderRadius: 10,
                      width: 18,
                      height: 18,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          };
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
