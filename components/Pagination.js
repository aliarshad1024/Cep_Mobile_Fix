import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { Entypo, EvilIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
const Pagination = (props) => {
  const [page, setPage] = useState(props.page);
  const totalPages = props.totalPages
    ? props.totalPages
    : Math.ceil(props.route.params.totalQuestions / 10);
  useEffect(() => {
    setPage(props.page);
  }, [props.page]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "white",
        position: "absolute",
        borderColor: "#e6e6e6",
        height: 90,
        borderWidth: 1,
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        paddingVertical: 5,
        alignContent: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={{ marginLeft: 15 }}
          onPress={() => props.updatePage("dec")}
          disabled={page < 1}
        >
          <EvilIcons
            name="arrow-left"
            size={33}
            style={{
              color:
                page > 1 ? props.auth.themeMainColor : "rgba(163, 163, 163, 1)",
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 16,
            color: "rgba(163, 163, 163, 1)",
            marginLeft: 15,
          }}
        >
          Page
        </Text>

        <TextInput
          style={{
            borderWidth: 0.5,
            borderColor: "#DADADA",
            borderRadius: 1.5,
            paddingHorizontal: 25,
            marginLeft: 10,
            color: "black",
            fontSize: 16,
          }}
          value={page.toString()}
          keyboardType="numeric"
          onSubmitEditing={() => {
            // update state with entered page number
            if (page !== 0 && page < totalPages + 1) {
              props.updatePage("", page);
            }
          }}
          onChangeText={(t) => {
            if (t < totalPages + 1) {
              setPage(Number(t));
            }
          }}
        />

        <Text style={{ fontWeight: "400", fontSize: 16, marginLeft: 5 }}>
          /{totalPages}
        </Text>
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => props.updatePage("inc")}
          disabled={page >= props.route.params.totalQuestions / 10}
        >
          <EvilIcons
            name="arrow-right"
            size={33}
            style={{
              color:
                page < props.route.params.totalQuestions / 10
                  ? props.auth.themeMainColor
                  : "rgba(163, 163, 163, 1)",
            }}
          />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          style={{
            paddingVertical: 13,
            paddingHorizontal: 20,
            backgroundColor:
              props.for === "quiz"
                ? props.auth.themeSecondaryColor
                : props.auth.themeMainColor,
            borderRadius: 22,
            marginLeft: 10,
            marginBottom: 5,
            marginRight: 5,
          }}
          onPress={() => {
            if (props.all) {
              if (props.for !== "quiz") {
                props.setTestType("Attempt MCQs");
              } else if (props.totalCorrect === 0 && props.totalWrong === 0) {
                Alert.alert("Kindly Attempt At Least One Question!", "", [
                  { text: "Ok" },
                ]);
              } else {
                if (props.for === "quiz") {
                  let timeTaken = Date.now() - props.timeStarted;
                  console.log(props.route.params);

                  props.navigation.navigate("QuizResult", {
                    timeTaken,
                    totalCorrect: props.totalCorrect,
                    totalWrong: props.totalWrong,
                    page: props.page,
                    subjectid: props.route.params.id,
                    subjectName: props.subject
                      ? props.subject
                      : props.subjectName,
                    chapterid: "all",
                    chapterName: props.route.params.chapterName,
                    totalQuestions: props.route.params.totalQuestions,
                  });
                }
              }
            } else {
              if (props.for === "quiz") {
                if (props.totalCorrect === 0 && props.totalWrong === 0) {
                  Alert.alert("Kindly Attempt At Least One Question!", "", [
                    { text: "Ok" },
                  ]);
                } else {
                  let timeTaken = Date.now() - props.timeStarted;
                  props.navigation.navigate("QuizResult", {
                    timeTaken,
                    totalCorrect: props.totalCorrect,
                    totalWrong: props.totalWrong,
                    page: props.page,
                    subjectid: props.route.params.subjectid,
                    subjectName: props.route.params.subjectName,
                    chapterid: props.route.params.chapterid,
                    chapterName: props.route.params.chapterName,
                    chapterDescription: props.route.params.chapterDescription,

                    totalQuestions: props.totalQuestions
                      ? props.totalQuestions
                      : props.route.params.totalQuestions,
                    nextChapterShowQuestions:
                      props.route.params.nextChapterShowQuestions,
                    nextChapterId: props.route.params.nextChapterId,
                    nextChapterName: props.route.params.nextChapterName,
                    nextChapterDescription:
                      props.route.params.nextChapterDescription,
                    nextChapterTotalQuestions:
                      props.route.params.nextChapterTotalQuestions,
                  });
                }
              } else {
                props.navigation.navigate("Quiz", {
                  subjectid: props.subjectid,
                  subjectName: props.chapterName, // Don't change
                  chapterid: props.chapterid,
                  chapterName: props.subjectName, // Don't change
                  chapterDescription: props.chapterDescription,
                  totalQuestions: props.route.params.totalQuestions,
                  showQuestions: props.route.params.showQuestions,
                  nextChapterShowQuestions:
                    props.route.params.nextChapterShowQuestions,
                  nextChapterId: props.route.params?.nextChapterId,
                  nextChapterName: props.route.params?.nextChapterName,
                  nextChapterDescription:
                    props.route.params?.nextChapterDescription,
                  nextChapterTotalQuestions:
                    props.route.params.nextChapterTotalQuestions,
                });
              }
            }
          }}
        >
          <Text style={{ color: "white", fontSize: 12, fontWeight: 600 }}>
            {props.for === "quiz" ? "View Result" : "Go to Quiz"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Pagination);
