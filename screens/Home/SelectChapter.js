import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert
} from "react-native";
import React, { useState, useEffect } from "react";
// import { Feather } from "@expo/vector-icons";
import url from "../../utils/URL";
import Loading from "../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../../redux/actions/authActions";
import { connect } from "react-redux";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import Footer from "../../components/Footer";
import ChapterItem from "../../components/ChapterItem";
import { baseUrl } from "../../constants/global";

const SelectChapter = (props) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [displayChapters, setDisplayChapters] = useState([]);
  const [page, setPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);

  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });

  useEffect(() => {
    getChapters();
  }, []);

  const getChapters = async () => {
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);

    if (token === "ul") {
      user = await AsyncStorage.getItem("persist:auth");
      token = JSON.parse(user).token.slice(1, -1);
    }

    fetch(`${baseUrl}/api/chapters/show`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${props.auth.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Token has expired") {
          Alert.alert("Session Token Expired!", "Kindly login again!", [
            {
              text: "Ok",
              onPress: () => {
                props.logout();
              },
            },
          ]);
        } else if (data?.status === "success") {
          setChapters(data.data);
          setDisplayChapters(data.data);
          setTotalQuestions(data.data.length);
          setLoading(false);
          setRefreshing(false);
        }
      })
      .catch((e) => {
        Alert.alert("Kindly, check your internet connection", "", [
          { text: "Try Again", onPress: () => getChapters() },
        ]);
      });
  };

  if (loading) {
    return (
      <View style={{ height: "100%" }}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={{ height: "100%", backgroundColor: "white" }}>
      <View>
        <FlatList
          style={{ marginBottom: 150 }}
          data={displayChapters}
          numColumns={1}
          contentContainerStyle={{ paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
          onRefresh={() => {
            setRefreshing(true);
            getChapters();
          }}
          refreshing={refreshing}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                shadowColor: "#404040",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 12,
                elevation: 5,
                padding: 24,
                marginBottom: 20,
                marginHorizontal: 20,
                fontWeight: "500",
                borderRadius: 8,
              }}
              onPress={() =>
                props.navigation.navigate("Quiz", {
                  chapters: item,
                  totalQuestions: totalQuestions,
                })
              }
              key={index}
            >
              <Image
                source={{ uri: `https://${item.icon}` }}
                style={{
                  width: 100,
                  height: 100,
                  marginBottom: 15,
                }}
              />
              <Text
                style={{
                  color: "rgba(24, 24, 24, 1)",
                  fontFamily: "Rubik_400Regular",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={{ marginTop: "auto" }}>
        <Footer {...props} />
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(SelectChapter);
