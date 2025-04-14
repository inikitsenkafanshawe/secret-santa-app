import { StyleSheet } from "react-native";

const chatsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE5B4",
    padding: 20,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#D32F2F",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  chatItem: {
    padding: 15,
    backgroundColor: "#388E3C",
    marginBottom: 10,
    borderRadius: 8,
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  chatTextBold: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  chatText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  error: {
    color: "#FF6347",
    fontSize: 16,
    textAlign: "center",
  },
  badge: {
    marginTop: 10,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default chatsStyles;
