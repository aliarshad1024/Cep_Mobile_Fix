import { View, Text, TouchableOpacity, FlatList, Image,Alert } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";
import Loading from "../../components/Loading";
import url from "../../utils/URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { logout } from "../../redux/actions/authActions";
import { Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import Pagination from "../../components/Pagination";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import MCQItem from "../../components/MCQItem";
import { admobInterestial, baseUrl } from "../../constants/global";
// import {BannerAd, BannerAdSize, RewardedAd, TestIds, AdEventType, RewardedAdEventType, RewardedInterstitialAd, useRewardedInterstitialAd, useInterstitialAd} from 'react-native-google-mobile-ads';


const MCQs = (props) => {
  
  const [displayDetails, setDisplayDetails] = useState(false);
  const [details, setDetails] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [mcqs, setMcqs] = useState([]);
  const [displayMcqs, setDisplayMcqs] = useState([]);
  const [totalMCQs, setTotalMCQs] = useState(10);



  const [type, setType] = useState()
  const [p, setP] = useState()




  // const { isLoaded, isClosed, load, show }  = useInterstitialAd(admobInterestial, {
  //   requestNonPersonalizedAdsOnly: true,
  // });
  
  


  // useEffect(()=>{
  //   if(isClosed)
  //     updatePage()
     
  // },[isClosed])



  useEffect(() => {
    if(page%4==0 && !isLoaded){
       load()
    }
  }, [page]);


  
  const renderMCQItem=useCallback(({item, index}) => (
    <MCQItem
       item={item}
       index={index}
       page={page}
       isReview={false}
       mainProps={props}
       showDetailModal={(det, detType, detImage)=>{
        const detailObject = {
          detail:det,
          detailType:detType,
          detailImage:detImage
        }
        setDetails(detailObject);
        setDisplayDetails(true);
       }}
    />
  ),[page]);





  useEffect(() => {
    getMCQs(page);
  }, [page]);

  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });


  const getMCQs = async (offset) => {
    setLoading(true);
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    let data = {
      subjectid: props.route.params.subjectid,
      chapterid: props.route.params.chapterid,
      offset: (offset-1) * 10,
      userid: props.auth.user.id,
      sessionid: Math.trunc(Date.now() / 1000),
    };
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, data[key]);
    }
    fetch(`${baseUrl}/api/quiz/getrevision`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: searchParams.toString(),
    })
      .then((res) => res.json())
      .then((data) => {
         console.log("err "+JSON.stringify(data)) 
        if (data?.status === "success") {
          if (data.data) {
            setMcqs([...mcqs, ...data.data]);
            setDisplayMcqs(data.data);
          }
          setLoading(false);
          setRefreshing(false);
          setLoadingData(false);
        } else {
          Alert.alert("Check your internet connection and try again!", "", [
            { text: "Try Again", onPress: () => getMCQs(1) },
          ]);
        }
      })
      .catch((e) => {
        Alert.alert("Session Token Expired", "Kindly login again!", [
          {
            text: "Ok",
            onPress: () => {
             // props.navigation.navigate("SignIn");
              props.logout();
            },
          },
        ]);
        console.log("token Error:"+e)
      });
  };

  
