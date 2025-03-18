import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import FastImage from 'react-native-fast-image'

const Subject = ({ navigation, item }) => {

                              

  return (
      <TouchableOpacity
        style={{
          borderRadius: 12,
          backgroundColor: "rgba(245, 245, 245, 1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "48%",
          height: 145,
          borderWidth: 0.5,
          borderColor: "#DADADA",
          marginVertical: 10,
        }}
        onPress={() =>
          navigation.navigate("SubjectSelected", {
            subject: item.name,
            id: item.id,
            totalQuestions: item.totalquestions,
          })
        }
        key={item.id}
      >
        <View
          style={{
            backgroundColor: "#DDF4F0",
            borderRadius: 100,
            padding: 10,
            marginBottom: 5,
          }}
        >
          <Image
            resizeMode="contain"
            source={{ uri: `${item.icon}` }}
            style={{ width: 26, height: 26 }}
          />
        </View>
        <Text
          style={{
            fontSize: 14,
            color: "black",
            fontWeight: "bold",
            marginHorizontal: 10,
            textAlign: "center",
            fontFamily: "Rubik_400Regular",
          }}
          selectable={false}
        >
          {item.name}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "rgba(255, 143, 15, 1)",
            fontWeight: 400,
            marginTop: 5,
          }}
          selectable={false}
        >
          {item.totalquestions === 0
            ? "coming soon"
            : `${Math.trunc(item.totalquestions / 10)} Quiz`}
        </Text>
      </TouchableOpacity>
  );
};

export default Subject;
