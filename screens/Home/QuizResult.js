import { Image, ScrollView, View, TouchableOpacity, Text } from "react-native";
import React from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import { connect } from "react-redux";
const QuizResult = (props) => {
  const totalCorrect = props.route.params.totalCorrect;
  const totalWrong = props.route.params.totalWrong;
  const t = props.route.params.timeTaken / 60000;
  const minutes = Math.trunc(t);
  const seconds = Math.trunc((t - Math.floor(t)) * 100);
  const aT = t / (totalCorrect + totalWrong);
  const averageTimeMinutes = Math.trunc(aT);
  const averageTimeSeconds = Math.trunc((aT - Math.floor(aT)) * 100);
  const totalQuestions = props.route.params.totalQuestions
    ? props.route.params.totalQuestions
    : props.route.params.page * 10;
  const percentage = ((totalCorrect * 100) / totalQuestions).toFixed(2);
  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });

  return (
    <ScrollView style={{ backgroundColor: "#FFF", padding: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop:30
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 20,
              fontSize: 18,
              fontWeight: "500",
              fontFamily: "Rubik_400Regular",
            }}
          >
            Quiz Results
          </Text>
        </View>
        {/* <View>
          <Image
            source={require("../../assets/icons/bell.png")}
            style={{ width: 20, height: 20 }}
          />
        </View> */}
      </View>

      <View
        style={{
          backgroundColor: "#F5F5F5",
          borderRadius: 8,
          shadowColor: "rgba(0, 0, 0, 0.12)",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 1,
          shadowRadius: 12,
          elevation: 12,
          padding: 15,
          marginVertical: 15,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            marginBottom: 10,
            fontFamily: "Rubik_400Regular",
          }}
        >
          {props.route.params.subjectName
            ? props.route.params.subjectName
            : "Customize Quiz"}
        </Text>
        <Text
          style={{
            color: "#181818",
            fontSize: 13,
            fontFamily: "Rubik_400Regular",
          }}
        >
          {props.route.params.chapterName}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#F5F5F5",
          borderRadius: 8,
          shadowColor: "rgba(0, 0, 0, 0.12)",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 1,
          shadowRadius: 12,
          elevation: 12,
          padding: 15,
          marginVertical: 15,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            borderWidth: 4.75,
            borderColor: props.auth.themeMainColor,
            overflow: "hidden",
            borderRadius: 140,
          }}
        >
          <View
            style={{
              backgroundColor: "#181818",
              borderRadius: 140,
              paddingHorizontal: 20,
              paddingVertical: 25,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 27,
                  color: "#F2F2F2",
                  fontFamily: "Rubik_400Regular",
                }}
              >
                {props.route.params.totalCorrect}
              </Text>
              <Text style={{ fontSize: 18, color: "#F2F2F2" }}>/</Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#F2F2F2",
                  fontFamily: "Rubik_400Regular",
                }}
              >
                {totalQuestions}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 12,
                color: "#F2F2F2",
                fontFamily: "Rubik_400Regular",
              }}
            >
              Your Score
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: "black",
            fontSize: 16,
            fontWeight: "700",
            width: "50%",
            textAlignVertical: "center",
            fontFamily: "Rubik_400Regular",
          }}
        >
          {percentage > 49 ? `Congratulations! You have ` : `Sorry you have `}
          {percentage > 49 ? (
            <Text style={{ color: "#6FCF97", fontFamily: "Rubik_400Regular" }}>
              passed
            </Text>
          ) : (
            <Text style={{ color: "red", fontFamily: "Rubik_400Regular" }}>
              failed
            </Text>
          )}
          {` this test with `}
          <Text style={{ color: "#0E81B4", fontFamily: "Rubik_400Regular" }}>
            {percentage}
            %.
          </Text>
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0, 202, 46, 1)",
            borderRadius: 8,
            shadowColor: "rgba(0, 0, 0, 0.12)",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 1,
            shadowRadius: 12,
            elevation: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            width: "45%",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#FFF",
              fontFamily: "Rubik_400Regular",
            }}
          >
            {props.route.params.totalCorrect}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#FFF",
              fontFamily: "Rubik_400Regular",
            }}
          >
            Correct Answers
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "rgba(255, 0, 0, 1)",
            borderRadius: 8,
            shadowColor: "rgba(0, 0, 0, 0.12)",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 1,
            shadowRadius: 12,
            elevation: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            width: "45%",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#FFF",
              fontFamily: "Rubik_400Regular",
            }}
          >
            {props.route.params.totalWrong}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#FFF",
              fontFamily: "Rubik_400Regular",
            }}
          >
            Wrong Answers
          </Text>
          {/* <Image
          style={[styles.component1Icon, styles.iconLayout]}
          resizeMode="cover"
          source={require("../assets/component-11.png")}
        /> */}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#0E81B4",
            borderRadius: 8,
            shadowColor: "rgba(0, 0, 0, 0.12)",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 1,
            shadowRadius: 12,
            elevation: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            width: "45%",
          }}
        >
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../../assets/icons/clock.png")}
          />

          <Text
            style={{
              fontSize: 20,
              color: "#FFF",
              fontFamily: "Rubik_400Regular",
            }}
          >
            {minutes}m {seconds}sec
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#FFF",
              fontFamily: "Rubik_400Regular",
            }}
          >
            Time Taken
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#FF8F0F",
            borderRadius: 8,
            shadowColor: "rgba(0, 0, 0, 0.12)",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 1,
            shadowRadius: 12,
            elevation: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            width: "45%",
          }}
        >
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../../assets/icons/clock.png")}
          />

          <Text
            style={{
              fontSize: 20,
              color: "#FFF",
              fontFamily: "Rubik_400Regular",
            }}
          >
            {averageTimeMinutes}m {averageTimeSeconds}sec
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#FFF",
              fontFamily: "Rubik_400Regular",
            }}
          >
            Avg. Time / Answer
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#0E81B4",
          borderRadius: 140,
          paddingVertical: 14,
          paddingHorizontal: 21,
          shadowColor: "rgba(0, 0, 0, 0.12)",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 1,
          shadowRadius: 12,
          elevation: 12,
          marginBottom: 20,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          if (props.route.params.chapterid === "all") {
            props.navigation.navigate("SubjectSelected", {
              subject: props.route.params.subjectName,
              id: props.route.params.subjectid,
              totalQuestions: props.route.params.totalQuestions,
              testType: "Attempt MCQs",
            });
          } else if (props.route.params.quizid) {
            props.navigation.navigate("CustomizeQuizQuestions", {
              quizid: props.route.params.quizid,
              quizName: props.route.params.quizname,
            });
          } else if (props.route.params.customizeQuiz) {
            props.navigation.navigate("CustomizeQuizQuestions", {
              customizeQuiz: props.route.params.customizeQuiz,
              quizName: props.route.params.quizname,
            });
          } else {
            console.log("TOTAL QUESTIONS IN QUIZ RESULT",props.route.params)
            props.navigation.navigate("Quiz", {
              subjectid: props.route.params.subjectid,
              subjectName: props.route.params.subjectName,
              chapterid: props.route.params.chapterid,
              chapterName: props.route.params.chapterName,
              totalQuestions: props.route.params.totalQuestions,
              showQuestions: props.route.params.totalQuestions,
              chapterDescription: props.route.params.chapterDescription,
            });
          }
        }}
      >
        {/* <Image
            style={[styles.vectorIcon, styles.vectorIconLayout]}
            resizeMode="cover"
            source={require("../assets/vector.png")}
          /> */}
        <Ionicons name="reload-sharp" size={24} color="white" />
        <Text
          style={{
            fontSize: 16,
            color: "#F2F2F2",
            fontWeight: "700",
            textAlign: "center",
            marginLeft: 15,
            fontFamily: "Rubik_400Regular",
          }}
        >
          Try Quiz Again
        </Text>
      </TouchableOpacity>
      {props.route.params.nextChapterId && (
        <TouchableOpacity
          style={{
            backgroundColor: props.auth.themeMainColor,
            borderRadius: 100,
            paddingVertical: 18,
            paddingHorizontal: 21,
            shadowColor: "rgba(0, 0, 0, 0.12)",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 1,
            shadowRadius: 12,
            elevation: 12,
            marginTop: 10,
          }}
          onPress={() => {
            console.log("TRY AGAIN", props.route.params);
            props.navigation.navigate("Quiz", {
              subjectid: props.route.params.subjectid,
              subjectName: props.route.params.subjectName,
              chapterid: props.route.params.nextChapterId,
              chapterName: props.route.params.nextChapterName,
              totalQuestions: props.route.params.totalQuestions,
              chapterDescription: props.route.params.nextChapterDescription,
              showQuestions: props.route.params.nextChapterShowQuestions,
              totalQuestions: props.route.params.nextChapterTotalQuestions,
            });
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#F2F2F2",
              fontWeight: "700",
              textAlign: "center",
              fontFamily: "Rubik_400Regular",
            }}
          >
            Next Chapter
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(QuizResult);
