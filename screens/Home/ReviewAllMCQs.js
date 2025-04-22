import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";
import url from "../../utils/URL";
import Loading from "../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import Pagination from "../../components/Pagination";
import { logout } from "../../redux/actions/authActions";
// import { useFonts } from "expo-font";
// import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import MCQItem from "../../components/MCQItem";
import { baseUrl } from "../../constants/global";
import Icon from "react-native-vector-icons/FontAwesome";
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";

// import {
//   BannerAd,
//   BannerAdSize,
//   RewardedAd,
//   TestIds,
//   AdEventType,
//   RewardedAdEventType,
//   RewardedInterstitialAd,
//   useRewardedInterstitialAd,
//   useInterstitialAd,
// } from "react-native-google-mobile-ads";

const ReviewAllMCQs = (props) => {
  const [displayDetails, setDisplayDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [details, setDetails] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [page, setPage] = useState(1);
  const [type, setType] = useState();
  const [p, setP] = useState();
  const [loadingData, setLoadingData] = useState(false);
  const [displayMcqs, setDisplayMcqs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    console.log("ReviewAllMCQs props.route.params:", props.route?.params);
  }, []);

  const renderMCQItem = useCallback(
    ({ item, index }) => (
      <MCQItem
        item={item}
        index={index}
        page={page}
        mainProps={props}
        isReview={true}
        showDetailModal={(det, detType, detImage) => {
          const detailObject = {
            detail: det,
            detailType: detType,
            detailImage: detImage,
          };
          setDetails(detailObject);
          setDisplayDetails(true);
        }}
      />
    ),
    [page]
  );

  useEffect(() => {
    getReviewMCQs(1);
  }, [props.page]);

  const preupdatePage = async (type, p) => {
    updatePageSkipAd(type, p);
  };
  
  const updatePageSkipAd = (type, p) => {
    console.log("inside updatePage");
    console.log("type " + type);
  
    let nextPage = page;
  
    if (type === "inc") {
      const maxPages = Math.ceil(props.route.params.totalQuestions / 10);
      if (page < maxPages) {
        nextPage = page + 1;
      } else {
        return; // already at last page
      }
    } else if (type === "dec") {
      if (page > 1) {
        nextPage = page - 1;
      } else {
        return; // already at first page
      }
    } else if (typeof p === "number") {
      nextPage = p;
    }
  
    setPage(nextPage);
    setLoading(true);
    getReviewMCQs(nextPage);
  };

  // const page = props.page || 1;
  // let [fontsLoaded] = useFonts({
  //   Rubik_400Regular,
  // });
  const getReviewMCQs = async (page = 1) => {
    try {
      setLoading(true);

      console.log("ReviewAllMCQs fetching page:", page);
      console.log("Route params:", props.route?.params);

      let user = await AsyncStorage.getItem("persist:auth");
      let token = JSON.parse(user).token.slice(1, -1);

      const data = {
        subjectid: props.route.params.subjectid,
        chapterid: props.route.params.chapterid,
        offset: (page - 1) * 10,
        userid: props.auth.user.id,
        sessionid: Math.trunc(Date.now() / 1000),
      };

      console.log("Sending request with data:", data);

      const searchParams = new URLSearchParams();
      for (const key in data) {
        searchParams.append(key, data[key]);
      }

      const response = await fetch(`${baseUrl}/api/quiz/getrevision`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: searchParams.toString(),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (result?.status === "success" && result.data) {
        setMcqs(result.data);
      } else {
        Alert.alert("Check your internet connection and try again!", "", [
          { text: "Try Again", onPress: () => getReviewMCQs(1) },
        ]);
      }
    } catch (error) {
      console.error("Error fetching MCQs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <View
      style={{
        padding: 30,
        backgroundColor: "white",
        height: "100%",
        marginTop: 20,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() => props.navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            textAlign: "center",
            marginRight: 20,
            fontSize: 18,
            fontWeight: 500,
            fontFamily: "Rubik_400Regular",
          }}
          selectable={false}
        >
          {props.route.params.chapterName}
        </Text>
      </View>
      {mcqs.length === 0 ? (
        <Text
          style={{
            color: "rgba(139, 139, 139, 1)",
            textAlign: "center",
            marginTop: 140,
            fontSize: 16,
            // fontFamily: "Rubik_400Regular",
            fontWeight: 400,
          }}
        >
          Coming Soon
        </Text>
      ) : (
        <FlatList
          data={mcqs}
          numColumns={1}
          contentContainerStyle={{ paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
          // onRefresh={() => {
          //   setRefreshing(true);
          //   getReviewMCQs(1);
          // }}
          // refreshing={refreshing}
          renderItem={renderMCQItem}
        />
      )}
      <View>
        <Modal
          isVisible={displayDetails}
          onBackdropPress={() => setDisplayDetails(false)}
          backdropOpacity={0.5}
          style={{ margin: 30, borderRadius: 8 }}
        >
          <View style={{ flex: 1, justifyContent: "center", borderRadius: 8 }}>
            <View
              style={{
                flexDirection: "row-reverse",
                backgroundColor: props.auth.themeMainColor,
                paddingVertical: 10,
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignSelf: "flex-end",
                  marginRight: 10,
                }}
                onPress={() => setDisplayDetails(false)}
              >
                <Image
                  source={require("../../assets/icons/cross.png")}
                  style={{ width: 17, height: 17 }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  textAlign: "center",
                  color: "#FFFF",
                  width: "100%",
                  fontWeight: 600,
                  paddingLeft: 20,
                  fontSize: 18,
                  marginLeft: 10,
                  // fontFamily: "Rubik_400Regular",
                }}
              >
                Details
              </Text>
            </View>

            <View style={{ backgroundColor: "#FFFF", padding: 20 }}>
              {/* <Text
                style={{
                  fontSize: 16,
                  color: "#181818",
                  textAlign: "center",
                  marginVertical: 10,
                  fontWeight: 500,
                  fontFamily: "Rubik_400Regular",
                }}
              >
                 Details
              </Text> */}
              <View
                style={{
                  flexDirection: "column",
                }}
              >
                <Icon
                  name="quote-right"
                  size={8}
                  style={{
                    color: "#FF8F0F",
                  }}
                />

                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(130, 130, 130, 1)",
                    textAlign: "center",
                    paddingLeft: 10,
                    paddingRight: 10,
                    // fontFamily: "Rubik_400Regular",
                  }}
                  selectable={false}
                >
                  {details.detail}
                </Text>
                <Icon
                  name="quote-left"
                  size={8}
                  style={{
                    color: "#FF8F0F",
                    alignSelf: "flex-end",
                  }}
                />
              </View>

              <View
                style={{
                  width: 274,
                  height: 274,
                  borderRadius: 8,
                  marginVertical: 30,
                  alignSelf: "center",
                }}
              >
                <Image
                  source={{ uri: details.detailImage }}
                  style={{ flex: 1 }}
                  resizeMode="cover"
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => setDisplayDetails(false)}
                  style={{
                    backgroundColor: "#FF8F0F",
                    borderRadius: 100,
                    paddingVertical: 15,
                    paddingHorizontal: 40,
                    marginLeft: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFF",
                      fontSize: 14,
                      // fontFamily: "Rubik_400Regular",
                    }}
                  >
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      {mcqs.length !== 0 && (
        <Pagination
          {...props}
          subjectid={props.route.params.subjectid}
          chapterid={props.route.params.chapterid}
          subjectName={props.route.params.subjectName}
          chapterName={props.route.params.chapterName}
          chapterDescription={props.route.params.chapterDescription}
          updatePage={preupdatePage}
          page={page}
          setPage={setPage}
        />
      )}
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(ReviewAllMCQs);
