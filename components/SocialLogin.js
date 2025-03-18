import { View, Image, TouchableOpacity } from "react-native";
import React from "react";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const SocialLogin = (props) => {
  // const redirectUri = AuthSession.makeRedirectUri({
  //   useProxy: true,
  //   path: "@cepapp/CEP",
  // });
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "262256352522-5ec5jdhpb7p88vtu96aeh9tsbebes7nl.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    
  });

  const [requestFB, responseFB, promptAsyncFB] = Facebook.useAuthRequest({
    clientId: "803687574931841",
  });

  const signInWithFacebook = async () => {
   // props.setLoading(true);
    const responseFB = await promptAsyncFB();
    if (
      responseFB &&
      responseFB.type === "success" &&
      responseFB.authentication
    ) {
      const userInfoResponse = await fetch(
        `https://graph.facebook.com/me?access_token=${responseFB.authentication.accessToken}&fields=id,email,name,picture.type(large)`
      );
      const userInfo = await userInfoResponse.json();
      let data = {
        email: userInfo.email,
        fullname: userInfo.name,
        othermethod: "google",
        displaypicture: userInfo.picture.data.url,
      };
      props.login(data);
    }
  };

  const signInWithGoogleAsync = async () => {
    //props.setLoading(true);

    const response = await promptAsync();
    if (response?.type === "success") {
      const user = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: {
          Authorization: `Bearer ${response.authentication.accessToken}`,
        },
      });
      const userInfo = await user.json();
      let data = {
        email: userInfo.email,
        fullname: userInfo.name,
        // password: userInfo.id,
        othermethod: "google",
        displaypicture: userInfo.picture,
      };
      props.login(data);
    }
  };
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 20,
        }}
      >
        <TouchableOpacity
          style={{
            paddingVertical: 20,
            paddingHorizontal: 40,
            marginRight: 10,

            backgroundColor: "white",
            elevation: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.04,
            shadowRadius: 0,
            borderRadius: 8,
          }}
          onPress={() => signInWithFacebook()}
        >
          <Image
            source={require("../assets/facebookIcon.png")}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => signInWithGoogleAsync()}
          style={{
            paddingVertical: 20,
            paddingHorizontal: 40,
            backgroundColor: "white",
            elevation: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.04,
            shadowRadius: 0,
            borderRadius: 8,
          }}
        >
          <Image
            source={require("../assets/googleIcon.png")}
            style={{ width: 23, height: 24 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SocialLogin;
