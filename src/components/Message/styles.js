import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      container: {
        backgroundColor: "white",
        padding: 20,
        width: "70%",
        borderRadius: 10,
        alignItems: "center",
      },
      title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
      },
      message: {
        fontSize: 16,
        textAlign: "center",
      },
      button: {
        marginTop: 20,
        backgroundColor: "#388E3C",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
      },
      buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
      },
});

export default styles;