import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
// import { Feather } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { Checkbox } from "expo-checkbox";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { welcomePageSeen } from "../redux/actions/authActions";
import url from "../utils/URL";
import Loading from "../components/Loading";
import { baseUrl } from "../constants/global";

const AppIntro = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [video, setVideo] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${baseUrl}/api/getyoutubevideo`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        // Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVideo(data.data)
        setLoading(false)
        console.log("response", data.data);
      })
      .catch((e) => {
        console.log("Error", e);
      });
  }, []);
  return (
    <View>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 40,
            marginLeft: 20,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              marginRight: 20,
              fontSize: 24,
              fontWeight: "500",
            }}
          >
            App Introduction
          </Text>
        </View>
        <Text
          style={{
            color: "rgba(130, 130, 130, 1)",
            fontSize: 20,
            fontWeight: "500",
            marginLeft: 20,
            marginBottom: 20,
          }}
        >
          How to use this app
        </Text>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: 311, height: 222 }}>
            <WebView
              source={{
                uri: video,
              }}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        <View>
          <Text
            style={{
              fontSize: 13,
              color: "rgba(130, 130, 130, 1)",
              margin: 25,
            }}
          >
            You can add some lines here about introduction of app or little bit
            procedure steps for easy to understand.
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => 
              props.navigation.navigate("TestType")}
            style={{
              backgroundColor: props.auth.themeMainColor,
              borderRadius: 100,
              paddingVertical: 15,
              marginTop: 70,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>Next</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(true)} style={{}}>
            <Text
              style={{
                color: "rgba(130, 130, 130, 1)",
                fontSize: 14,
                textAlign: "right",
                marginTop: 20,
              }}
            >
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
          backdropOpacity={0.5}
          style={{ margin: 20 }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View style={{ backgroundColor: "white", padding: 20 }}>
              <Text
                style={{
                  fontSize: 13,
                  color: "rgba(130, 130, 130, 1)",
                }}
              >
                Clicking on this button video will not appear for next time
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 20,
                }}
              >
                <Checkbox
                  style={{ color: "rgba(176, 176, 176, 1)" }}
                  value={dontShowAgain}
                  onValueChange={setDontShowAgain}
                />
                <Text
                  style={{
                    color: "rgba(176, 176, 176, 1)",
                    marginLeft: 15,
                  }}
                >
                  Don't show again
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text
                    style={{
                      color: "rgba(152, 152, 152, 1)",
                      marginRight: 10,
                    }}
                  >
                    Not Now
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (dontShowAgain) {
                      props.welcomePageSeen();
                    }
                    setModalVisible(false);
//                    props.navigation.navigate("TestType");
                  //  console.log("Props "+JSON.stringify(props.navigation))
                    props.navigation.goBack();
                  }}
                  style={{
                    backgroundColor: props.auth.themeMainColor,
                    borderRadius: 100,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    marginLeft: 10,
                  }}
                >
                  <Text style={{ color: "white" }}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { welcomePageSeen })(AppIntro);
