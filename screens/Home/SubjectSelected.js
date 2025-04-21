import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import Footer from "../../components/Footer";
import SelectChapter from "./SelectChapter";
import AttemptAllMCQs from "./AttemptAllMCQs";
import ReviewAllMCQs from "./ReviewAllMCQs";
import Pagination from "../../components/Pagination";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import { useFocusEffect } from "@react-navigation/native";
import { connect } from "react-redux";
import { admobInterestial, baseUrl } from "../../constants/global";
// import {TestIds, useInterstitialAd, InterstitialAd, AdEventType} from 'react-native-google-mobile-ads';


const SubjectSelected = (props) => {
  const [subject, setSubject] = useState(props.route.params.subject);
  const [testType, setTestType] = useState(
    props.route.params.testType ? props.route.params.testType : "Chapters"
  );
  // const testTypesArray = ["Chapters", "Review MCQs", "Attempt MCQs"];
  const testTypesArray = ["Chapters", "Review MCQs", "Attempt MCQs"];

  const [page, setPage] = useState(1);
  const [timeStarted, setTimeStarted] = useState(null);

  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);



  var interestial_loaded=false;
  var interestial_shown =false;



  
  const [type, setType] = useState()
  const [p, setP] = useState()




  // const { isLoaded, isClosed, load, show }  = useInterstitialAd(admobInterestial, {
  //   requestNonPersonalizedAdsOnly: true,
  // });
  


  // const interstitial = InterstitialAd.createForAdRequest(admobInterestial, {
  //   requestNonPersonalizedAdsOnly: false,
  //   keywords: ['fashion', 'clothing'],
  // });
  


  
  // useEffect(() => {
  //   const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
  //     interestial_loaded= true;
  //     interestial_shown= false
  //   });

  //   const relaod_admob = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
  //     interestial_loaded= true;
  //     interestial_shown= false
  //   });
  //   interestial_shown = false
  //   interstitial_loaded = false 
  //   interstitial.load();
  //   unsubscribe;
  //   relaod_admob;
  // }, []);



  // useEffect(()=>{
  //   if(isClosed)
  //     updatePage()
  // },[isClosed])



  useEffect(() => {
    if(page%3==0 && !isLoaded){
       load()
    }
  }, [page]);





  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setTotalCorrect(0);
      setTotalWrong(0);
      setSelectedOptions([]);
      setQuestionsAttempted(0);
      setTimeStarted(null);
    }, [])
  );



  const updatePage = () => {
    if (type === "inc") {
      if (page < Math.trunc(props.route.params.totalQuestions / 10)) {
        setPage(page + 1);
      }
    } else if (type === "dec") {
      if (page > 1) {
        setPage(page - 1);
      }
    } else {
      setPage(p);
    }
  };


  const updatePageSkipAd = (type, p) => {
    if (type === "inc") {
      if (page < Math.trunc(props.route.params.totalQuestions / 10)) {
        setPage(page + 1);
      }
    } else if (type === "dec") {
      if (page > 1) {
        setPage(page - 1);
      }
    } else {
      setPage(p);
    }
  };



  const preupdatePage=async(type, p)=>{
    setType(type)
    setP(p)
    if(page%3==0 && isLoaded){
      show()
    }else{
      updatePageSkipAd(type, p)
    }


}


  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });
  return (
    <View
      style={{
        padding: 15,
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
            {subject !== "FPSC" && subject !== "PPSC"
              ? subject
              : `${subject} Past Papers`}
          </Text>
        </View>
        {/* <View>
          <Image
            source={require("../../assets/icons/bell.png")}
            style={{ width: 20, height: 20 }}
          />
        </View> */}
      </View>

      {subject !== "FPSC" && subject !== "PPSC" && (
        <View
          style={{
            marginVertical: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/* {testTypesArray.map((item, index) => (
            <TouchableOpacity
              style={{
                flex: 1,
              }}
              onPress={() => {
                if(interestial_loaded && !interestial_shown){
                  interstitial.show()
                }
                setPage(1);
                setTestType(item);
              }}
              key={`type-${index}`}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: 8,
                  // paddingHorizontal: 8,
                  borderWidth: 1.5,
                  borderColor: props.auth.themeMainColor,
                  backgroundColor:
                    testType === item ? props.auth.themeMainColor : "#0000",
                  borderRadius: 100,
                  marginRight: 5,
                }}
              >
                <Text
                  style={{
                    color: testType === item ? "#FFFFFF" : "#000",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "Rubik_400Regular",
                  }}
                  selectable={false}
                >
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          ))} */}
        </View>
      )}
      {testType === "Chapters" ? (
        <SelectChapter
        {...props}
        testType={testType}
        setTestType={setTestType}
      />
      ) : testType === "Attempt MCQs" ? (
        <AttemptAllMCQs
          {...props}
          page={page}
          questionsAttempted={questionsAttempted}
          setQuestionsAttempted={setQuestionsAttempted}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          totalCorrect={totalCorrect}
          totalWrong={totalWrong}
          setTotalCorrect={setTotalCorrect}
          setTotalWrong={setTotalWrong}
          setTimeStarted={setTimeStarted}
        />
      ) : (
        <ReviewAllMCQs {...props} page={page} />
      )}

      {/* <Footer {...props} /> */}
      {testType !== "Chapters" ? (
        <Pagination
          for={testType === "Attempt MCQs" ? "quiz" : ""}
          all={true}
          {...props}
          page={page}
          updatePage={preupdatePage}
          totalCorrect={totalCorrect}
          totalWrong={totalWrong}
          timeStarted={timeStarted}
          subjectName={subject}
          setTestType={setTestType}
        />
      ) : (
        <Footer {...props} />
      )}
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(SubjectSelected);
