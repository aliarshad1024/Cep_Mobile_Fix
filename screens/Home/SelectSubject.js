import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,
  BackHandler,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import Footer from "../../components/Footer";

import Loading from "../../components/Loading";
import url from "../../utils/URL";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { connect } from "react-redux";
import { logout, rewardedShown } from "../../redux/actions/authActions";

import Greetings from "../../components/Greetings";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import Subject from "../../components/Subject";
import MainSection from "../../components/MainSection";
import {
  baseUrl,
  admobAdBanner,
  admobInterestial,
  admobRewardedInterestial,
} from "../../constants/global";
// import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { ToastAndroid } from "react-native";

const SelectSubject = (props) => {
  const [compulsorySubjects, setCompulsorySubjects] = useState([]);
  const [optionalSubjects, setOptionalSubjects] = useState([]);

  const [filteredSubjects, setFilteredSubjects] = useState(null);
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilterSubject, setSelectedFilterSubject] = useState("All");
  const [filterSubjects, setFilterSubjects] = useState([]);
  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });

  // const[]

  const renderItem = useCallback(
    ({ item }) => <MainSection navigation={props.navigation} item={item} />,
    []
  );

  var interestial_loaded = false;
  var interestial_shown = false;

  // const interstitial = InterstitialAd.createForAdRequest(admobInterestial, {
  //   requestNonPersonalizedAdsOnly: false,
  //   keywords: ['fashion', 'clothing'],
  // });

  // const { isLoaded, isClosed, load, show, isEarnedReward }  = useRewardedInterstitialAd(admobRewardedInterestial, {
  //   requestNonPersonalizedAdsOnly: true,
  // });

  // useEffect(()=>{
  //   load()
  // },[isClosed])

  // useEffect(() => {
  // console.log("is Loaded."+isLoaded)
  // if(!isLoaded){
  //  load();
  //  console.log("Rewarded Loading...")

  // }
  // }, [load, ]);

  // useEffect(() => {
   
  //   props.navigation.navigate("CustomizeQuiz");
  // }, [isEarnedReward]);

  // useEffect(() => {
  //   const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
  //     interestial_loaded= true;
  //     interestial_shown= false
  //    // console.log("interestial "+interestial_loaded+" "+interestial_shown)
  //     // ToastAndroid.show("Loaded", ToastAndroid.LONG)
  //   });

  //   interstitial.load();
  //   unsubscribe;
  // }, []);

  // useEffect(() => {
  //   // const backAction = () => {
  //   //    console.log(""+interestial_loaded+" "+interestial_shown)
  //   //    if(interestial_loaded==true && interestial_shown==false){
  //   //     interestial_shown=true
  //   //     interstitial.show()
  //   //    }else{
  //   //     //BackHandler.exitApp()
  //   //      return false;
  //   //   }

  //   // };

  //   // const backHandler = BackHandler.addEventListener(
  //   //   'hardwareBackPress',
  //   //   backAction,
  //   // );

  //  // return () => backHandler.remove();
  // }, []);

  const getItemSubject = (data, index) => {
    ({ length: 145, offset: 145 * index, index });
  };

  function showRewardedAddDialog() {
    // if (isLoaded) {
    //   Alert.alert(
    //     "Customize Quiz",
    //     "In order to attempt 'Customize Quiz', we need you to watch an Ad.",
    //     [
    //       { text: "Watch", onPress: () => show() },
    //       { text: "Don't Watch", onPress: () => console.log("close") },
    //     ]
    //   );
    // } else {
    // }
    props.navigation.navigate("CustomizeQuiz");

  }

  const CustomizeQuiz = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            backgroundColor: "rgba(224, 255, 250, 1)",
            marginTop: 10,
            borderRadius: 8,
            paddingVertical: 10,
            paddingLeft: 8,
          }}
        >
          <View>
            <Text
              style={{
                color: "rgba(255, 143, 15, 1)",
                fontSize: 18,
                fontWeight: 500,
                fontFamily: "Rubik_400Regular",
              }}
            >
              Mock Exam
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: 400,
                fontFamily: "Rubik_400Regular",
              }}
            >
              Select Subject According to paper
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 100,
                  backgroundColor: "rgba(255, 143, 15, 1)",
                  paddingVertical: 5,
                  paddingHorizontal: 20,
                  marginTop: 10,
                }}
                onPress={() => showRewardedAddDialog()}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                >
                  Start
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Image
              source={require("../../assets/customizeQuiz.png")}
              style={{ width: 93, height: 81 }}
            />
          </View>
          <View>
            <Image
              source={require("../../assets/icons/premium.png")}
              style={{ width: 10, height: 9 }}
            />
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    getSubjects();
  }, []);

  // useEffect(() => {
  //   rewarded.load()
  // }, []);

  const getSubjects = async () => {
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    console.log("exam " + props.route.params.examid);
    let data = {
      examid: props.route.params.examid,
      active: 1,
    };
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, data[key]);
    }
    fetch(`${baseUrl}/api/subjects/listexamssubjects`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: searchParams.toString(),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.message === "Token has expired") {
        } else if (response.data) {
          const data = response.data[0];
          const sectionData = Object.keys(data).map((key) => {
            const categoryData = data[key];
            const subSections = Object.keys(categoryData).map((subKey) => {
              const subjects = categoryData[subKey].map((item) => item);
              return {
                title: subKey,
                data: subjects,
              };
            });
            return {
              title: key,
              data: subSections,
            };
          });
          setData(sectionData);
          setRawData(data);

          // const allSubjects = Object.keys(data).reduce((acc, key) => {
          //   const categoryData = data[key];
          //   const subjects = Object.keys(categoryData).reduce(
          //     (acc2, subKey) => {
          //       const subSubjects = categoryData[subKey].map(
          //         (item) => item.name
          //       );
          //       return [...acc2, ...subSubjects];
          //     },
          //     []
          //   );
          //   return [...acc, ...subjects];
          // }, []);

          // const subjects = subjectsFetched.map((item) => item.name);
          //setFilterSubjects(["All Subjects", ...allSubjects]);

          let subGroups = [];
          for (let subject in data) {
            let groups = data[subject];
            for (let group in groups) {
              subGroups.push(group);
            }
          }

          // const subjects = subjectsFetched.map((item) => item.name);
          setFilterSubjects(["All", ...subGroups]);
        }
        setLoading(false);
        setRefreshing(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const searchSubjectsUsingFilter = (filterKeyword) => {
    if (filterKeyword === "All" || filterKeyword === "") {
      setFilteredSubjects(null);
    } else {
      let subjects = [];
      for (let key in rawData) {
        let subGroups = rawData[key];
        for (let subGroup in subGroups) {
          if (subGroup === filterKeyword) {
            subjects = subGroups[subGroup];
          }
        }
      }
      setFilteredSubjects(subjects);
    }
  };

  const searchSubjects = (searchKeyword) => {
    if (searchKeyword === "All" || searchKeyword === "") {
      setFilteredSubjects(null);
    } else {
      // let filteredSubjects = data.filter((subject) =>
      //   subject.name.toLowerCase().includes(searchKeyword.toLowerCase())
      // );
      // const filteredSubjects = data.reduce((acc, section) => {
      //   const subjects = section.data.reduce((acc2, subSection) => {
      //     const filteredSubSubjects = subSection.data.filter((subject) =>
      //       subject.name.includes(searchKeyword)
      //     );
      //     return [...acc2, ...filteredSubSubjects];
      //   }, []);
      //   return [...acc, ...subjects];
      // }, []);

      let subjects = [];
      for (let key in rawData) {
        let subGroups = rawData[key];
        // console.log("rawData "+JSON.stringify(rawData[key]))
        // console.log("subGroups "+JSON.stringify(subGroups))

        for (let subGroup in subGroups) {
          //subGroups.map((item, index)=>{
          // console.log("subJect "+JSON.stringify(subGroups[subGroup]))
          subGroups[subGroup].map((item, index) => {
            console.log("add " + JSON.stringify(item));
            if (item.name.includes(searchKeyword)) {
              subjects = [...subjects, item];
            }
          });
          //})

          // if (subGroup.name.includes(searchKeyword)) {
          //   console.log("add "+JSON.stringify(subGroups[subGroup]))

          //   subjects = subGroups[subGroup];
          // }
        }
      }
      setFilteredSubjects(subjects);
      console.log("Filtering done " + JSON.stringify(subjects));
    }
  };

  return (
    <View style={{ height: "100%", backgroundColor: "white" }}>
      <View
        style={{
          backgroundColor: props.auth.themeMainColor,
        }}
      >
        <View
          style={{
            padding: 30,
            marginTop:20
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
              height: 50,
            }}
          >
            <View>
              <Greetings />
              {/* <Text
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: "white",
                }}
              >
                {props.auth.user?.fullname}
              </Text> */}
            </View>
            <Image
              style={{
                width: 45,
                height: 45,
                borderRadius: 204,
                borderWidth: 1,
                borderColor: "#FFF",
                backgroundColor:"white"
              }}
              source={
                !props.auth.picture
                  ? require("../../assets/icons/cake.png")
                  : { uri: props.auth.picture }
              }
              resizeMode="contain"
            />
          </View>
          <View
            style={{
              borderRadius: 100,
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <MaterialIcons name="search" size={24} color="gray" />
            <TextInput
              style={{
                marginLeft: 5,
                fontFamily: "Rubik_400Regular",
                width: "100%",
              }}
              placeholder="Search Subject or Topic"
              placeholderTextColor="#888"
              onChangeText={(t) => searchSubjects(t)}
            />
            <View style={{ marginLeft: "auto" }}>
              {/* <Feather name="filter" size={20} color="#0CE5BF" /> */}
              <Image
                source={require("../../assets/icons/filter.png")}
                style={{ width: 17, height: 17 }}
              />
            </View>
          </View>
        </View>
        <View style={{ marginBottom: 10, marginLeft: 20 }}>
          <FlatList
            data={filterSubjects}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedFilterSubject(item);
                  searchSubjectsUsingFilter(item);
                }}
                key={`${item.name}-${index}`}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 8,
                    paddingHorizontal: 20,
                    height: 36,
                    borderWidth: 1.5,
                    borderColor:
                      selectedFilterSubject !== item
                        ? "#FFFFFF"
                        : props.auth.themeSecondaryColor,
                    borderRadius: 100,
                    marginRight: 10,
                    backgroundColor:
                      selectedFilterSubject === item
                        ? props.auth.themeSecondaryColor
                        : props.auth.themeMainColor,
                  }}
                >
                  {console.log("items " + JSON.stringify(item))}
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontFamily: "Rubik_400Regular",
                    }}
                  >
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{ marginBottom: 10, marginLeft: 20 }}></View>
      </View>

      {loading ? (
        <Loading />
      ) : (
        <>
          {filteredSubjects == null ? (
            <>
              <View
                style={{
                  marginVertical: 5,
                  alignSelf: "center",
                }}
              >
                {/* <BannerAd 
        size={BannerAdSize.BANNER}
        unitId={admobAdBanner}
        onAdLoaded={() => {
          console.log('Advert loaded');
        }}
        onAdFailedToLoad={error => {
          console.error('Advert failed to load: ', error);
        }}
      /> */}
              </View>
              <FlatList
                style={{ marginHorizontal: 10, marginBottom: 70 }}
                data={data}
                disableVirtualization={true}
                ListHeaderComponent={CustomizeQuiz}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                renderItem={({ item: section, index }) => (
                  <View key={`section - ${index}`}>
                    <Text
                      style={{
                        color: props.auth.themeMainColor,
                        fontSize: 18,
                        fontWeight: 500,
                        marginLeft: 10,
                        marginVertical: 8,
                      }}
                    >
                      <Text style={{ color: "#FF8F0F" }}>
                        {index === 0 ? "A" : index === 1 ? "B" : "C"}.{" "}
                      </Text>
                      {section.title}
                    </Text>

                    <FlatList
                      data={section.data}
                      renderItem={({ item: subSection, index: subIndex }) => (
                        <View key={`${subIndex}-${subSection.title}`}>
                          {subSection.title !== section.title && (
                            <Text style={styles.subsection_text}>
                              {subSection.title}
                            </Text>
                          )}
                          <View style={styles.subsection_container}>
                            <FlatList
                              data={subSection.data}
                              style={{ flex: 1 }}
                              numColumns={2}
                              //getItemLayout={getItemSubject}
                              keyExtractor={({
                                item: subject,
                                index: subject_index,
                              }) => `subject-${subject_index}`}
                              // renderItem={({ item:subject, index:subject_index }) => (
                              //   // <Text>
                              //   //   A
                              //   // </Text>
                              //   <MainSection
                              //   navigation={props.navigation}
                              //   item={subject}
                              //   key={`subject-${subject_index}`}
                              // />
                              // )}
                              renderItem={renderItem}
                            ></FlatList>
                          </View>
                        </View>
                      )}
                    ></FlatList>
                  </View>
                )}
              ></FlatList>
            </>
          ) : (
            <ScrollView style={{ marginBottom: 70 }}>
              <View style={{ marginHorizontal: 20 }}>
                <View
                  style={{
                    marginVertical: 5,
                    alignSelf: "center",
                  }}
                >
                  {/* <BannerAd 
                  size={BannerAdSize.BANNER}
                  unitId={admobAdBanner}
                  onAdLoaded={() => {
                    console.log('Advert loaded');
                  }}
                  onAdFailedToLoad={error => {
                    console.error('Advert failed to load: ', error);
                  }}
                /> */}
                </View>
                {CustomizeQuiz()}
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#424242",
                      fontFamily: "Rubik_400Regular",
                      marginVertical: 8,
                      color: "#FF8F0F",
                    }}
                  >
                    {/* {filteredSubjects[0].group_category} */}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    {filteredSubjects.map((item, index) => {
                      console.log("item abid " + JSON.stringify(item));
                      return (
                        <Subject
                          navigation={props.navigation}
                          item={item}
                          key={`subject-${index}`}
                        />
                      );
                    })}
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </>
      )}
      <Footer {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  subsection_text: {
    fontSize: 16,
    color: "#424242",
    fontFamily: "Rubik_400Regular",
    marginVertical: 8,
    marginLeft: 10,
  },
  subsection_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout, rewardedShown })(
  SelectSubject
);
