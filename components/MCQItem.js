import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
// import { Feather } from "@expo/vector-icons";

const MCQItem = ({  item,  index, page, mainProps, showDetailModal, isReview }) => {

  
  return (
    <View
                  style={styles.mainContainer}
                  key={index}
                >
                  <Text
                    style={styles.totalQuestions}
                    selectable={false}
                  >
                    <Text
                      style={[styles.currentQuestion,{ color: mainProps.auth.themeMainColor,}]}
                    >
                      Q.{(page - 1) * 10 + (index + 1)}
                    </Text>{" "}
                    /{mainProps.route.params.totalQuestions}
                  </Text>
                  <Text
                    style={styles.questionStyler}
                    selectable={false}
                  >
                    {item.question}
                  </Text>
                 {isReview ===false &&
                 <View> 
                  <Text
                    style={item.wrongA===item.correct?[styles.correctAnswer,{color: mainProps.auth.themeMainColor}]:styles.wrongAnswer}
                    selectable={false}
                  >
                    A. {item.wrongA}
                  </Text>
                  <Text
                    style={item.wrongB===item.correct?[styles.correctAnswer,{color: mainProps.auth.themeMainColor}]:styles.wrongAnswer}
                    selectable={false}
                  >
                    B. {item.wrongB}
                  </Text>

                  <Text
                    style={item.wrongC===item.correct?[styles.correctAnswer,{color: mainProps.auth.themeMainColor}]:styles.wrongAnswer}
                    selectable={false}
                  >
                    C. {item.wrongC}
                  </Text>

                  <Text
                    style={item.wrongD===item.correct?[styles.correctAnswer,{color: mainProps.auth.themeMainColor}]:styles.wrongAnswer}
                    selectable={false}
                  >
                    D. {item.wrongD}
                  </Text>
                  </View>
                  }
                  {isReview ===true &&
                 <View> 
                  <Text
                    style={[styles.correctAnswer, {color: mainProps.auth.themeMainColor}]}
                    selectable={false}
                  >
                    Ans. {item.correct}
                  </Text>
                  </View>
                  }
                  <View
                    style={styles.detailContainer}
                  >
                    <TouchableOpacity
                      style={[styles.detailButton, {
                        backgroundColor: item.detail
                          ? "rgba(255, 143, 15, 1)"
                          : "lightgray",
                      }]}
                      onPress={() => {
                       // setDisplayDetails(true);
                       // setDetails(item.detail);

                       item.detail!=undefined && item.detailtype!=undefined && item.image!=undefined && showDetailModal(item.detail, item.detailtype, item.image)
                      }}
                      disabled={!item.detail}
                    >
                      <Text
                        style={styles.detailBtnText}
                        selectable={false}
                      >
                        Display Detail
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
  );
};


const styles= StyleSheet.create({
         mainContainer:{
          padding: 20,
          borderRadius: 8,
          background: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#EEEEEE",
          borderStyle: "solid",
          marginVertical: 5,
        },
         totalQuestions:{
          fontSize: 14,
          fontWeight: "500",
          marginBottom: 8,
          fontFamily: "Rubik_400Regular",
        },
         currentQuestion:{
          fontSize: 20,
          fontFamily: "Rubik_400Regular",
        },
        questionStyler:{
          fontSize: 16,
          fontWeight: "bold",
          marginBottom: 8,
          fontFamily: "Rubik_400Regular",
        },
        wrongAnswer:{
          color: "rgba(163, 163, 163, 1)",
          fontSize: 15,
          marginVertical: 4,
        },
        correctAnswer:{
          fontSize: 15,
          marginVertical: 4,
          fontFamily: "Rubik_400Regular",
        },
        detailContainer:{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 10,
           },
        detailButton:{
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 22,
        },
        detailBtnText:{      
          color: "white",
          fontSize: 12,
          fontFamily: "Rubik_400Regular",
        }
});

export default MCQItem;
