import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import ProgressBar from "../../components/ProgressBar";
import url from "../../utils/URL";
import Loading from "../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { logout } from "../../redux/actions/authActions";
import { useFocusEffect } from "@react-navigation/native";
import { baseUrl } from "../../constants/global";

const CustomizeQuizQuestions = (props) => {
  const [subject, setSubject] = useState(props.route.params.subject);
  // const [totalMCQs, setTotalMcqs] = useState([]);
  const [mcqs, setMcqs] = useState([]);
  const [displayDetails, setDisplayDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [timeStarted, setTimeStarted] = useState(Date.now());
  const [page, setPage] = useState(1);
  const [details, setDetails] = useState("");
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setTotalCorrect(0);
      setTotalWrong(0);
      setSelectedOptions([]);
      setQuestionsAttempted(0);
      setTimeStarted(Date.now());
    }, [])
  );
  useEffect(() => {
    getCustomizeQuiz();
  }, []);

  const getCustomizeQuiz = async () => {
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    let data = {};
    let subjects = [];
    if (!props.route.params.quizid) {
      props.route.params.customizeQuiz.forEach((q) => {
        subjects.push({
          subjectid: q.subjectid,
          mcq: Number(q.mcqs),
        });
      });
    }
    props.route.params.quizid
      ? (data = {
          quizid: props.route.params.quizid,
          userid: props.auth.user.id,
        })
      : (data = {
          startquiz: 1,
          userid: props.auth.user.id,
          subjects: JSON.stringify(subjects),
        });
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, data[key]);
    }
    fetch(`${baseUrl}/api/quiz/getcustomizedquiz`, {
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
            // setTotalMcqs(data.data.length);
            // let m = data.data[0].slice(0, 10);
            setMcqs(data.data);
            setLoading(false);
            setRefreshing(false);
          } else {
            setLoading(false);
            setRefreshing(false);
          }
        } else if (data.messsage === "Quiz questions not found") {
          setMcqs([]);
          setLoading(false);
          setRefreshing(false);
        } else {
          Alert.alert("Check your internet connection and try again!", "", [
            { text: "Try Again", onPress: () => getCustomizeQuiz() },
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
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View
      style={{
        padding: 20,
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
        <Text style={{ textAlign: "center", marginRight: 20, fontSize: 18 }}>
          Customize Quiz
        </Text>
      </View>
      <Text
        style={{
          fontSize: 20,
          color: "black",
          fontWeight: 400,
          margin: 10,
          fontFamily: "Rubik_400Regular",
        }}
        selectable={false}
      >
        {props.route.params.quizName}
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
          <View style={{ marginVertical: 10 }}>
            <ProgressBar progress={Number(questionsAttempted / mcqs.length)} />
          </View>
          <FlatList
            data={mcqs}
            numColumns={1}
            contentContainerStyle={{ paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View
                style={{
                  padding: 10,
                }}
                key={index}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}
                  selectable={false}
                >
                  <Text
                    style={{ color: props.auth.themeMainColor, fontSize: 20 }}
                  >
                    Q.{index + 1}
                  </Text>{" "}
                  /{mcqs.length}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    marginBottom: 10,
                    fontWeight: "bold",
                  }}
                  selectable={false}
                >
                  {item.question}
                </Text>
                 
                {item.options.map((option, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedOptions({
                          ...selectedOptions,
                          [item.questionid]: index,
                        });
                        if (option === item.correct) {
                          setTotalCorrect(totalCorrect + 1);
                        } else {
                          setTotalWrong(totalWrong + 1);
                        }
                        setQuestionsAttempted(questionsAttempted + 1);
                      }}
                      disabled={selectedOptions[item.questionid] !== undefined}
                      key={index}
                    >
                      <View
                        style={{
                          backgroundColor:
                            selectedOptions[item.questionid] == index &&
                            option === item.correct
                              ? "#00CA2E"
                              : selectedOptions[item.questionid] == index &&
                                option !== item.correct
                              ? "red"
                              : "#F4F4F4",

                          flexDirection: "row",
                          paddingVertical: 15,
                          paddingHorizontal: 20,
                          marginVertical: 6,
                          borderRadius: 100,
                          alignItems: "flex-start",
                        }}
                        selectable={false}
                      >
                        <Text
                          style={{
                            width: 20,
                            color:
                              selectedOptions[item.questionid] == index
                                ? "white"
                                : "black",
                            fontSize: 14,
                            fontFamily: "Rubik_400Regular",
                          }}
                        >
                          {index === 0
                            ? "A"
                            : index === 1
                            ? "B"
                            : index === 2
                            ? "C"
                            : "D"}
                          .
                        </Text>
                        <Text
                          style={{
                            flex: 1,
                            flexWrap: "wrap",
                            color:
                              selectedOptions[item.questionid] == index
                                ? "white"
                                : "black",
                            fontSize: 15,
                            fontFamily: "Rubik_400Regular",
                          }}
                        >
                          {option}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            ListFooterComponent={
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
                    Alert.alert("Kindly Attempt At Least One Question!", "", [
                      { text: "Ok" },
                    ]);
                  } else {
                    let timeTaken = Date.now() - timeStarted;
                    props.navigation.navigate("QuizResult", {
                      timeTaken,
                      totalCorrect: totalCorrect,
                      totalWrong: totalWrong,
                      quizid: props.route.params.quizid,
                      customizeQuiz: props.route.params.customizeQuiz,
                      quizname: props.route.params.quizName,
                      chapterName: props.route.params.quizName,
                      totalQuestions: mcqs.length,
                    });
                  }
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  View Result
                </Text>
              </TouchableOpacity>
            }
          />
        </>
      )}
      {/* {mcqs.length !== 0 && (
        <ViewResultPagination
          {...props}
          timeStarted={timeStarted}
          totalCorrect={totalCorrect}
          totalWrong={totalWrong}
          totalQuestions={mcqs.length}
        />
      )} */}
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(CustomizeQuizQuestions);
