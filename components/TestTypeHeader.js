import { View, Text, Image } from "react-native";
import React from "react";
import Greetings from "./Greetings";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";

const TestTypeHeader = (props) => {
  return (
    <View
      style={{
        backgroundColor: props.auth.themeMainColor,
      }}
    >
      <View
        style={{
          padding: 30,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            height: 50,
          }}
        >
          <View>
            <Greetings />

            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                color: "white",
              }}
            >
              {props.auth.user?.fullname}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Profile")}
          >
            <Image
              style={{
                width: 45,
                height: 45,
                borderRadius: 204,
                borderWidth: 1,
                borderColor: "#FFF",
              }}
              source={
                !props.auth.picture
                  ? require("../assets/profilePicture.jpg")
                  : { uri: props.auth.picture }
              }
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(TestTypeHeader);
