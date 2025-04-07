import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ChatsScreen from "../screens/ChatsScreen";
import ChatDetailsScreen from "../screens/ChatDetailsScreen";

const Stack = createStackNavigator();

const ChatNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#388E3C",
        headerStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Stack.Screen
        name="Chats"
        component={ChatsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatDetails"
        component={ChatDetailsScreen}
        options={{
          headerShown: true,
          headerTitle: "Chat",
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
