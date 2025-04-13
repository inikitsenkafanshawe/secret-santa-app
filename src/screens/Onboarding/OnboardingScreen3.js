import React, { useContext } from "react";
import { SafeAreaView, Text, Image, TouchableOpacity } from "react-native";
import styles from "./styles";
import { OnboardingContext } from "../../context/OnboardingContext";

const OnboardingScreen3 = () => {
  const { completeOnboarding } = useContext(OnboardingContext);

  const handleFinish = async () => {
    await completeOnboarding();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../../assets/christmas-presents.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Create Your Wishlist</Text>
      <Text style={styles.subtitle}>
        Add your dream gifts to your wishlist so your Secret Santa knows what to
        get!
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleFinish}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingScreen3;
