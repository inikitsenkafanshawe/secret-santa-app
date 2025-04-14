import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE5B4",
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: "#D32F2F",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
    paddingVertical: 10,
  },
  placeholder: {
    color: "#B0B0B0",
  },
  error: {
    color: "#FF6347",
    fontSize: 14,
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
    columnGap: 15,
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
});

export default styles;
