import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

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
    <View style={{ marginBottom: 10 }}>
      {timeOfDay === "morning" && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../assets/icons/morning.png")}
            style={{ width: 15, height: 15 }}
          />
          <Text style={{ marginLeft: 10, fontSize: 13,color:'white' }}>Good Morning!</Text>
        </View>
      )}
      {timeOfDay === "afternoon" && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* <Ionicons name="ios-partly-sunny" size={15} color="yellow" /> */}
          <Text style={{ marginLeft: 10, fontSize: 13,color:'white' }}>Good Afternoon!</Text>
        </View>
      )}
      {timeOfDay === "night" && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* <Ionicons name="ios-moon" size={15} color="white" /> */}
          <Text style={{ marginLeft: 10, fontSize: 13,color:'white' }}>
            Good Evening!
          </Text>
        </View>
      )}
    </View>
  );
};

export default Greetings;
