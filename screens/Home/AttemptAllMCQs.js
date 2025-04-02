import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import ProgressBar from "../../components/ProgressBar";
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";
import Pagination from "../../components/Pagination";
import url from "../../utils/URL";
import Loading from "../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { logout } from "../../redux/actions/authActions";
// import { Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import QuizItem from "../../components/QuizItem";
import { baseUrl } from "../../constants/global";

const AttemptAllMCQs = (props) => {
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [displayMcqs, setDisplayMcqs] = useState(1);


  // {console.log()}

  
  const renderQuizItem=useCallback(({item, index}) => (
    <QuizItem
       item={item}
       index={index}
       page={props.page}
       mainProps={props}
       //state_selectedOption={selectedOptions}
       questionAttemptedItem={(atempt_Item, atempt_Index, atempt_isCorrect)=>{
              props.setSelectedOptions({
                               ...props.selectedOptions,
                               [atempt_Item.questionid]: atempt_Index,
                              });
              if(atempt_isCorrect){
                 props.setTotalCorrect(props.totalCorrect + 1);
              }else{
                 props.setTotalWrong(props.totalWrong + 1);
              }                
                 props.setQuestionsAttempted(props.questionsAttempted + 1);
              }}
        subselectedItem={props.selectedOptions}      
    />
  ),[props.selectedOptions, props.page]);







  useEffect(() => {
    getAllMCQs(1);
  }, [props.page]);
  useEffect(() => {
    props.setTimeStarted(Date.now())
  }, []);
  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });
  // const updatePage = (type) => {
  //   if (type === "inc") {
  //     setPage(page + 1);
  //     const mcqs = mcqs.slice(page * 10, page + 1 * 10);
  //     setDisplayMcqs(mcqs);
  //   } else {
  //     setPage(page - 1);
  //     const mcqs = mcqs.slice((page - 1) * 10, page * 10);
  //     setDisplayMcqs(mcqs);
  //   }
  // };

  const getAllMCQs = async (page) => {
    setLoading(true);
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    let data = {
      subjectid: props.route.params.id,
      chapterid: "full",
      offset: (props.page - 1) * 10,
      userid: props.auth.user.id,
      userid: 2,
      sessionid: Math.trunc(Date.now() / 1000),
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
            setMcqs(data.data);
            const mcqs = data.data.slice((page - 1) * 10, page * 10);
            setDisplayMcqs(mcqs);
            setLoading(false);
            setRefreshing(false);
          } else {
            setLoading(false);
            setRefreshing(false);
          }
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
        }
      })
      .catch((e) => {
        Alert.alert("Check your internet connection and try again!", "", [
          {
            text: "Login Again",
            onPress: () => {
             // props.navigation.navigate("SignIn");
              props.logout();
            },
          },
          { text: "Try Again", onPress: () => getAllMCQs() },
        ]);
      });
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <View
      style={{
        backgroundColor: "white",
        height: "100%",
      }}
    >
      {props.route.params.subjectName && (
        <View style={{ flexDirection: "row", marginVertical: 20 }}>
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => props.navigation.goBack()}
          >
            {/* <Feather name="arrow-left" size={24} color="black" /> */}
          </TouchableOpacity>
          <Text
            style={{
              textAlign: "center",
              marginRight: 20,
              fontSize: 18,
              fontWeight: "500",
              fontFamily: "Rubik_400Regular",
            }}
            selectable={false}
          >
            {props.route.params.subjectName}
          </Text>
        </View>
      )}
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
              progress={Number(props.questionsAttempted / (props.page * 10))}
            />
          </View>

          <FlatList
            data={displayMcqs}
            numColumns={1}
            contentContainerStyle={{ paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
            // onRefresh={() => {
            //   setRefreshing(true);
            //   getAllMCQs();
            //   props.setQuestionsAttempted(0);
            //   props.setSelectedOptions({});
            // }}
            // refreshing={refreshing}
            renderItem={renderQuizItem}
          />
        </>
      )}
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(AttemptAllMCQs);
