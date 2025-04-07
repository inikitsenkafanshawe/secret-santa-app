import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WishlistsScreen from "../screens/WishlistsScreen";
import NewWishlistScreen from "../screens/NewWishlistScreen";
import WishlistDetailsScreen from "../screens/WishlistDetailsScreen";


const Stack = createStackNavigator();

const WishlistNavigator = () => {
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
        name="Wishlists"
        component={WishlistsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewWishlist"
        component={NewWishlistScreen}
        options={{ headerShown: true, title: "New Wishlist" }}
      />
      <Stack.Screen
        name="WishlistDetails"
        component={WishlistDetailsScreen}
        options={{ headerShown: true, title: "Wishlist Details" }}
      />
    </Stack.Navigator>
  );
};

export default WishlistNavigator;
