import { StyleSheet } from "react-native";

const chatDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE5B4",
    padding: 10,
  },
  messageContainer: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 4,
    borderRadius: 12,
    maxWidth: "75%",
  },
  myMessage: {
    backgroundColor: "#F2A900",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#388E3C",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderColor: "#CCC",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#D32F2F",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: "#FFF",
  },
  sendButton: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  chatTextBold: {
    color: "#D32F2F",
    fontWeight: "bold",
    fontSize: 18,
  },
  chatText: {
    color: "#D32F2F",
    fontSize: 18,
  },
  timestampText: {
    fontSize: 12,
    color: "#E0E0E0",
    marginTop: 5,
    textAlign: "right",
  },
  error: {
    color: "#FF6347",
    fontSize: 16,
    textAlign: "center",
  },
});

export default chatDetailsStyles;