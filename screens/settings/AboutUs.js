import {
  View,
  Text,
  Image,
  TouchableOpacity,
  use,
  ScrollView,
} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import { useFonts } from "expo-font";

const AboutUs = (props) => {
  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });
  return (
    <ScrollView
      style={{ paddingTop: 20, paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <View style={{ flexDirection: "row", marginTop: 20, marginBottom: 40 }}>
          <TouchableOpacity
            style={{ left: 20 }}
            onPress={() => props.navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Rubik_400Regular",
              color: "black",
              marginLeft: 45,
            }}
          >
            About Us
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/CEPLogo.png")}
            style={{ width: 78, height: 33 }}
          />
        </View>
        <View style={{ margin: 20 }}>
          <Text
            style={{
              color: "black",
              marginTop: 20,
              fontFamily: "Rubik_400Regular",
              fontSize: 24,
              marginBottom: 20,
            }}
          >
            Welcome!
          </Text>
          <Text
            style={{
              color: "rgba(139, 139, 139, 1)",
              marginBottom: 20,
              fontFamily: "Rubik_400Regular",
            }}
          >
            We are a passionate team of innovators, creators, and
            problem-solvers dedicated to making a difference in the world. Our
            mission is to provide high-quality products and services that
            improve the lives of our customers and make a positive impact on the
            environment. We believe in the power of collaboration and are
            committed to working closely with our customers, partners, and
            community to achieve our goals. Thank you for choosing us and for
            being a part of our journey.
          </Text>
          <Text
            style={{
              color: "rgba(139, 139, 139, 1)",
              marginBottom: 20,
              fontFamily: "Rubik_400Regular",
            }}
          >
            We are a passionate team of innovators, creators, and
            problem-solvers dedicated to making a difference in the world. Our
            mission is to provide high-quality products and services that
            improve the lives of our customers and make a positive impact on the
            environment. We believe in the power of collaboration and are
            committed to working closely with our customers, partners, and
            community to achieve our goals. Thank you for choosing us and for
            being a part of our journey.
          </Text>
          <Text
            style={{
              color: "rgba(139, 139, 139, 1)",
              marginBottom: 20,
              fontFamily: "Rubik_400Regular",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Disclaimer:</Text> This app is
            not affiliated with or endorsed by any government entity. The
            information provided is for general reference only and is sourced
            from publicly available government data.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AboutUs;
