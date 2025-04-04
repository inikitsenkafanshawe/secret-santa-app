import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE5B4",
    padding: 20,
  },
  searchBar: {
    height: 50,
    borderColor: "#D32F2F",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  placeholder: {
    color: "#B0B0B0",
  },
  eventItem: {
    padding: 15,
    backgroundColor: "#388E3C",
    marginBottom: 10,
    borderRadius: 8,
  },
  eventText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  fab: {
    backgroundColor: "#D32F2F",
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "#FF6347",
    fontSize: 16,
    textAlign: "center",
  },
});

export default styles;
