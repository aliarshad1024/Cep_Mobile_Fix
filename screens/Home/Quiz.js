import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
// import { Feather } from "@expo/vector-icons";
import ProgressBar from "../../components/ProgressBar";
import Pagination from "../../components/Pagination";
import url from "../../utils/URL";
import Loading from "../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { logout } from "../../redux/actions/authActions";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import { useFocusEffect } from "@react-navigation/native";
import QuizItem from "../../components/QuizItem";
import { admobInterestial, baseUrl } from "../../constants/global";
import PastpapersQuizItem from "../../components/PastpapersQuizItem";
import { ScrollView } from "react-native-gesture-handler";
import { OptimizedFlatList } from "react-native-optimized-flatlist";



const Quiz = (props) => {
  const [mcqs, setMcqs] = useState([]);
  const [displayMcqs, setDisplayMcqs] = useState([]);

  const [timeStarted, setTimeStarted] = useState(Date.now());
  const [displayDetails, setDisplayDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [page, setPage] = useState(1);


  

  const [type, setType] = useState()
  const [p, setP] = useState()




  // const [totalMCQs, setTotalMCQs] = useState(10);
  //console.log("Total questions",props.route.params.totalQuestions)
  
  

  
  const renderQuizItem=useCallback(({item, index}) => (
    <QuizItem
       item={item}
       index={index}
       page={page}
       mainProps={props}
       //state_selectedOption={selectedOptions}
       questionAttemptedItem={(atempt_Item, atempt_Index, atempt_isCorrect)=>{
              //  console.log("Attempted: "+JSON.stringify(atempt_Item))
              //  console.log("Attempt Index: "+JSON.stringify(atempt_Index))
              //  console.log("Attempt Correct: "+JSON.stringify(atempt_isCorrect))
             setSelectedOptions({
                               ...selectedOptions,
                               [atempt_Item.questionid]: atempt_Index,
                              });
              if(atempt_isCorrect){
                 setTotalCorrect(totalCorrect + 1);
              }else{
                 setTotalWrong(totalWrong + 1);
              }                
                 setQuestionsAttempted(questionsAttempted + 1);
              }}
        subselectedItem={selectedOptions}      
    />
  ),[selectedOptions, page, displayMcqs]);



  
  const renderPast=(({item, index}) => (
 
    <PastpapersQuizItem
       item={item}
       index={index}
       page={page}
       mainProps={props}
       //state_selectedOption={selectedOptions}
       questionAttemptedItem={(atempt_Item, atempt_Index, atempt_isCorrect)=>{
              //  console.log("Attempted: "+JSON.stringify(atempt_Item))
              //  console.log("Attempt Index: "+JSON.stringify(atempt_Index))
              //  console.log("Attempt Correct: "+JSON.stringify(atempt_isCorrect))
             setSelectedOptions({
                               ...selectedOptions,
                               [atempt_Item.questionid]: atempt_Index,
                              });
              if(atempt_isCorrect){
                 setTotalCorrect(totalCorrect + 1);
              }else{
                 setTotalWrong(totalWrong + 1);
              }                
                 setQuestionsAttempted(questionsAttempted + 1);
              }}
        subselectedItem={selectedOptions}      
    >
      {console.log("Render "+JSON.stringify(item))}
      </PastpapersQuizItem>
  ));



  

  useEffect(()=>{
    if(isClosed)
      updatePage()
     
  },[isClosed])



  useEffect(() => {
    if(page%4==0 && !isLoaded){
       load()
    }
  }, [page]);

  
  
  useEffect(() => {
   if (props.route.params.subjectName === "PPSC" ||
    props.route.params.subjectName === "FPSC"){
      getpastMCQs(page)
    }else{
      getMCQs(page);
    }
  }, [page]);

  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });
  
  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setTotalCorrect(0);
      setTotalWrong(0);
      setSelectedOptions([]);
      setQuestionsAttempted(0);
      setTimeStarted(Date.now());
      // setTotalMCQs(10);
    }, [])
  );


  const getpastMCQs = async (page) => {
    setLoading(true)
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    console.log("totalQuestions "+(props.route.params.totalQuestions))
    console.log("number of quizes "+(page * props.route.params.showQuestions))
    console.log("questionslimit "+(props.route.params.showQuestions))
   
    // subjectid: props.route.params.id,
    // chapterid: "full",
    // offset: (props.page - 1) * 10,
    // userid: props.auth.user.id,
    // userid: 2,
    // sessionid: Math.trunc(Date.now() / 1000),


    let data = {
      subjectid: props.route.params.subjectid,
      chapterid: props.route.params.chapterid,
      userid: props.auth.user.id,
      questionslimit: props.route.params.totalQuestions,
      sessionid: Math.trunc(Date.now() / 1000),
      offset: (page-1) * props.route.params.showQuestions,
    };
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, data[key]);
    }
    fetch(`${baseUrl}/api/quiz/getquiz`, {
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
        if (data?.status === "success") {
          if (data.data) {
            setMcqs([...mcqs, ...data.data]);

            setDisplayMcqs(data.data);
             console.log("quizes "+JSON.stringify(data.data.length))
   
          }
          setLoading(false);
          setRefreshing(false);
          setLoadingData(false);
        } else if (data.message === "Token has expired") {
          Alert.alert("Session Token Expired", "Kindly login again!", [
            {
              text: "Ok",
              onPress: () => {
               // props.navigation.navigate("SignIn");
                props.logout();
              },
            },
          ]);
        } else {
          Alert.alert("Check your internet connection and try again!", [
            {
              text: "Ok",
              onPress: () => {
               // props.navigation.navigate("SignIn");
                props.logout();
              },
            },
          ]);
        }
      })
      .catch((e) => {
        Alert.alert("Session Token Expired", "Kindly login again!", [
          { text: "Try Again", onPress: () => getMCQs() },
        ]);
      });
  };



  const getMCQs = async (page) => {
    setLoading(true)
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    console.log("totalQuestions "+(props.route.params.totalQuestions))
    console.log("number of quizes "+(page * props.route.params.showQuestions))
    console.log("questionslimit "+(props.route.params.showQuestions))
   
    let data = {
      subjectid: props.route.params.subjectid,
      chapterid: props.route.params.chapterid,
      userid: props.auth.user.id,
      questionslimit: props.route.params.showQuestions,
      sessionid: Math.trunc(Date.now() / 1000),
      offset: (page-1) * props.route.params.showQuestions,
    };
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, data[key]);
    }
    fetch(`${baseUrl}/api/quiz/getquiz`, {
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
        if (data?.status === "success") {
          if (data.data) {
            setMcqs([...mcqs, ...data.data]);
            setDisplayMcqs(data.data);
            console.log("quizes "+JSON.stringify(data.data))
   
          }
          setLoading(false);
          setRefreshing(false);
          setLoadingData(false);
        } else if (data.message === "Token has expired") {
          Alert.alert("Session Token Expired", "Kindly login again!", [
            {
              text: "Ok",
              onPress: () => {
               // props.navigation.navigate("SignIn");
                props.logout();
              },
            },
          ]);
        } else {
          Alert.alert("Check your internet connection and try again!", [
            {
              text: "Ok",
              onPress: () => {
               // props.navigation.navigate("SignIn");
                props.logout();
              },
            },
          ]);
        }
      })
      .catch((e) => {
        Alert.alert("Session Token Expired", "Kindly login again!", [
          { text: "Try Again", onPress: () => getMCQs() },
        ]);
      });
  };


  
  const preupdatePage=async(type, p)=>{
    setType(type)
    setP(p)
    if(page%4==0 && isLoaded){
      show()
    }else{
      updatePageSkipAd(type, p)
    }


}



