import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "react-native";
// import Loading from "../../components/Loading";
import { connect } from "react-redux";
import { baseUrl } from "../../constants/global";

function PasswordSent(props) {
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  useEffect(() => {
  }, []);


 
 
 

let otp;
  switch (props.auth.themeMainColor) {
    case "#0E81B4":
      otp = require("../../assets/icons/OTP0e81b4.png");

      break;
    case "#0CE5BF":
      otp = require("../../assets/icons/OTP0ce5bf.png");

      break;
    case "#41CBF6":
      otp = require("../../assets/icons/OTP41cbf6.png");

      break;
    case "#006769":
      otp = require("../../assets/icons/OTP006769.png");

      break;
    case "#E9BFB4":
      otp = require("../../assets/icons/OTPe9bfb4.png");

      break;
    case "#CC84DE":
      otp = require("../../assets/icons/OTPcc84de.png");

      break;
    case "#95C0B1":
      otp = require("../../assets/icons/OTP95c0b1.png");

      break;
    case "#A4443C":
      otp = require("../../assets/icons/OTPa4443c.png");

      break;

    // add more cases for other theme colors
    default:
      otp = require("../../assets/icons/OTP0e81b4.png");
  }


  // if (loading) {
  //   return <Loading />;
  // }
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 20,
          marginVertical: 20,
        }}
      >
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ marginLeft: 20, fontSize: 20, fontWeight: 500 }}>
          Password Sent
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 20,
        }}
      >
        {(
          <Image source={otp} style={{ width: 258, height: 307 }} />
        )}
      </View>

      <View>
        <Text
          style={{
            color: "rgba(139, 139, 139, 1)",
            textAlign: "center",
            marginTop: 20,
            fontWeight: "600",
            marginHorizontal:30,
            fontSize: 18,
          }}
        >
          Password is Sent to {props.route.params.forgotemail}. Check your email and Then Login
        </Text>
        <Text
          style={{
            color: "rgba(139, 139, 139, 1)",
            textAlign: "center",
            marginBottom: 20,
            fontWeight: "600",
            fontSize: 18,
          }}
        >
           {/* {props.route.params.phone}
        */}
        </Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        
      
      {error && (
        <Text style={{ textAlign: "center", color: "red", marginTop: 8 }}>
          {error}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 25,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "rgba(139, 139, 139, 1)",
          }}
        >
          
        </Text>

        
      </View>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("SignIn");
        }}
        style={{
          backgroundColor:
          props.auth.themeMainColor,
          borderRadius: 100,
          paddingVertical: 20,
          marginHorizontal: 40,
          width:'70%',
          marginTop: 40,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: 600 }}>
          Sign In
        </Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}


const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PasswordSent);
