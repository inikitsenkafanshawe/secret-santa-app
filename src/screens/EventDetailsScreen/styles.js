import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE5B4",
    padding: 20,
  },
  eventName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D32F2F",
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  createdBy: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#555",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D32F2F",
    marginBottom: 10,
  },
  userItem: {
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
  userInfo: {
    flex: 1,
  },
  userText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  userEmail: {
    color: "#E0E0E0",
    fontSize: 14,
  },
  assignedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  assignedTo: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "#FF6347",
    fontSize: 16,
    textAlign: "center",
  },
});

export default styles;
