import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  Switch,
  TouchableOpacity,
  Share,
  TextInput,
} from "react-native";
import Footer from "../../components/Footer";
import { logout, changeThemeColor } from "../../redux/actions/authActions";
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import * as Linking from "expo-linking";
// import { Ionicons,MaterialIcons } from "@expo/vector-icons";
import url from "../../utils/URL";
import Modal from "react-native-modal";
import { baseUrl } from "../../constants/global";

const Settings = (props) => {
  const [toggleValue, setToggleValue] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (!props.auth.isAuthenticated) {
      props.navigation.navigate("SignIn");
    }
  }, [props.auth.isAuthenticated]);
  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });

  const deleteAccount = async (userId) => {
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    let data = {
      userid: userId,
    };
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, data[key]);
    }
    fetch(`${baseUrl}/api/removeuser`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: searchParams.toString(),
    })
      .then((res) => res.json())
      .then((response) => {
        setConfirmDeletion(false);
        props.logout();
      })
      .catch((e) => console.log("Error", e));
  };

  return (
    <View style={{ height: "100%", backgroundColor: "white" }}>
      <View
        style={{
          backgroundColor: props.auth.themeMainColor,
          paddingHorizontal: 30,
          paddingVertical: 25,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Feather name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: 20,
                color: "#FFF",
                fontSize: 18,
                fontWeight: "500",                fontFamily: "Rubik_400Regular",
              }}
            >
              Settings
            </Text>
          </View>
        </View>

        <View style={{ alignItems: "center", marginTop: 20 }}>
          <View>
            <Image
              style={{
                width: 69,
                height: 69,
                borderRadius: 204,
                borderWidth: 2,
                borderColor: "#FFF",
              }}
              resizeMode="contain"
              source={
                !props.auth.picture
                  ? require("../../assets/profilePicture.jpg")
                  : { uri: props.auth.picture }
              }
            />
          </View>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",              marginTop: 10,
              color: "white",
              fontFamily: "Rubik_400Regular",
            }}
          >
            {props.auth.user?.fullname}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "white",
              fontFamily: "Rubik_400Regular",
            }}
          >
            {props.auth.user?.email}
          </Text>
        </View>
      </View>
      <View style={{ marginHorizontal: 30, marginVertical: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontWeight: "600",              fontSize: 20,
              fontFamily: "Rubik_400Regular",
              color: "rgba(24, 24, 24, 1)",
            }}
          >
            Notifications
          </Text>
          <Switch
            value={toggleValue}
            onValueChange={setToggleValue}
            trackColor={{ false: "gray", true: props.auth.themeSecondaryColor }}
            thumbColor={toggleValue ? props.auth.themeMainColor : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            flexDirection: "row",
            marginBottom: 18,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* <Ionicons
              name="color-palette-outline"
              size={24}
              color={props.auth.themeMainColor}
            /> */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",                marginLeft: 20,
                fontFamily: "Rubik_400Regular",
              }}
            >
              Theme
            </Text>
          </View>
          <View
            style={{
              width: 25,
              height: 25,
              borderRadius: 100,
              backgroundColor: props.auth.themeMainColor,
              marginRight: 10,
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flexDirection: "row", marginBottom: 18 }}
          onPress={() =>
            Linking.openURL("mailto:competativeexaminationpakistan@gmail.com")
          }
        >
          {/* <FontAwesome5
            name="slideshare"
            size={24}
            color="rgba(12, 229, 191, 1)"
          /> */}
          {/* <Image
            source={require("../../assets/icons/support.png")}
            style={{ width: 24, height: 24 }}
          /> */}
          {/* <MaterialIcons
            name="support-agent"
            size={24}
            color={props.auth.themeMainColor}
          /> */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",              marginLeft: 20,
              fontFamily: "Rubik_400Regular",
            }}
          >
            Support
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Share.share({
              message:
                "Check out this awesome app: https://competitiveexaminationpakistan.com/",
            })
          }
          style={{ flexDirection: "row", marginBottom: 18 }}
        >
          <Feather name="share-2" size={24} color={props.auth.themeMainColor} />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",              marginLeft: 20,
              fontFamily: "Rubik_400Regular",
            }}
          >
            Share
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => props.navigation.navigate("AboutUs")}
          style={{ flexDirection: "row", marginBottom: 18 }}
        >
          {/* <SimpleLineIcons
            name="question"
            size={20}
            color={props.auth.themeMainColor}
          /> */}

          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",              marginLeft: 22,
              fontFamily: "Rubik_400Regular",
            }}
          >
            About us
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => props.logout()}
          style={{ flexDirection: "row", marginBottom: 18 }}
        >
          <Feather name="log-out" size={24} color="rgba(238, 85, 0, 1)" />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              marginLeft: 20,
              fontFamily: "Rubik_400Regular",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setConfirmDeletion(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 60,
            backgroundColor: "#edf0f5",
            padding: 10,
            borderRadius: 20,
          }}
        >
          {/* <MaterialIcons
            name="delete-outline"
            size={24}
            color="rgba(238, 85, 0, 1)"
          /> */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              marginLeft: 5,
              fontFamily: "Rubik_400Regular",
            }}
          >
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
      <Footer {...props} />
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        backdropOpacity={0.5}
        style={{ margin: 20 }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{ backgroundColor: "white", padding: 30, borderRadius: 20 }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 30,
              }}
            >
              Select Theme
            </Text>

            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <TouchableOpacity
                onPress={() => {
                  props.changeThemeColor({
                    mainColor: "#0E81B4",
                    secondaryColor: "#FF8F0F",
                  });
                  setModalVisible(false);
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor: "#0E81B4",
                    marginRight: 30,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.changeThemeColor({
                    mainColor: "#0CE5BF",
                    secondaryColor: "#FF8F0F",
                  });
                  setModalVisible(false);
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor: "#0CE5BF",
                    marginRight: 30,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.changeThemeColor({
                    mainColor: "#41CBF6",
                    secondaryColor: "#FF8F0F",
                  });
                  setModalVisible(false);
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor: "#41CBF6",
                    marginRight: 30,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.changeThemeColor({
                    mainColor: "#00ba5f",
                    secondaryColor: "#FF8F0F",
                  });
                  setModalVisible(false);
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor: "#00ba5f",
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginVertical: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  props.changeThemeColor({
                    mainColor: "#E9BFB4",
                    secondaryColor: "#AA847D",
                  });
                  setModalVisible(false);
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor: "#E9BFB4",
                    marginRight: 30,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.changeThemeColor({
                    mainColor: "#CC84DE",
                    secondaryColor: "#FF4894",
                  });
                  setModalVisible(false);
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor: "#CC84DE",
                    marginRight: 30,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.changeThemeColor({
                    mainColor: "#07173B",
                    secondaryColor: "#FF8F0F",
                  });
                  setModalVisible(false);
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor: "#07173B",
                    marginRight: 30,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.changeThemeColor({
                    mainColor: "#A4443C",
                    secondaryColor: "#657C74",
                  });
                  setModalVisible(false);
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor: "#A4443C",
                  }}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: props.auth.themeMainColor,
                borderRadius: 100,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginTop: 60,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={confirmDeletion}
        onBackdropPress={() => setConfirmDeletion(false)}
        backdropOpacity={0.5}
        style={{ margin: 20 }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{ backgroundColor: "white", padding: 30, borderRadius: 20 }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 15,
                textAlign: "center",
              }}
            >
              Disclaimer
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginBottom: 0,
              }}
            >
              Are you sure to delete your account?
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginBottom: 30,
              }}
            >
              This action cannot be reversed.
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginBottom: 30,
              }}
            >
              Type "confirm" to delete your account.
            </Text>
            <TextInput
              placeholder="Type `confirm` here"
              autoCapitalize="none"
              value={confirm}
              onChangeText={(t) => {
                setConfirm(t.trimEnd());
              }}
              style={{
                color: "black",
                fontFamily: "Rubik_400Regular",
                fontSize: 14,
                borderWidth: 1,
                borderColor: "lightgray",
                borderRadius: 20,
                padding: 5,
                paddingLeft: 15,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 25,
              }}
            >
              <TouchableOpacity
                onPress={() => deleteAccount(props.auth.user.id)}
                style={{
                  backgroundColor: confirm === "confirm" ? "red" : "lightgray",
                  borderRadius: 20,
                  paddingVertical: 10,
                  width: "45%",
                }}
                disabled={confirm !== "confirm"}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  Delete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setConfirmDeletion(false)}
                style={{
                  backgroundColor: props.auth.themeMainColor,
                  borderRadius: 20,
                  paddingVertical: 10,
                  width: "45%",
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout, changeThemeColor })(Settings);
