import React from "react";
import { SafeAreaView, Text, Image, TouchableOpacity } from "react-native";
import styles from "./styles";

const OnboardingScreen1 = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../../assets/mailbox.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Create Events</Text>
      <Text style={styles.subtitle}>
        Set up Secret Santa events in just a few taps. Invite friends and start
        gifting!
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Onboarding2")}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingScreen1;
