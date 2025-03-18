import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import {BannerAd, BannerAdSize, RewardedAd, TestIds, AdEventType, RewardedAdEventType, RewardedInterstitialAd, useRewardedInterstitialAd} from 'react-native-google-mobile-ads';
import url from "../../utils/URL";
import Loading from "../../components/Loading";
import { logout, shufflelogin, rewardedShown, rewardedNot } from "../../redux/actions/authActions";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import PushNotifications from "../../utils/PushNotifications";
import { baseUrl, admobAdBanner, admobTestRewarded, admobRewardedInterestial } from "../../constants/global";
import { Button } from "react-native";
import { ToastAndroid } from "react-native";



const TestType = (props) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });




  // const rewarded_admobAd = RewardedInterstitialAd.createForAdRequest("ca-app-pub-3940256099942544/5354046379", {
  //   requestNonPersonalizedAdsOnly: true,
  //   keywords: ['fashion', 'clothing'],
  // });


  const { isLoaded, isClosed, load, show, isEarnedReward,error }  = useRewardedInterstitialAd(admobRewardedInterestial, {
    requestNonPersonalizedAdsOnly: true,
  });
  

  // useEffect(() => {
  //   // Start loading the interstitial straight away
  //   if(isLoaded){
  //     console.log("loaded reward...")
  //     ToastAndroid.show("Reward Loaded", ToastAndroid.LONG)
  //   }
  // }, [isLoaded]);

  // useEffect(()=>{
  //   console.log("err..."+JSON.stringify(error))
  // },[error])

  useEffect(()=>{
    load()
  },[isClosed])

  useEffect(() => {
    // Start loading the interstitial straight away
    //if(props.auth.rewardedShown!=true){
  
  console.log("is Loaded."+isLoaded)    
  if(!isLoaded){ 
   load();
   console.log("Rewarded Loading...")
 
  }
  }, [load, ]);




  useEffect(()=>{
    if(isEarnedReward){
      props.navigation.navigate("CustomizeQuiz")
    }
  },[isEarnedReward])


  // useEffect(() => {
  //   const unsubscribe = rewarded_admobAd.addAdEventListener(RewardedAdEventType.LOADED,
  //     () => {
  //       console.log("video Loaded...")
  //     //  rewarded_admobAd.show()
  //     //  setRewardInterLoaded(true)
  //    // rewarded_admobAd.show()
  //     }
  //   );

  //   const reload = rewarded_admobAd.addAdEventListener(AdEventType.CLOSED,
  //     () => {
  //       console.log("video reloading...")
  //    //   rewarded_admobAd.load();
  //    // rewarded_admobAd.show()
  //     }
  //   );

  //   const errorChecker = rewarded_admobAd.addAdEventListener(AdEventType.ERROR, 
  //     (err) => {
  //     console.log("got error "+JSON.stringify(err))
  //     }
  //   );

  //   const unsubscribeEarned = rewarded_admobAd.addAdEventListener(
  //     RewardedAdEventType.EARNED_REWARD,
  //     (reward) => {
  //       props.rewardedShown()
  //       props.navigation.navigate("CustomizeQuiz")
  //     },
  //   );

  //   // const earnedReward = rewarded_admobAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
  //   //   //setRewardInterShown(true)
    
  //   // });
  //  //  setRewardInterLoaded(true)
  //  //  setRewardInterShown(false)
  //   rewarded_admobAd.load();
  //   console.log("Ad Loading...")      
  //   // if(props.auth.rewardedShown!=true){
  //   //   rewarded_admobAd.load();      
  //   // }
  //   return ()=> {
  //   unsubscribe();
  //   unsubscribeEarned();
  //   errorChecker()
  //   reload()
  //   }
  // }, []);


 


  useEffect(() => {
    getExams();
  }, []);

  const getExams = async () => {
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);

    if (token === "ul") {
      user = await AsyncStorage.getItem("persist:auth");
      token = JSON.parse(user).token.slice(1, -1);
    }
    fetch(`${baseUrl}/api/exams/show`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${props.auth.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("response css screen "+JSON.stringify(data))
        if (data.message === "Token has expired") {
          Alert.alert("Session Token Expired!", "Kindly login again!", [
            {
              text: "Ok",
              onPress: () => {
                //props.navigation.navigate("SignIn");
                props.logout();
              },
            },
          ]);
        } else if (data?.status === "success") {
          setExams(data.data);
          setLoading(false);
          setRefreshing(false);
        }
      })
      .catch((e) => {
        Alert.alert("Kindly, check your internet connection", "", [
          { text: "Try Again", onPress: () => getExams() },
        ]);
      });
  };

  function extractWidthAndHeight(iconUrl) {
    const regex = /(\d+)x(\d+)\.png$/;
    const match = iconUrl.match(regex);
    if (match) {
      const width = parseInt(match[1]) / 100;
      const height = parseInt(match[2]) / 100;
      return { width, height };
    } else {
      return null;
    }
  }


  useEffect(()=>{
   // console.log("welcome "+props.auth.welcomePageSeen)
    if (props.auth.welcomePageSeen==false) {
    //  console.log("welcome  b"+props.auth.welcomePageSeen)
   
      props.navigation.navigate("AppIntro");
    }
  },[])


  function showRewardedAddDialog(){
        if(isLoaded){  
          Alert.alert("Customize Quiz", "In order to attempt 'Customize Quiz', we need you to watch an Ad.", [
              { text: "Watch", onPress: () => show() },
              { text: "Don't Watch", onPress: () => console.log("close") },
          ]);
        }else{
          props.navigation.navigate("CustomizeQuiz")
        }
  }



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
        
      
      <View style={{
        marginVertical:5,
        alignSelf:'center'
      }}> 
      <BannerAd 
        size={BannerAdSize.BANNER}
        unitId={admobAdBanner}
        onAdLoaded={() => {
          console.log('Advert loaded');
        }}
        onAdFailedToLoad={error => {
          console.error('Advert failed to load: ', error);
        }}
      /> 
      </View>
       {/* <TouchableOpacity
                    style={{
                      backgroundColor: "rgba(255, 143, 15, 1)",
                      paddingVertical: 5,
                      paddingHorizontal: 20,
                      marginTop: 10,
                      height:50
                    }}
                    onPress={() => props.rewardedNot()}
                  >
                    <Text
                      style={{ color: "white", fontSize: 15, fontWeight: 600 }}
                    >
                      Rewarded Not Status 
                    </Text>
                  </TouchableOpacity>  */}
      <View>


      </View>
        <FlatList
          style={{marginBottom:150}} 
          data={exams}
          numColumns={1}
          contentContainerStyle={{ paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
          onRefresh={() => {
            setRefreshing(true);
            getExams();
          }}
          ListHeaderComponent={
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                backgroundColor: "rgba(224, 255, 250, 1)",
                marginVertical: 10,
                borderRadius: 8,
                paddingVertical: 10,
                marginHorizontal: 20,
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
                  Customize Quiz
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
                      style={{ color: "white", fontSize: 10, fontWeight: 600 }}
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
          }
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
                fontWeight: 500,
                borderRadius: 8,
              }}
              onPress={() =>
                //console.log("item id "+item.id)
                props.navigation.navigate("SelectSubject", { examid: item.id })
              }
              key={index}
            >
              <Image
                source={{ uri: `https://${item.icon}` }}
                style={{
                  width: extractWidthAndHeight(item.icon).width,
                  height: extractWidthAndHeight(item.icon).height,
                  marginBottom: 15,
                }}
              />
              <Text
                style={{
                  color: "rgba(24, 24, 24, 1)",
                  fontFamily: "Rubik_400Regular",
                  fontSize: 15,
                  fontWeight: 600,
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
      <PushNotifications />
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout, shufflelogin, rewardedShown, rewardedNot })(TestType);
