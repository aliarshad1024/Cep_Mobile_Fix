import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";

// const testTypesArray = ["Chapters", "Review MCQs", "Attempt MCQs"];

const ChapterItem = ({
  mainProps,
  item,
  openOptions,
  index,
  openOPtionCallback,
  quizClicked,
  mcqsClicked,
  testType,
  ReviewAllMCQs,
  setTestType, // <- receive it here
}) => {
  const [subject, setSubject] = useState(mainProps.route.params.subject);
  // const [testType, setTestType] = useState(
  //   mainProps.route.params.testType ? mainProps.route.params.testType : "Chapters"
  // );
  // const testTypesArray = ["Chapters", "Review MCQs", "Attempt MCQs"];
  // const testTypesArray = ["Chapters", "Review MCQs", "Attempt MCQs"];
  const testTypesArray = ["One Liner"];

  const [page, setPage] = useState(1);
  const [timeStarted, setTimeStarted] = useState(null);

  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);

  var interestial_loaded = false;
  var interestial_shown = false;

  const [type, setType] = useState();
  const [p, setP] = useState();

  return (
    <TouchableOpacity
      style={styles.mainContainer}
      onPress={() => {
        if (openOptions === "0" || openOptions !== item.id) {
          openOPtionCallback(item.id);
        } else {
          openOPtionCallback("0");
        }
      }}
      key={index}
    >
      <View style={styles.horizontalStyler}>
        <Text
          style={[
            styles.nameTextStyler,
            { color: mainProps.auth.themeMainColor },
          ]}
          selectable={false}
        >
          {item.name}
        </Text>
        <View style={styles.rightMargin}>
          <Feather
            name={openOptions !== item.id ? "chevron-down" : "chevron-up"}
            size={24}
            color="rgba(142, 142, 142, 1)"
          />
        </View>
      </View>

      <Text style={styles.secondaryTextStyler} selectable={false}>
        {item.description}
      </Text>

      {item.id === openOptions && (
        <View style={{ marginTop: 10 }}>
          {/* All Buttons in One Row */}
          <View
            style={{
              flexDirection: "row",
              // justifyContent: "space-evenly",
              gap: 10,
            }}
          >
            {/* MCQs Button */}
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => mcqsClicked(item, index)}
            >
              <View
                style={[
                  styles.secondaryViewButtons,
                  { backgroundColor: mainProps.auth.themeMainColor },
                ]}
              >
                <Text style={styles.buttonTxt} selectable={false}>
                  MCQs
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => ReviewAllMCQs(item, index)}
            >
              <View
                style={[
                  styles.secondaryViewButtons,
                  { backgroundColor: mainProps.auth.themeMainColor },
                ]}
              >
                <Text style={styles.buttonTxt} selectable={false}>
                  One Liner
                </Text>
              </View>
            </TouchableOpacity>

            {/* Review MCQs Button */}
            {/* {testTypesArray.map((itemType, i) => (
              <TouchableOpacity
                key={`type-${i}`}
                style={{ flex: 1 }}
                onPress={() => setTestType(itemType)}
              >
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: 8,
                    borderWidth: 1.5,
                    borderColor: mainProps.auth.themeMainColor,
                    backgroundColor: mainProps.auth.themeMainColor,
                    borderRadius: 100,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 12,
                      fontWeight: "600",
                      fontFamily: "Rubik_400Regular",
                    }}
                    selectable={false}
                  >
                    {itemType}
                  </Text>
                </View>
              </TouchableOpacity>
            ))} */}

            {/* Quiz Button */}
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => quizClicked(item, index)}
            >
              <View
                style={[
                  styles.secondaryViewButtons,
                  { backgroundColor: mainProps.auth.themeMainColor },
                ]}
              >
                <Text style={styles.buttonTxt} selectable={false}>
                  Quiz
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 24,
    background: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderStyle: "solid",
    borderRadius: 8,
    marginVertical: 5,
  },
  horizontalStyler: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameTextStyler: {
    fontSize: 18,
    // color: props.auth.themeMainColor,
    fontWeight: "500",
    fontFamily: "Rubik_400Regular",
  },
  rightMargin: {
    marginRight: 20,
  },
  secondaryTextStyler: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Rubik_400Regular",
  },
  secondayViewStyler: {
    flexDirection: "row",
    marginTop: 25,
    marginBottom: 5,
  },
  secondaryViewButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 100,
    // marginRight: 5,
    // backgroundColor: props.auth.themeMainColor,
  },
  buttonTxt: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Rubik_400Regular",
  },
});

export default ChapterItem;
