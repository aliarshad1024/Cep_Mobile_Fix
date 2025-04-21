import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Greetings = () => {
  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setTimeOfDay("morning");
    } else if (hour >= 12 && hour < 18) {
      setTimeOfDay("afternoon");
    } else {
      setTimeOfDay("night");
    }
  }, []);

  return (
    <View>
      {timeOfDay === "morning" && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../assets/icons/morning.png")}
            style={{ width: 25, height: 25 }}
          />
          <Text style={{ marginLeft: 10, fontSize: 16,color:'white',fontWeight:"600" }}>Good Morning!</Text>
        </View>
      )}
      {timeOfDay === "afternoon" && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="ios-partly-sunny" size={25} color="yellow" />
          <Text style={{ marginLeft: 10, fontSize: 16,color:'white',fontWeight:"600" }}>Good Afternoon!</Text>
        </View>
      )}
      {timeOfDay === "night" && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="ios-moon" size={25} color="white" />
          <Text style={{ marginLeft: 10, fontSize: 16,color:'white', fontWeight:"600" }}>
            Good Evening!
          </Text>
        </View>
      )}
    </View>
  );
};

export default Greetings;
