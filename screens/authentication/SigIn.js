import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import * as WebBrowser from "expo-web-browser";
import { connect, useDispatch } from "react-redux";
import { login, clearMessage } from "../../redux/actions/authActions";
import ErrorAlert from "../../components/ErrorAlert";
import Loading from "../../components/Loading";
import { baseUrl } from "../../constants/global";

WebBrowser.maybeCompleteAuthSession();

function SignIn(props) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("ali@gmail.com");
  const [password, setPassword] = useState("123456789");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      setLoading(false);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // Perform auto login on mount
    if (fontsLoaded) {
      setLoading(true);
      dispatch(login({ email: "ali@gmail.com", password: "123456789" }));
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (props.auth.msg === "Login successful") {
      setPassword("");
      setEmail("");
      props.navigation.navigate("TestType");
    } else if (props.auth.msg !== "") {
      setError(props.auth.msg);
    }
    setLoading(false);
  }, [props.auth]);

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white", paddingVertical: 15 }}>
      <View style={{ alignItems: "center" }}>
        <Image source={require("../../assets/logo.png")} style={{ width: 78, height: 33 }} />
      </View>

      <View style={{ flex: 2, paddingHorizontal: 20, marginTop: 45 }}>
        <Text style={{ fontSize: 24, fontFamily: "Rubik_400Regular" }}>Sign in</Text>
        <Text style={{ color: "rgba(139, 139, 139, 1)", marginTop: 20, fontFamily: "Rubik_400Regular" }}>
          Welcome back!
        </Text>
        <Text style={{ color: "rgba(139, 139, 139, 1)", marginBottom: 20, fontFamily: "Rubik_400Regular" }}>
          Please wait while we sign you in...
        </Text>

        {error && <ErrorAlert error={error} />}

        <TouchableOpacity
          style={{
            backgroundColor: props.auth.themeMainColor,
            borderRadius: 100,
            marginTop: 20,
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}
          disabled
        >
          <Text style={{ color: "white" }}>Signing in...</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { login, clearMessage })(SignIn);
