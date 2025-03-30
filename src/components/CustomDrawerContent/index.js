import React from "react";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { logoutUser } from "../../services/authService";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const CustomDrawerContent = (props) => {
  const handleLogout = async () => {
    try {
      // Calls the logoutUser function from authService
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
        icon={() => (
          <FontAwesome5 name="sign-out-alt" size={20} color="#A9A9A9" />
        )}
        style={{
          borderRadius: 8,
        }}
        labelStyle={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#A9A9A9",
        }}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
