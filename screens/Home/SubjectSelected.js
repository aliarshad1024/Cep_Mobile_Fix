import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
// import { Feather } from "@expo/vector-icons";
import Footer from "../../components/Footer";
import SelectChapter from "./SelectChapter";
import AttemptAllMCQs from "./AttemptAllMCQs";
import ReviewAllMCQs from "./ReviewAllMCQs";
import Pagination from "../../components/Pagination";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import { useFocusEffect } from "@react-navigation/native";
import { connect } from "react-redux";
import { baseUrl } from "../../constants/global";

const SubjectSelected = (props) => {
  const [subject, setSubject] = useState(props.route.params.subject);
  const [testType, setTestType] = useState(
    props.route.params.testType ? props.route.params.testType : "Chapters"
  );
  const testTypesArray = ["Chapters", "Review MCQs", "Attempt MCQs"];
  const [page, setPage] = useState(1);
  const [timeStarted, setTimeStarted] = useState(null);

  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);

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
      setTimeStarted(null);
    }, [])
  );

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
            {/* <Feather name="arrow-left" size={24} color="black" /> */}
          </TouchableOpacity>
          <Text
            style={{
              textAlign: "center",
              marginRight: 20,
              fontSize: 18,
              fontWeight: "500", // ✅ Correct: Use string values
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
          {testTypesArray.map((item, index) => (
            <TouchableOpacity
              style={{
                flex: 1,
              }}
              onPress={() => {
                setPage(1);
                setTestType(item);
              }}
              key={`type-${index}`}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: 8,
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
                    fontWeight: "600", // ✅ Correct: Use string values
                    fontFamily: "Rubik_400Regular",
                  }}
                  selectable={false}
                >
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {testType === "Chapters" ? (
        <SelectChapter {...props} />
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
          updatePage={(type, p) => {
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
          }}
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
