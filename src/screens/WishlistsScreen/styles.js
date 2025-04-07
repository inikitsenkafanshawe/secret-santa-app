import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE5B4",
    padding: 20,
  },
  wishlistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#388E3C",
    marginBottom: 10,
    borderRadius: 8,
  },
  secretSanta: {
    backgroundColor: "#F2A900",
  },
  wishlistInfo: {
    flex: 1,
  },
  eventText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  userText: {
    color: "#B0B0B0",
    fontSize: 14,
    marginTop: 5,
  },
  error: {
    color: "#FF6347",
    fontSize: 16,
    textAlign: "center",
  },
});

export default styles;
