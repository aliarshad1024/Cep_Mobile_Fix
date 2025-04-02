import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
// import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

import { Image } from "react-native";
// import * as GoogleSignIn from 'expo-google-sign-in';
// import * as GoogleAppAuth from 'expo-google-app-auth';
import { connect } from "react-redux";
import { login, clearMessage, shufflelogin } from "../../redux/actions/authActions";
import { SHUFFLE_LOGIN } from "../../redux/Types";
import ErrorAlert from "../../components/ErrorAlert";
import Loading from "../../components/Loading";
import * as WebBrowser from "expo-web-browser";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import { useDispatch } from "react-redux";
import SocialLogin from "../../components/SocialLogin";
import { baseUrl } from "../../constants/global";

WebBrowser.maybeCompleteAuthSession();

function SignIn(props) {

  //console.log("Props "+JSON.stringify(props))
       
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  


  const getForgotPassword = async () => {
    setLoading(true);
  //  let user = await AsyncStorage.getItem("persist:auth");
  //  let token = JSON.parse(user).token.slice(1, -1);
    let data = {
      email: email,
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
          Alert.alert("Email Sent", "Email has been sent on your email address. Check your Inbox", [
            {
              text: "OK",
              onPress: () => {
               // props.navigation.navigate("SignIn");
               // props.logout();
              },
            }
          ]);
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





  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });

useEffect(() => {
if(fontsLoaded){
  setLoading(false)
}
},[fontsLoaded])

  validatePhoneNumber=(ph_number)=>{
   var re = /^\+[9][2][3][0-9]{9}$/;
   return re.test(ph_number) 
  }

  useEffect(() => {
    if (props.auth.msg === "Login successful") {
      setPassword("");
      setEmail("");
      // if (props.auth.welcomePageSeen) {
      //   props.navigation.navigate("TestType");
      // } else {
      //   props.navigation.navigate("AppIntro");
      // }
    } else if (props.auth.msg !== "") {
      setError(props.auth.msg);
      
    }
    setLoading(false);
  }, [props.auth]);

  let logo;

  switch (props.auth.themeMainColor) {
    case "#0E81B4":
      logo = require("../../assets/icons/cep0e81b4.png");

      break;
    case "#0CE5BF":
      logo = require("../../assets/icons/cep0ce5bf.png");

      break;
    case "#41CBF6":
      logo = require("../../assets/icons/cep41cbf6.png");

      break;
    case "#006769":
      logo = require("../../assets/icons/cep006769.png");

      break;
    case "#E9BFB4":
      logo = require("../../assets/icons/cepe9bfb4.png");

      break;
    case "#CC84DE":
      logo = require("../../assets/icons/cepcc84de.png");

      break;
    case "#95C0B1":
      logo = require("../../assets/icons/cep95c0b1.png");

      break;
    case "#A4443C":
      logo = require("../../assets/icons/cepa4443c.png");

      break;

    // add more cases for other theme colors
    default:
      logo = require("../../assets/icons/cep0e81b4.png");
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white", paddingVertical: 15 }}
    >
      <View style={{ alignItems: "center" }}>
        <Image
          source={logo}
          style={{ width: 78, height: 33 }}
        />
      </View>

      <View style={{ flex: 2, paddingHorizontal: 20, marginTop: 45 }}>
        <Text style={{ fontSize: 24, fontFamily: "Rubik_400Regular" }}>
          Sign in
        </Text>
        <Text
          style={{
            color: "rgba(139, 139, 139, 1)",
            marginTop: 20,
            fontFamily: "Rubik_400Regular",
          }}
        >
          Welcome back!
        </Text>
        <Text
          style={{
            color: "rgba(139, 139, 139, 1)",
            marginBottom: 20,
            fontFamily: "Rubik_400Regular",
          }}
        >
          Please Sign in to continue
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
            name="perm-identity"
            size={24}
            color="rgba(204, 204, 204, 1)"
          /> */}
          <TextInput
            placeholder="Email or phone number"
            autoCapitalize="none"
            value={email}
            onChangeText={(t) => {
              if (error !== "") {
                props.clearMessage();
                setError("");
              }
              setEmail(t.trimEnd());
            }}
            style={{
              flex: 1,
              marginLeft: 10,
              color: "black",
              fontFamily: "Rubik_400Regular",
            }}
          />
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: "lightgray",
            borderRadius: 100,
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* <MaterialIcons name="lock" size={24} color="rgba(204, 204, 204, 1)" /> */}
          <TextInput
            placeholder="Password"
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
            {/* <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="rgba(139, 139, 139, 1)"
            /> */}
          </TouchableOpacity>
        </View>
        {error && <ErrorAlert error={error} />}
        <TouchableOpacity
          onPress={() => {
            if (!email.includes("@")) { 
              //if(email.)
              let phChecker = email
              let number;
              console.log("length "+email+" "+email.length);
              if(phChecker.length==13){
                  number = email   
              }else if(phChecker.length===11){
                //remove first item and add +92
                  let leadingzero = phChecker.substring(1)
                  number = "+92"+leadingzero

              }else if(phChecker.length==10){
                  number = "+92"+phChecker
                //add +92
              }
               console.log("number "+number);
               if(validatePhoneNumber(number)){

                  console.log("passed "+number);
                   setLoading(true);
                   props.login({ phone: number, password, othermethod: "phone" });
               
              }else{
                  setError("Phone Number Format Should be +923XXXXXXXXX")
               }
            } else {
              setLoading(true);
              props.login({ email, password });
            }
          }}
          style={{
            backgroundColor:
            password.length < 8 || email.length < 7
            ? "rgba(204, 204, 204, 1)"
            : props.auth.themeMainColor,
            borderRadius: 100,
            marginTop: 20,
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}
          disabled={password.length < 8 || email.length < 7}
        >
          <Text style={{ color: "white" }}>Sign In</Text>
        </TouchableOpacity>
         <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => {
            // Alert.alert("Forgot Password", "Password will be sent to the Email specified?",  [
            //   {
            //     text: "Ok",
            //     onPress: () => {
            //       if(email!=""){
            //           getForgotPassword();
            //       }else{
            //         Alert.alert("Provide Email", "First write your email, then click on forgot password?",  [
            //           {
            //             text: "Ok",
            //           }
            //         ])        
            //       }
                  props.navigation.navigate("ForgotPassword");
                 // props.logout();
              //  },
              //</View>},
           // ])
          }}
        >
          <Text
            style={{
              color: props.auth.themeMainColor,
              textAlign: "center",
              fontFamily: "Rubik_400Regular",
            }}
          >
            Forgot Password
          </Text>
        </TouchableOpacity> 
        {/* <Text
          style={{
            fontSize: 14,
            textAlign: "center",
            color: "rgba(139, 139, 139, 1)",
            marginTop: 90,
            fontWeight: "500",
            fontFamily: "Rubik_400Regular",
          }}
        >
          Or login With
        </Text>

         <SocialLogin login={props.login} setLoading={setLoading} />  */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            marginBottom:40
          }}
        >
          <Text
            style={{
              color: "#8B8B8B",
              fontSize: 14,
            }}
          >
            Did not have an account?
          </Text>
          <TouchableOpacity
            onPress={() =>{
              
              props.navigation.navigate("SignUp")
              //props.shufflelogin();
              //dispatch({
              //  type:SHUFFLE_LOGIN
             //});
            }
            }
            style={{
              fontSize: 14,

            }}
          >
            <Text
              style={{
                color: props.auth.themeMainColor,
                marginLeft: 5,
              }}
            >
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { login, clearMessage, shufflelogin })(SignIn);