const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);
  
  
  const preupdatePage=async(type, p)=>{
        setType(type)
        setP(p)
        if(page%4==0 && isLoaded){
          show()
        }else{
          updatePageSkipAd(type, p)
        }


  }



  
  const updatePage = () => {
    if (type === "inc") {
      if (page * 10 === mcqs.length) {
        if (page < (Math.trunc(props.route.params.totalQuestions / 10)+1)) {
          setPage(page + 1);
          setLoadingData(true);
          getMCQs(page + 1);
        }
      } else {
        setPage(page + 1);
        setDisplayMcqs(mcqs.slice(page * 10, (page + 1) * 10));
      }
    } else if(type === "dec") {
      if (page > 1) {
        setPage(page - 1);
        setDisplayMcqs(mcqs.slice((page - 1) * 10, page * 10));
      }
    } else {
      setPage(p)
      setLoadingData(true);
      getMCQs(p);
    }
  };


  const updatePageSkipAd = (type, p) => {
    console.log("inside updatePage")
    console.log("type "+type)
    if (type === "inc") {
      if (page * 10 === mcqs.length) {
        if (page < (Math.trunc(props.route.params.totalQuestions / 10)+1)) {
          setPage(page + 1);
          setLoadingData(true);
          console.log("page "+page)
    
          getMCQs(page + 1);
        }
      } else {
        setPage(page + 1);
        setDisplayMcqs(mcqs.slice(page * 10, (page + 1) * 10));
      }
    } else if(type === "dec") {
      if (page > 1) {
        setPage(page - 1);
        setDisplayMcqs(mcqs.slice((page - 1) * 10, page * 10));
      }
    } else {
      setPage(p)
      setLoadingData(true);
      getMCQs(p);
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
      }}
    >
      <View style={{ flexDirection: "row" }}>
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

      <Text
        style={{
          marginTop: 10,
          color: "#A3A3A3",
          fontFamily: "Rubik_400Regular",
        }}
      >
        Showing results “{displayMcqs.length}”
      </Text>
      {mcqs.length === 0 ? (
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
          {loadingData ? (
            <Loading />
          ) : (
            <FlatList
              data={displayMcqs}
              numColumns={1}
              contentContainerStyle={{ paddingBottom: 50 }}
              showsVerticalScrollIndicator={false}
              // onRefresh={() => {
              //   setRefreshing(true);
              //   getMCQs(1);
              // }}
              // refreshing={refreshing}
              renderItem={renderMCQItem}
            />
          )}
        </>
      )}
      <View>
        <Modal
          isVisible={displayDetails}
          onBackdropPress={() => setDisplayDetails(false)}
          backdropOpacity={0.5}
          style={{ margin: 20, borderRadius: 8 }}
        >
          <View style={{ flex: 1, justifyContent: "center", borderRadius: 8 }}>
          <View
              style={{
                flexDirection:'row-reverse',
                backgroundColor: props.auth.themeMainColor,
                paddingVertical: 10,
                justifyContent:'space-between'
              }}
            >

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignSelf: "flex-end",
                  marginRight:10,
                }}
                onPress={() => setDisplayDetails(false)}
              >
                <Image
                  source={require("../../assets/icons/cross.png")}
                  style={{ width: 17, height: 17 }} 
                 />

                {/* <FontAwesome
                name="window-close"
                size={17}
                color={"#FF8F0F"}
                >

                </FontAwesome> */}
              </TouchableOpacity>
              <Text
                style={{
                  textAlign: "center",
                  color: "#FFFF",
                  width:'100%',
                  fontWeight: 600,
                  paddingLeft:20,
                  fontSize: 18,
                  marginLeft:10,
                  fontFamily: "Rubik_400Regular",
                }}
              >
                Details
              </Text>
              
            </View>
            <View style={{ backgroundColor: "white", padding: 20 }}>
            
            <View style={{
                flexDirection:'column'
              }}>
              <Fontisto
                name="quote-a-right"
                size={8}
                style={{
                 color:"#FF8F0F",
                }}
             />
              
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(130, 130, 130, 1)",
                  textAlign: "center",
                  paddingLeft:10,
                  paddingRight:10,
                  fontFamily: "Rubik_400Regular",
                }}
                selectable={false}
              >
                 {details.detail}
              </Text>
              <Fontisto
                name="quote-a-left"
                size={8}
                style={{
                 color:"#FF8F0F",
                 alignSelf:'flex-end'
                }}
             />
              
              </View>
               



               <View
                style={{
                  width: 274,
                  height: 274,
                  borderRadius: 8,
                  marginVertical: 30,
                  alignSelf:'center'
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
                    borderRadius: 100,
                    paddingVertical: 15,
                    backgroundColor: "#FF8F0F",
                    paddingHorizontal: 40,
                    marginLeft: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      fontFamily: "Rubik_400Regular",
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

export default connect(mapStateToProps, { logout })(MCQs);
