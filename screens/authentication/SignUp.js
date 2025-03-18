import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Image } from "react-native";
import { Checkbox } from "expo-checkbox";
import ErrorAlert from "../../components/ErrorAlert";
const { width } = Dimensions.get("window");
import Loading from "../../components/Loading";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import SocialLogin from "../../components/SocialLogin";
import { login } from "../../redux/actions/authActions";
import { connect } from "react-redux";
import { baseUrl } from "../../constants/global";

function SignUp(props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [errormissmatch, setErrorMissMatch] = useState(false);
  const [matchTestPassed, setMatchTestPassed] = useState(false);
  const [loading, setLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });
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



  const updateMatchPassword=(test_passed)=>{
      if(test_passed){
        setErrorMissMatch(false)
        setMatchTestPassed(true)
      }else{
        setErrorMissMatch(true)
        setMatchTestPassed(false)
      }
  }

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


  validatePhoneNumber=(ph_number)=>{
    var re = /^\+[9][2][3][0-9]{9}$/;
    return re.test(ph_number) 
   }


   if (loading) {
    return <Loading />;
  }
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={{ paddingVertical: 25 }}>
        <View style={{ alignItems: "center" }}>
          <Image source={logo} style={{ width: 78, height: 33 }} />
        </View>
        <View>
          <TouchableOpacity
            style={{ marginLeft: 20 }}
            onPress={() => props.navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 2, paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 500,
              fontFamily: "Rubik_400Regular",
            }}
          >
            Sign up
          </Text>
          <View style={{ width: "90%" }}>
            <Text
              style={{
                color: "rgba(139, 139, 139, 1)",
                marginTop: 20,
                fontFamily: "Rubik_400Regular",
              }}
            >
              Enter your information below or continue with social media account
            </Text>
          </View>
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
            <MaterialIcons
              name="person"
              size={24}
              color="rgba(204, 204, 204, 1)"
            />
            <TextInput
              placeholder="Full Name"
              value={fullName}
              onChangeText={(t) => {
                if (error !== "") {
                  setError("");
                }
                setFullName(t);
              }}
              style={{ flex: 1, marginLeft: 10 }}
            />
          </View>
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
            <MaterialIcons
              name="email"
              size={24}
              color="rgba(204, 204, 204, 1)"
            />
            <TextInput
              autoCapitalize="none"
              placeholder="Email"
              value={email}
              onChangeText={(t) => {
                if (error !== "") {
                  setError("");
                }
                setEmail(t.trimEnd());
              }}
              style={{ flex: 1, marginLeft: 10 }}
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
            <MaterialIcons
              name="phone"
              size={24}
              color="rgba(204, 204, 204, 1)"
            />
             <Text
              style={{
                marginLeft: 12,
                color: "gray",
              }}
            >
              +92
            </Text> 
            <TextInput
              placeholder="  3XX XXXXXXX"
              value={mobileNumber}
              keyboardType="phone-pad"
              onChangeText={(t) => {
                if (error !== "") {
                  setError("");
                }
                
                setMobileNumber(t.trimEnd());
              }}
              style={{ flex: 1, marginLeft: 1 }}
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
            <MaterialIcons
              name="lock"
              size={24}
              color="rgba(204, 204, 204, 1)"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(t) => {
                if (error !== "") {
                  props.clearMessage();
                  setError("");
                }
                setPassword(t.trimEnd());
                console.log('retyped pass '+retypePassword.length)
                retypePassword==t.trimEnd()?
                updateMatchPassword(true):
                  retypePassword.length==0?
                    setErrorMissMatch(false):
                    updateMatchPassword(false)
              }}
              secureTextEntry={!showPassword}
              style={{ flex: 1, marginLeft: 10 }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
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
            <MaterialIcons
              name="lock"
              size={24}
              color="rgba(204, 204, 204, 1)"
            />
            <TextInput
              placeholder="Retype Password"
              value={retypePassword}
              onChangeText={(t) => {
                if (error !== "") {
                  props.clearMessage();
                  setError("");
                }
                setRetypePassword(t.trimEnd());
                t.trimEnd().length >1 &&  t.trimEnd()==password?
                   updateMatchPassword(true):updateMatchPassword(false)
              }}
              secureTextEntry={!showRetypePassword}
              style={{ flex: 1, marginLeft: 10 }}
            />
            <TouchableOpacity onPress={() => setShowRetypePassword(!showRetypePassword)}>
              <MaterialIcons
                name={showRetypePassword ? "visibility" : "visibility-off"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <Text style={{
            color:"gray",
            marginTop:5,
            marginLeft:10,
            fontStyle:"italic"
          }}>Note: Password must have at least 8 characters</Text>
          {errormissmatch &&  <ErrorAlert error={"Password does not match"} />}
          {error && <ErrorAlert error={error} />}
          <TouchableOpacity
            onPress={
              () =>{
              if(validatePhoneNumber('+92'+mobileNumber)){
                // props.navigation.navigate("OTPVerification", {
                //   fullname: fullName,
                //   email,
                //   phone: mobileNumber,
                //   password
                // })
                signup({
                  fullname: fullName,
                  email: email,
                  password:password,
                  phone: mobileNumber,
                });
              }else{
                setError("Phone Number Format Should be +923XXXXXXXXX")
              }
              // signup({
              //   fullname: fullName,
              //   email,
              //   password,
              //   phone: mobileNumber,
              // })
            }}
            style={{
              backgroundColor:
                password.length < 8 ||
                !matchTestPassed ||
                !agreed ||
                email === "" ||
                fullName === "" ||
                mobileNumber.length < 9
                  ? "rgba(204, 204, 204, 1)"
                  : props.auth.themeMainColor,
              borderRadius: 100,
              paddingHorizontal: 20,
              paddingVertical: 20,
              marginTop: 20,
              alignItems: "center",
            }}
            disabled={
              password.length < 8 ||
              !matchTestPassed ||  
              email === "" ||           
              !agreed ||
              fullName === "" ||
              mobileNumber.length < 9
            }
          >
            <Text
              style={{
                color: "white",
                fontWeight: 600,
                fontSize: 14,
                fontFamily: "Rubik_400Regular",
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: width - 100,
              flexDirection: "row",
              alignItems: "center",
              margin: 15,
            }}
          >
            <Checkbox
              style={{
                marginRight: 20,
                marginTop: 10,
              }}
              color={props.auth.themeMainColor}
              value={agreed}
              onValueChange={setAgreed}
            />
            <View>
              <Text
                style={{
                  color: "#8B8B8B",
                  fontSize: 11,
                  marginTop: 10,
                  fontFamily: "Rubik_400Regular",
                }}
              >
                By signing up you agree to our{" "}
                {/* <TouchableOpacity onPress={() => console.log("Sign Up")}
             style={{alignItems:'center'}}
            > */}
                <Text
                  style={{
                    color: props.auth.themeMainColor,
                    fontSize: 11,
                    textDecorationLine: "underline",
                    fontFamily: "Rubik_400Regular",
                  }}
                >
                  Terms & Condition
                </Text>
                {/* </TouchableOpacity> */}
                <Text> and </Text>
                {/* <TouchableOpacity onPress={() => console.log("Sign Up")}> */}
                <Text
                  style={{
                    color: props.auth.themeMainColor,
                    marginLeft: 5,
                    fontSize: 11,
                    textDecorationLine: "underline",
                    fontFamily: "Rubik_400Regular",
                  }}
                >
                  Privacy Policy
                </Text>
                {/* </TouchableOpacity> */}
              </Text>
            </View>
          </View>
          {/* <Text
            style={{
              fontSize: 14,
              textAlign: "center",
              color: "rgba(139, 139, 139, 1)",
              marginTop: 10,
              fontWeight: 500,
              color: "rgba(139, 139, 139, 1)",
              fontFamily: "Rubik_400Regular",
            }}
          >
            Or login With
          </Text>

          <SocialLogin login={props.login} />  */}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <Text
              style={{
                color: "#8B8B8B",
                fontSize: 14,
                fontFamily: "Rubik_400Regular",
              }}
            >
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("SignIn")}
              style={{
                fontSize: 14,
              }}
            >
              <Text
                style={{
                  color: props.auth.themeMainColor,
                  marginLeft: 5,
                  fontWeight: 600,
                  fontFamily: "Rubik_400Regular",
                }}
              >
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { login })(SignUp);
