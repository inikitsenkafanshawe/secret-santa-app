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
  createdBy: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#555",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D32F2F",
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    color: "#D32F2F",
    fontSize: 24,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#388E3C",
    marginBottom: 10,
    borderRadius: 8,
  },
  itemText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
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
  placeholder: {
    color: "#B0B0B0",
  },
});

export default styles;
