import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from "react-native";
// import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

import { Image } from "react-native";
// import * as GoogleSignIn from 'expo-google-sign-in';
// import * as GoogleAppAuth from 'expo-google-app-auth';
import { connect } from "react-redux";

import ErrorAlert from "../../components/ErrorAlert";
import Loading from "../../components/Loading";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import { baseUrl } from "../../constants/global";

function ForgotPassword(props) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });

  if (loading) {
    return <Loading />;
  }

  let logo;

  // switch (props.auth.themeMainColor) {
  //   case "#0E81B4":
  //     logo = require("../../assets/icons/cep0e81b4.png");

  //     break;
  //   case "#00BA60":
  //     logo = require("../../assets/icons/cep00ba60.png");

  //     break;
  //   case "#41CBF6":
  //     logo = require("../../assets/icons/cep41cbf6.png");

  //     break;
  //   case "#006769":
  //     logo = require("../../assets/icons/cep006769.png");

  //     break;
  //   case "#07173B":
  //     logo = require("../../assets/icons/cep07173b.png");

  //     break;
  //   case "#CC84DE":
  //     logo = require("../../assets/icons/cepcc84de.png");

  //     break;
  //   case "#95C0B1":
  //     logo = require("../../assets/icons/cep95c0b1.png");

  //     break;
  //   case "#A4443C":
  //     logo = require("../../assets/icons/cepa4443c.png");

  //     break;
  //   default:
  //     logo = require("../../assets/icons/cep0e81b4.png");
  // }


  
  const getForgotPassword = async () => {
    setLoading(true);
  //  let user = await AsyncStorage.getItem("persist:auth");
  //  let token = JSON.parse(user).token.slice(1, -1);
    let data = {
      email: mobileNumber,
    };
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, data[key]);
    }
    fetch(`${baseUrl}/api/requestchangepassword`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: searchParams.toString(),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data "+JSON.stringify(data))
        setLoading(false)
        if (data?.status === "success") {
          // Alert.alert("Email Sent", "Email has been sent on your email address. Check your Inbox", [
          //   {
          //     text: "OK",
          //     onPress: () => {
          //      // props.navigation.navigate("SignIn");
          //      // props.logout();
          //     },
          //   }
          // ]);
          props.navigation.navigate("PasswordSent", {forgotemail: mobileNumber});
              
        } else if (data.status === "Error") {
          Alert.alert("Error", data.message, [
            {
              text: "OK",
              onPress: () => {
               // props.navigation.navigate("SignIn");
               // props.logout();
              },
            }
          ]);
        }
      })
      .catch((e) => {
        setLoading(false)
        Alert.alert("Check your internet connection and try again!", "", [
          {
            text: "OK",
            onPress: () => {
             // props.navigation.navigate("SignIn");
             // props.logout();
            },
          }
        ]);
      });
  };



  
  validatePhoneNumber=(ph_number)=>{
    var re = /^\+[9][2][3][0-9]{9}$/;
    console.log("test "+re.test(ph_number))
    return re.test(ph_number) 
   }


  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", paddingTop: 65 }}
    >
      <View style={{ alignItems: "center" }}>
        <Image source={logo} style={{ width: 78, height: 33 }} />
      </View>
      <View>
        <TouchableOpacity
          style={{ left: 20 }}
          onPress={() => props.navigation.goBack()}
        >
          {/* <Feather name="arrow-left" size={24} color="white" /> */}
        </TouchableOpacity>
      </View>
      <View style={{ flex: 2, paddingHorizontal: 20, marginVertical: 25 }}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 10,
            fontFamily: "Rubik_400Regular",
          }}
        >
          Forgot Password
        </Text>

        <Text
          style={{
            color: "rgba(139, 139, 139, 1)",
            marginBottom: 20,
            fontFamily: "Rubik_400Regular",
          }}
        >
          Please enter your email address associated with your account. We will send an email with your new password.
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: "lightgray",
            borderRadius: 100,
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* <MaterialIcons
            name="email"
            size={24}
            color="rgba(204, 204, 204, 1)"
          /> */}
          
          <TextInput
            placeholder="Email Address"
            value={mobileNumber}
            keyboardType="email-address"
            onChangeText={(t) => {
              if (error !== "") {
                setError("");
              }
              setMobileNumber(t.trimEnd());
             // validatePhoneNumber(mobileNumber)
            }}
            style={{ flex: 1, marginLeft: 10 }}
          />
        </View>

        {/* <View
          style={{
            borderWidth: 1,
            borderColor: "lightgray",
            borderRadius: 100,
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="lock" size={24} color="rgba(204, 204, 204, 1)" />
          <TextInput
            placeholder="New Password"
            autoCapitalize="none"
            value={password}
            onChangeText={(t) => {
              if (error !== "") {
                props.clearMessage();
                setError("");
              }
              setPassword(t.trimEnd());
            }}
            secureTextEntry={!showPassword}
            style={{ flex: 1, marginLeft: 10, fontFamily: "Rubik_400Regular" }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="rgba(139, 139, 139, 1)"
            />
          </TouchableOpacity>
        </View> */}

        {/* <View
          style={{
            borderWidth: 1,
            borderColor: "lightgray",
            borderRadius: 100,
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="lock" size={24} color="rgba(204, 204, 204, 1)" />
          <TextInput
            placeholder="Confirm Password"
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={(t) => {
              if (error !== "") {
                props.clearMessage();
                setError("");
              }

              setConfirmPassword(t.trimEnd());
            }}
            secureTextEntry={!showPassword}
            style={{ flex: 1, marginLeft: 10, fontFamily: "Rubik_400Regular" }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="rgba(139, 139, 139, 1)"
            />
          </TouchableOpacity>
        </View> */}

        <TouchableOpacity
          onPress={() => {
            console.log("Mobile "+mobileNumber)
            if(mobileNumber.includes("@")){
              getForgotPassword()
           }else{
              setError("Email address is not valid")
           }
          }}
          style={{
            backgroundColor:
             
              mobileNumber==""
                ? "rgba(204, 204, 204, 1)"
                : props.auth.themeMainColor,
            borderRadius: 100,
            paddingHorizontal: 20,
            paddingVertical: 20,
            marginTop: 40,
            alignItems: "center",
          }}
          disabled={
           
            mobileNumber.length ===""
          }
        >
          <Text style={{ color: "white", fontFamily: "Rubik_400Regular" }}>
            Send Email
          </Text>
        </TouchableOpacity>

        {error && <ErrorAlert error={error} />}
        
      </View>
    </SafeAreaView>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ForgotPassword);
