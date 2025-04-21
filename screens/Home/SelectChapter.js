import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import url from "../../utils/URL";
import Loading from "../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../../redux/actions/authActions";
import { connect } from "react-redux";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import Footer from "../../components/Footer";
import ChapterItem from "../../components/ChapterItem";
import { admobInterestial, baseUrl } from "../../constants/global";
// import {BannerAd, BannerAdSize, RewardedAd, TestIds, AdEventType, RewardedAdEventType, RewardedInterstitialAd, useRewardedInterstitialAd, useInterstitialAd} from 'react-native-google-mobile-ads';

const SelectChapter = ({ testType, setTestType, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState([]);
  const [displayChapters, setDisplayChapters] = useState([]);
  const [openOptions, setOpenOptions] = useState("1");
  const [refreshing, setRefreshing] = useState(false);
  const [clickedItemA, setClickedItemA] = useState();
  const [clickedIndexA, setClickedIndexA] = useState();
  const [launchMCQs, setLaunchMCQs] = useState(false);

  // const { isLoaded, isClosed, load, show }  = useInterstitialAd(admobInterestial, {
  //   requestNonPersonalizedAdsOnly: true,
  // });

  // useEffect(()=>{
  //   if(isClosed){
  //      load()
  //      console.log("Ad Loading again...")
  //     }
  // },[isClosed])

  // useEffect(() => {
  //      load()
  //      console.log("Ad Loading started...")
  //   }, [load]);

  const navigateAfterAd = () => {
    if (launchMCQs) {
    } else {
    }
  };

  const renderChapterItem = useCallback(
    ({ item, index }) => (
      <ChapterItem
        mainProps={props}
        item={item}
        openOptions={openOptions}
        index={index}
        {...props}
        testType={testType}
        setTestType={setTestType}
        mcqsClicked={(clickedItem, clickedIndex) => {
          //  if(isLoaded){
          //   show()
          //  }

          props.navigation.navigate("MCQs", {
            subjectid: props.route.params.id,
            subjectName: clickedItem.name,
            chapterid: clickedItem.id,
            chapterName: props.route.params.subject,
            totalQuestions: clickedItem.totalquestions,
            chapterDescription: clickedItem.description,
            showQuestions: clickedItem.showquestions,

            nextChapterShowQuestions:
              displayChapters[Number(clickedIndex) + 1]?.showquestions,
            nextChapterId: displayChapters[Number(clickedIndex) + 1]?.id,
            nextChapterName: displayChapters[Number(clickedIndex) + 1]?.name,
            nextChapterDescription:
              displayChapters[Number(clickedIndex) + 1]?.description,
            nextChapterTotalQuestions:
              displayChapters[Number(clickedIndex) + 1]?.totalquestions,
          });
        }}
        quizClicked={(clickedItem, clickedIndex) => {
          //  if(isLoaded){
          //   show()
          //  }

          props.navigation.navigate("Quiz", {
            subjectid: props.route.params.id,
            subjectName: props.route.params.subject,
            chapterDescription: clickedItem.description,
            chapterid: clickedItem.id,
            chapterName: clickedItem.name,
            totalQuestions: clickedItem.totalquestions,
            showQuestions: clickedItem.showquestions,
            nextChapterShowQuestions:
              displayChapters[Number(clickedIndex) + 1]?.showquestions,
            nextChapterId: displayChapters[Number(clickedIndex) + 1]?.id,
            nextChapterName: displayChapters[Number(clickedIndex) + 1]?.name,
            nextChapterDescription:
              displayChapters[Number(clickedIndex) + 1]?.description,
            nextChapterTotalQuestions:
              displayChapters[Number(clickedIndex) + 1]?.totalquestions,
          });
        }}
        openOPtionCallback={setOpenOptions}
      />
    ),
    [openOptions]
  );

  useEffect(() => {
    getChapters();
  }, []);
  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });
  const getChapters = async () => {
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    fetch(`${baseUrl}/api/chapters/show/?subjectid=${props.route.params.id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.length !== 0) {
          //console.log("Chapters "+JSON.stringify(data.data))
          setDisplayChapters(data.data);
          setChapters(data.data);
        }
        setLoading(false);
        setRefreshing(false);
      })
      .catch((e) => {
        // Alert.alert("Session Token Expired", "Kindly login again!", [
        //   {
        //     text: "Ok",
        //     onPress: () => {
        //     //  props.navigation.navigate("SignIn");
        //       props.logout();
        //     },
        //   },
        // ]);
        console.log("Exception: " + JSON.stringify(e));
      });
  };

  if (loading) {
    return <Loading />;
  }

  const searchChapter = (searchKeyword) => {
    if (searchKeyword === "") {
      setDisplayChapters(chapters);
    } else {
      let filteredChapters = chapters.filter((chapter) =>
        chapter.description.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setDisplayChapters(filteredChapters);
    }
  };

  return (
    <View>
      {chapters?.length === 0 ? (
        <Text
          style={{
            color: "rgba(139, 139, 139, 1)",
            textAlign: "center",
            marginTop: 140,
            fontSize: 16,
            fontFamily: "Rubik_400Regular",
            fontWeight: 400,
          }}
        >
          Coming Soon
        </Text>
      ) : (
        <>
          <View
            style={{
              backgroundColor: "#FFF",
              height: 45,
              paddingHorizontal: 10,
              borderWidth: 0.5,
              borderColor: "#DADADA",
              borderRadius: 100,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/icons/searchIcon.png")}
                style={{ width: 17, height: 17, marginRight: 20 }}
              />
              <TextInput
                placeholder="Search"
                placeholderTextColor="#888"
                onChangeText={(t) => searchChapter(t)}
                style={{
                  fontFamily: "Rubik_400Regular",
                  width: "80%",
                }}
              />
            </View>
            <Image
              source={require("../../assets/icons/filter.png")}
              style={{ width: 17, height: 17 }}
            />
          </View>
          <FlatList
            data={displayChapters}
            numColumns={1}
            extraData={openOptions}
            contentContainerStyle={{ paddingBottom: 220 }}
            showsVerticalScrollIndicator={false}
            // onRefresh={() => {
            //   setRefreshing(true);
            //   getChapters();
            // }}
            renderItem={renderChapterItem}
          />
        </>
      )}
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(SelectChapter);
