import React from "react";
import { SafeAreaView, Text, Image, TouchableOpacity } from "react-native";
import styles from "./styles";

const OnboardingScreen2 = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../../assets/letter.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Chat with Your Santa</Text>
      <Text style={styles.subtitle}>
        Keep the fun going! Send anonymous messages and hints to your giftee or
        Santa.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Onboarding3")}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingScreen2;
