import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
// import { Feather } from "@expo/vector-icons";
import { Image } from "react-native";
// import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

//import auth from '@react-native-firebase/auth';
import { firebaseConfig } from "../../config";
// import firebase from "firebase/compat/app";
// import 'firebase/compat/auth';
import url from "../../utils/URL";
import Loading from "../../components/Loading";
import { connect } from "react-redux";
import { baseUrl } from "../../constants/global";

function OTPVerification(props) {
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [wrongOTPAttemps, setWrongOTPAttemps] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const recaptchaVerifier = useRef(null);

  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const input4 = useRef(null);
  const input5 = useRef(null);
  const input6 = useRef(null);
  const authb= firebase.default.auth()

  useEffect(() => {
    if (props.route.params.phone) {
      sendVerification();
    }
  }, []);


  validatePhoneNumber=(ph_number)=>{
    var re = /^\+[9][2][3][0-9]{9}$/;
    return re.test(ph_number) 
   }



  function changeCharAt(str, index, newChar) {
    let n = str.substring(0, index) + newChar + str.substring(index + 1);
    setCode(n);
  }


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardOpen(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardOpen(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const signup = (data) => {
    setLoading(true);
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, data[key]);
    }
    fetch(`${baseUrl}/api/createuser`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: searchParams.toString(),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        console.log("Error Debug "+JSON.stringify(data))
        if (data.status === "error") {
          setError("User already exists");
        } else if (data.status === "success") {
          Alert.alert("Account created successfully", "", [
            { text: "Login", onPress: props.navigation.navigate("SignIn") },
          ]);
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  const forgotPassword = () => {
    setLoading(true);
    let data = {
      phone: `${props.route.params.phone}`,
      newpassword: props.route.params.newpassword,
      confirmpassword: props.route.params.confirmpassword,
    };
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, data[key]);
    }
    fetch(`${baseUrl}/api/forgotpassword`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: searchParams.toString(),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (
          data.status === "error" &&
          data.message ===
            "Number not found in system. Contact us at competitiveexaminationpakistan@gmail.com"
        ) {
          Alert.alert(
            "Number is not associated with any account",
            "For help you can contact us at: competitiveexaminationpakistan@gmail.com",
            [{ text: "Login", onPress: props.navigation.navigate("SignIn") }]
          );
        } else if (data.status === "success") {
          Alert.alert("Password updated successfully", "You can now login", [
            { text: "Login", onPress: props.navigation.navigate("SignIn") },
          ]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const sendVerification =async () => {
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider
      .verifyPhoneNumber(
        `${props.route.params.phone}`,
        recaptchaVerifier.current
      )
      .then(setVerificationId);
   // await auth().verifyPhoneNumber(`+92${props.route.params.phone}`, recaptchaVerifier.current).then(verificationId);
    setCodeSent(true);
  };

  const confirmCode = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
    firebase.auth().signInWithCredential(credential)
      .then(() => {
        if (props.route.params.forgotPassword) {
          forgotPassword();
        } else {
          signup({
            fullname: props.route.params.fullname,
            email: props.route.params.email,
            password: props.route.params.password,
            phone: props.route.params.phone,
          });
        }
      })
      .catch((e) => {
        if (wrongOTPAttemps + 1 > 3) {
          setLoading(false);
          props.navigation.navigate("SignIn");
        } else {
          setWrongOTPAttemps(wrongOTPAttemps + 1);
          setLoading(false);
        }
      });
  };
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


  if (loading) {
    return <Loading />;
  }
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      /> */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 20,
          marginVertical: 20,
        }}
      >
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          {/* <Feather name="arrow-left" size={24} color="black" /> */}
        </TouchableOpacity>
        <Text style={{ marginLeft: 20, fontSize: 20, fontWeight: 500 }}>
          Verification
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 20,
        }}
      >
        {!isKeyboardOpen && (
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
            fontSize: 18,
          }}
        >
          Code has sent to
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
           {props.route.params.phone}
        </Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TextInput
          style={{
            width: 40,
            height: 40,
            margin: 5,
            textAlign: "center",
            backgroundColor: "rgba(246, 246, 246, 1)",
            shadowColor: "rgba(0, 0, 0, 0.12)",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 5,
          }}
          maxLength={1}
          ref={input1}
          keyboardType="number-pad"
          onChangeText={(t) => {
            if (t !== "") {
              changeCharAt(code, 0, t);
              input2.current.focus();
            }
          }}
        />
        <TextInput
          style={{
            width: 40,
            height: 40,
            margin: 5,
            textAlign: "center",
            backgroundColor: "rgba(246, 246, 246, 1)",
            shadowColor: "rgba(0, 0, 0, 0.12)",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 5,
          }}
          maxLength={1}
          ref={input2}
          keyboardType="number-pad"
          onChangeText={(t) => {
            if (t !== "") {
              changeCharAt(code, 1, t);

              input3.current.focus();
            }
          }}
        />
        <TextInput
          style={{
            width: 40,
            height: 40,
            margin: 5,
            textAlign: "center",
            backgroundColor: "rgba(246, 246, 246, 1)",
            shadowColor: "rgba(0, 0, 0, 0.12)",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 5,
          }}
          maxLength={1}
          ref={input3}
          keyboardType="number-pad"
          onChangeText={(t) => {
            if (t !== "") {
              changeCharAt(code, 2, t);

              input4.current.focus();
            }
          }}
        />
        <TextInput
          style={{
            width: 40,
            height: 40,
            margin: 5,
            textAlign: "center",
            backgroundColor: "rgba(246, 246, 246, 1)",
            shadowColor: "rgba(0, 0, 0, 0.12)",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 5,
          }}
          maxLength={1}
          ref={input4}
          keyboardType="number-pad"
          onChangeText={(t) => {
            if (t !== "") {
              changeCharAt(code, 3, t);

              input5.current.focus();
            }
          }}
        />
        <TextInput
          style={{
            width: 40,
            height: 40,
            margin: 5,
            textAlign: "center",
            backgroundColor: "rgba(246, 246, 246, 1)",
            shadowColor: "rgba(0, 0, 0, 0.12)",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 5,
          }}
          maxLength={1}
          ref={input5}
          keyboardType="number-pad"
          onChangeText={(t) => {
            if (t !== "") {
              changeCharAt(code, 4, t);

              input6.current.focus();
            }
          }}
        />
        <TextInput
          style={{
            width: 40,
            height: 40,
            margin: 5,
            textAlign: "center",
            backgroundColor: "rgba(246, 246, 246, 1)",
            shadowColor: "rgba(0, 0, 0, 0.12)",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 5,
          }}
          maxLength={1}
          ref={input6}
          keyboardType="number-pad"
          onChangeText={(t) => {
            if (t !== "") {
              changeCharAt(code, 5, t);
            }
          }}
        />
      </View>
      {wrongOTPAttemps > 0 && (
        <Text style={{ textAlign: "center", color: "red", marginTop: 8 }}>
          Invalid code, {3 - wrongOTPAttemps}{" "}
          {3 - wrongOTPAttemps === 1 ? "attempt" : "attempts"} left
        </Text>
      )}
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
          Didn’t receive the code?{" "}
        </Text>

        <TouchableOpacity onPress={() => sendVerification()}>
          <Text
            style={{
              color: props.auth.themeSecondaryColor,
            }}
          >
            Re-send
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => confirmCode()}
        disabled={code.length !== 6}
        style={{
          backgroundColor:
          code.length !== 6
          ? "rgba(204, 204, 204, 1)"
          : props.auth.themeMainColor,
          borderRadius: 100,
          paddingVertical: 20,
          marginHorizontal: 40,
          marginTop: 40,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 14, fontWeight: 600 }}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(OTPVerification);