const updatePageSkipAd = (type, p) => {
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
  } else if (type === "dec") {
    if (page > 1) {
      setPage(page - 1);
      setDisplayMcqs(mcqs.slice((page - 1) * 10, page * 10));
      // setLoadingData(true);
    }
  } else {
    setPage(p);
    setLoadingData(true);
    getMCQs(p);
  }
};


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
    } else if (type === "dec") {
      if (page > 1) {
        setPage(page - 1);
        setDisplayMcqs(mcqs.slice((page - 1) * 10, page * 10));
        // setLoadingData(true);
      }
    } else {
      setPage(p);
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
        paddingHorizontal: 30,
        paddingTop: 10,
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() => props.navigation.goBack()}
        >
          {/* <Feather name="arrow-left" size={24} color="black" /> */}
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            color: "black",
            fontWeight: "500",
            marginVertical: 10,
            fontFamily: "Rubik_400Regular",
          }}
          selectable={false}
        >
          Quiz
        </Text>
      </View>
      <Text
        style={{
          fontSize: 20,
          color: "black",
          fontWeight: "400",
          marginTop: 10,
          fontFamily: "Rubik_400Regular",
        }}
        selectable={false}
      >
        {props.route.params.chapterDescription}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#181818",
          fontWeight: "400",
          marginVertical: 10,
          fontFamily: "Rubik_400Regular",
        }}
        selectable={false}
      >
        {props.route.params.subjectName} / {props.route.params.chapterName}
      </Text>
      {mcqs.length === 0 ? (
        <Text
          style={{
            color: "rgba(139, 139, 139, 1)",
            textAlign: "center",
            marginTop: 140,
            fontSize: 16,
            fontFamily: "Rubik_400Regular",
            fontWeight: "400",
          }}
        >
          Coming Soon
        </Text>
      ) : (
        <>
          <View style={{ marginVertical: 10 }}>
            <ProgressBar
              progress={Number(questionsAttempted / Number(mcqs.length))}
            />
          </View>
          <>
            {loadingData ? (
              <Loading />
            ) : (
              // <ScrollView>
              //   {displayMcqs.map(({item, index})=>{
              //     return(
              //       <View>
              //          {renderPast(item.item, index)}
              //       </View>
              //     )
              //   })}
              // </ScrollView>

              <OptimizedFlatList
                data={displayMcqs}
                numColumns={1}
                contentContainerStyle={{ paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
      
                windowSize={10}
                initialNumToRender={10}
                
                ListFooterComponent={
                  (mcqs.length !== 0 &&
                    props.route.params.subjectName === "PPSC") ||
                  props.route.params.subjectName === "FPSC" ? (
                    <View>
                     
                      <TouchableOpacity
                        style={{
                          paddingVertical: 15,
                          paddingHorizontal: 25,
                          backgroundColor: props.auth.themeMainColor,
                          borderRadius: 22,
                          marginBottom: 5,
                          marginHorizontal: 50,
                        }}
                        onPress={() => {
                          if (totalCorrect === 0 && totalWrong === 0) {
                            Alert.alert(
                              "Kindly Attempt At Least One Question!",
                              "",
                              [{ text: "Ok" }]
                            );
                          } else {
                            let timeTaken = Date.now() - timeStarted;
                            props.navigation.navigate("QuizResult", {
                              timeTaken,
                              totalCorrect: totalCorrect,
                              totalWrong: totalWrong,
                              subjectid: props.route.params.subjectid,
                              subjectName: props.route.params.subjectName,
                              chapterid: props.route.params.chapterid,
                              chapterName: props.route.params.chapterName,
                              chapterDescription:
                                props.route.params.chapterDescription,
                              totalQuestions: mcqs.length,
                            });
                          }
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 15,
                            fontWeight: "600",
                            textAlign: "center",
                          }}
                        >
                          View Result
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null
                }
                // onRefresh={() => {
                //   setRefreshing(true);
                //   getMCQs();
                //   setQuestionsAttempted(0);
                //   setSelectedOptions({});
                //   setPage(1);
                // }}
               // refreshing={refreshing}
                renderItem={renderQuizItem}
              />
             )}
            </> 
          </>
      )}

{mcqs.length !== 0 &&
        props.route.params.subjectName !== "PPSC" &&
        props.route.params.subjectName !== "FPSC" && (
          <Pagination
            {...props}
            timeStarted={timeStarted}
            for="quiz"
            totalCorrect={totalCorrect}
            totalWrong={totalWrong}
            updatePage={preupdatePage}
            page={page}
            // totalQuestions={totalMCQs}
            setPage={setPage}
          />
        )}
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Quiz);
