import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { connect } from "react-redux";
import { changeThemeColor } from "../redux/actions/authActions";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
const Footer = (props) => {
  let jobsActive;
  let profileActive;
  switch (props.auth.themeMainColor) {
    case "#0E81B4":
      jobsActive = require("../assets/icons/footer/jobs0e81b4.png");
      profileActive = require("../assets/icons/footer/profile0e81b4.png");

      break;
    case "#0CE5BF":
      jobsActive = require("../assets/icons/footer/jobs0ce5bf.png");
      profileActive = require("../assets/icons/footer/profile0ce5bf.png");

      break;
    case "#41CBF6":
      jobsActive = require("../assets/icons/footer/jobs41cbf6.png");
      profileActive = require("../assets/icons/footer/profile41cbf6.png");

      break;
    case "#006769":
      jobsActive = require("../assets/icons/footer/jobs006769.png");
      profileActive = require("../assets/icons/footer/profile006769.png");

      break;
    case "#E9BFB4":
      jobsActive = require("../assets/icons/footer/jobse9bfb4.png");
      profileActive = require("../assets/icons/footer/profilee9bfb4.png");

      break;
    case "#CC84DE":
      jobsActive = require("../assets/icons/footer/jobscc84de.png");
      profileActive = require("../assets/icons/footer/profilecc84de.png");

      break;
    case "#95C0B1":
      jobsActive = require("../assets/icons/footer/jobs95c0b1.png");
      profileActive = require("../assets/icons/footer/profile95c0b1.png");

      break;
    case "#A4443C":
      jobsActive = require("../assets/icons/footer/jobsa4443c.png");
      profileActive = require("../assets/icons/footer/profilea4443c.png");

      break;

    // add more cases for other theme colors
    default:
      jobsActive = require("../assets/icons/footer/jobs0e81b4.png");
      profileActive = require("../assets/icons/footer/profile0e81b4.png");
  }
  return (
    <View
      style={{
        flexDirection: "row",
        height: 70,
        backgroundColor: "white",
        position: "absolute",
        borderColor: "#e6e6e6",
        borderWidth: 1,
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
      }}
    >
      <TouchableOpacity
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        onPress={() => props.navigation.navigate("TestType")}
      >
         {/* <Image
          source={
            props.route.name === "Home"
              ? jobsActive
              : require("../assets/icons/footer/home.png")
          }
          style={{ width: 26, height: 26 }}
        /> */}
        {/* <MaterialIcons
          name="home"
          size={24}
          style={{
            color:
              props.route.name === "TestType" ||
              props.route.name === "SelectSubject" ||
              props.route.name === "SubjectSelected"
                ? "#0CE5BF"
                : "#333",
          }}
        /> */}
        <Ionicons
          name="home"
          size={26}
          color={
            props.route.name === "TestType" ||
            props.route.name === "SelectSubject" ||
            props.route.name === "CustomizeQuiz" ||
            props.route.name === "SubjectSelected"
              ? props.auth.themeMainColor
              : "black"
          }
        />

        <Text style={{ fontSize: 10, color: "rgba(176, 176, 176, 1)" }}>
          Home
        </Text>
        {(props.route.name === "TestType" ||
          props.route.name === "SelectSubject" ||
          props.route.name === "CustomizeQuiz" ||
          props.route.name === "SubjectSelected") && (
          <View
            style={{
              borderBottomColor: props.auth.themeMainColor,
              borderBottomWidth: 2,
              width: 30,
              marginTop: 5,
            }}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        onPress={() => props.navigation.navigate("Jobs")}
      >
        <Image
          source={
            props.route.name === "Jobs"
              ? jobsActive
              : require("../assets/icons/footer/jobs.png")
          }
          style={{ width: 26, height: 26 }}
        />
        {/* <FontAwesome name="briefcase" size={26}
         color={
          props.route.name === "Jobs"
            ? props.auth.themeMainColor
            : "black"
        }
       /> */}
        <Text style={{ fontSize: 10, color: "rgba(176, 176, 176, 1)" }}>
          Jobs
        </Text>
        {props.route.name === "Jobs" && (
          <View
            style={{
              borderBottomColor: props.auth.themeMainColor,
              borderBottomWidth: 2,
              width: 40,
              marginTop: 5,
            }}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        onPress={() => props.navigation.navigate("Profile")}
      >
        <Image
          source={
            props.route.name === "Profile"
              ? profileActive
              : require("../assets/icons/footer/profile.png")
          }
          style={{ width: 26, height: 26 }}
        />

        <Text style={{ fontSize: 10, color: "rgba(176, 176, 176, 1)" }}>
          Profile
        </Text>
        {props.route.name === "Profile" && (
          <View
            style={{
              borderBottomColor: props.auth.themeMainColor,
              borderBottomWidth: 2,
              width: 40,
              marginTop: 5,
            }}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        onPress={() => props.navigation.navigate("Settings")}
      >
         {/* <Image
          source={
            props.route.name === "Settings"
              ? jobsActive
              : require("../assets/icons/footer/home.png")
          }
          style={{ width: 26, height: 26 }}
        /> */}
        <Ionicons
          name="md-settings"
          size={26}
          color={
            props.route.name === "Settings"
              ? props.auth.themeMainColor
              : "black"
          }
        />

        <Text style={{ fontSize: 10, color: "rgba(176, 176, 176, 1)" }}>
          Settings
        </Text>
        {props.route.name === "Settings" && (
          <View
            style={{
              borderBottomColor: props.auth.themeMainColor,
              borderBottomWidth: 2,
              width: 40,
              marginTop: 5,
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { changeThemeColor })(Footer);
