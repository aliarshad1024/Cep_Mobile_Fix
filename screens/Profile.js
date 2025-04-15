import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
// import { RadioButton } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Footer from "../components/Footer";
import { connect } from "react-redux";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import { updateUser, updateDP } from "../redux/actions/authActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScrollView } from "react-native-gesture-handler";
import url from "../utils/URL";
import ErrorAlert from "../components/ErrorAlert";
import ModalAlert from "../components/ModalAlert";
import { clearMessage } from "../redux/actions/authActions";
import { baseUrl } from "../constants/global";
import Loading from "../components/Loading";
const Profile = (props) => {
  const [name, setName] = useState(props.auth.user?.fullname);
  const [emailAddress, setEmailAddress] = useState(props.auth.user?.email);
  const [phoneNumber, setPhoneNumber] = useState(props.auth.user?.phone);
  const [tehsil, setTehsil] = useState(props.auth.user?.tehsil);
  const [city, setCity] = useState(props.auth.user?.city);
  const [dob, setDob] = useState(props.auth.user?.dob);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState(props.auth.user?.gender);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setloading] = useState(false);

  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });

  useEffect(() => {
    if (props.auth.msg === "User updated") {
      setShowModal(true);
      setMessage("Profile Updated Successfully!");
    } else if (props.auth.msg === "DP updated") {
      setShowModal(true);
      setMessage("Profile Picture Updated Successfully!");
    }
  }, [props.auth.msg]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    const date = new Date(selectedDate.toString());
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setDate(selectedDate || date);
    setDob(formattedDate || date);
  };

  const updatePassword = async () => {
    setloading(true)
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    let data = {
      userid: props.auth.user.id,
      oldpassword: oldPassword,
      newpassword: newPassword,
      confirmpassword: confirmNewPassword,
    };
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, data[key]);
    }
    fetch(`${baseUrl}/api/updatepassword`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: searchParams.toString(),
    }).then((res) =>
    
      res.json().then((response) => {
        setloading(false)
      
        if (response.status === "error") {
          setError(response.message);
        } else {
          setShowModal(true);
          setMessage("Password Updated Successfully!");
        }
      })
    );
    setloading(false)
      
  };


  if(loading)
    return (<Loading>

    </Loading>);

  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: "#FFF",
      }}
    >
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
                fontWeight: "500",
                fontFamily: "Rubik_400Regular",
              }}
            >
              Edit Profile
            </Text>
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            marginTop: 20,
          }}
        >
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
                  ? require("../assets/profilePicture.jpg")
                  : { uri: props.auth.picture }
              }
            />
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                borderRadius: 204,
                padding: 5,
                position: "absolute",
                bottom: 0,
                right: 0,
              }}
              onPress={async () => {
                let result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                });

                if (result.cancelled) {
                  return;
                }
                const base64 = await FileSystem.readAsStringAsync(result.uri, {
                  encoding: "base64",
                });

                let picture = `data:image/jpeg;base64,${base64}`;

                let user = await AsyncStorage.getItem("persist:auth");
                let token = JSON.parse(user).token.slice(1, -1);
                props.updateDP(picture, props.auth.user.id, token);
              }}
            >
              <Image
                style={{
                  width: 16,
                  height: 16,
                }}
                resizeMode="contain"
                source={require("../assets/icons/camera.png")}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              marginTop: 10,
              color: "white",
              fontFamily: "Rubik_400Regular",
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "white",
              fontFamily: "Rubik_400Regular",
            }}
          >
            {emailAddress}
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ marginHorizontal: 30, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {!showChangePassword ? (
          <View>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  marginTop: 10,
                  marginLeft: 15,
                  fontFamily: "Rubik_400Regular",
                }}
              >
                Full Name
              </Text>

              <TextInput
                placeholder="Write name here..."
                value={name}
                onChangeText={setName}
                style={{
                  borderWidth: 1,
                  borderColor: "lightgray",
                  borderRadius: 100,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  marginVertical: 10,
                  fontFamily: "Rubik_400Regular",
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                marginTop: 10,
                marginLeft: 15,
                marginBottom: 5,
                fontFamily: "Rubik_400Regular",
              }}
            >
              Phone Number
            </Text>

            <TextInput
              placeholder="Write phone number here..."
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={{
                borderWidth: 1,
                borderColor: "lightgray",
                borderRadius: 100,
                paddingHorizontal: 20,
                paddingVertical: 5,
                marginVertical: 10,
                fontFamily: "Rubik_400Regular",
              }}
            />

            <View style={styles.container}>
              <Text style={styles.label}>Gender</Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setGender("male")}
                >
                  <View style={styles.radioButtonInner}>
                    {gender === "male" && (
                      <View style={styles.radioButtonSelected} />
                    )}
                  </View>
                  <Text style={styles.radioButtonLabel}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setGender("female")}
                >
                  <View style={styles.radioButtonInner}>
                    {gender === "female" && (
                      <View style={styles.radioButtonSelected} />
                    )}
                  </View>
                  <Text style={styles.radioButtonLabel}>Female</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setGender("others")}
                >
                  <View style={styles.radioButtonInner}>
                    {gender === "others" && (
                      <View style={styles.radioButtonSelected} />
                    )}
                  </View>
                  <Text style={styles.radioButtonLabel}>Others</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                marginVertical: 10,
                marginLeft: 15,
                fontFamily: "Rubik_400Regular",
              }}
            >
              Date Of Birth
            </Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "lightgray",
                borderRadius: 100,
                paddingHorizontal: 20,
                paddingVertical: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: "black" }}>{dob}</Text>
              {/* <MaterialCommunityIcons
                style={{ marginLeft: "auto" }}
                name="clock-edit-outline"
                size={24}
                color="cornflowerblue"
              /> */}
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                onChange={handleDateChange}
              />
            )}

            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                marginTop: 10,
                marginLeft: 15,
                marginTop: 15,
                fontFamily: "Rubik_400Regular",
              }}
            >
              City
            </Text>

            <TextInput
              placeholder="Write your city here..."
              value={city}
              onChangeText={setCity}
              style={{
                borderWidth: 1,
                borderColor: "lightgray",
                borderRadius: 100,
                paddingHorizontal: 20,
                paddingVertical: 5,
                marginVertical: 10,
                fontFamily: "Rubik_400Regular",
              }}
            />

            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                marginTop: 10,
                marginLeft: 15,
                marginBottom: 5,
                fontFamily: "Rubik_400Regular",
              }}
            >
              Tehsil
            </Text>

            <TextInput
              placeholder="Write your tehsil here..."
              value={tehsil}
              onChangeText={setTehsil}
              style={{
                borderWidth: 1,
                borderColor: "lightgray",
                borderRadius: 100,
                paddingHorizontal: 20,
                paddingVertical: 5,
                marginVertical: 10,
                fontFamily: "Rubik_400Regular",
              }}
            />
            <TouchableOpacity
              style={{
                marginVertical: 20,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
              onPress={() => setShowChangePassword(true)}
            >
              <Text
                style={{
                  color: "cornflowerblue",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Change Password
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                marginTop: 10,
                marginLeft: 15,
                marginTop: 15,
                fontFamily: "Rubik_400Regular",
              }}
            >
              Current Password
            </Text>

            <TextInput
              placeholder="Enter current password"
              onChangeText={(t) => {
                if (error !== "") {
                  setError(null);
                }
                setOldPassword(t.trimEnd());
              }}
              autoCapitalize="none"
              value={oldPassword}
              style={{
                borderWidth: 1,
                borderColor: "lightgray",
                borderRadius: 100,
                paddingHorizontal: 20,
                paddingVertical: 5,
                marginVertical: 10,
                fontFamily: "Rubik_400Regular",
              }}
            />

            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                marginTop: 10,
                marginLeft: 15,
                marginTop: 15,
                fontFamily: "Rubik_400Regular",
              }}
            >
              New Password
            </Text>

            <TextInput
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={(t) => {
                if (error !== "") {
                  setError(null);
                }
                setNewPassword(t.trimEnd());
              }}
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: "lightgray",
                borderRadius: 100,
                paddingHorizontal: 20,
                paddingVertical: 5,
                marginVertical: 10,
                fontFamily: "Rubik_400Regular",
              }}
            />

            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                marginTop: 10,
                marginLeft: 15,
                marginTop: 15,
                fontFamily: "Rubik_400Regular",
              }}
            >
              Confirm Password
            </Text>

            <TextInput
              placeholder="Confirm your password"
              value={confirmNewPassword}
              onChangeText={(t) => {
                if (error !== "") {
                  setError(null);
                }
                setConfirmNewPassword(t.trimEnd());
              }}
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: "lightgray",
                borderRadius: 100,
                paddingHorizontal: 20,
                paddingVertical: 5,
                marginVertical: 10,
                fontFamily: "Rubik_400Regular",
              }}
            />

            {error && <ErrorAlert error={error} />}
          </View>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: (showChangePassword &&
            (oldPassword.length < 7 ||
              newPassword.length < 7 ||
              oldPassword === newPassword ||
              newPassword !== confirmNewPassword)) ? "rgba(204, 204, 204, 1)" : props.auth.themeMainColor,
            borderRadius: 100,
            paddingVertical: 18,
            paddingHorizontal: 21,
            shadowColor: "rgba(0, 0, 0, 0.12)",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 1,
            shadowRadius: 12,
            elevation: 12,
            marginTop: 15,
            marginBottom: 110,
          }}
          disabled={ showChangePassword &&
            (oldPassword.length < 7 ||
              newPassword.length < 7 ||
              oldPassword === newPassword ||
              newPassword !== confirmNewPassword)
          }
          onPress={ async() => {
             console.log("ChangePassword "+showChangePassword)
            if (showChangePassword) {
              updatePassword();
            } else {
              let user = await AsyncStorage.getItem("persist:auth");
              let token = JSON.parse(user).token.slice(1, -1);
              props.updateUser(
                {
                  userid: props.auth.user.id,
                  fullname: name,
                  email: emailAddress,
                  phone: phoneNumber,
                  city: city,
                  tehsil: tehsil,
                  gender: gender,
                  dob: dob,
                },
                token
              );
            }
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Rubik_400Regular",
              color: "#F2F2F2",
              textAlign: "center",
            }}
          >
            Update
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer {...props} />
      <ModalAlert
        message={message}
        show={showModal}
        setShow={setShowModal}
        navigation={props.navigation}
        navigateTo={"TestType"}
        clearMessage={props.clearMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
    fontFamily: "Rubik_400Regular",
    marginLeft: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioButtonInner: {
    width: 14,
    height: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: "black", // Add your desired color here
  },
  radioButtonLabel: {
    fontSize: 13,
    marginRight: 20,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { updateUser, updateDP, clearMessage })(
  Profile
);
