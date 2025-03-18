import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

const PastpapersQuizItem = ({  item,  index, page, mainProps, questionAttemptedItem, subselectedItem }) => {

                              

  return (
    <View
                    style={styles.mainContainer}
                    key={item.id}
                  >
                    <Text
                      style={styles.totalQuestions}
                      selectable={false}
                    >
                      <Text
                        style={[styles.currentQuestion,{
                          color: mainProps.auth.themeMainColor,
                        }]}
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
                    {item.options.map((option, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            // setSelectedOptions({
                            //   ...selectedOptions,
                            //   [item.questionid]: index,
                            // });
                            let isCorrect=false;
                            if (option === item.correct) {
                              //setTotalCorrect(totalCorrect + 1);
                                isCorrect=true
                            } else {
                                isCorrect=false 
                              //setTotalWrong(totalWrong + 1);
                            }
                            questionAttemptedItem(item, index, isCorrect)
                            // setQuestionsAttempted(questionsAttempted + 1);
                          }}
                          disabled={
                            subselectedItem[item.questionid] !== undefined
                          }
                          key={index}
                        >
                          <View
                            style={[{
                              backgroundColor:
                              subselectedItem[item.questionid] == index &&
                                option === item.correct
                                  ? "#00CA2E"
                                  : subselectedItem[item.questionid] == index &&
                                    option !== item.correct
                                  ? "red"
                                  : "#F4F4F4",

                              
                            },styles.answerStyler]}
                            selectable={false}
                          >
                            <Text
                              style={[{
                                color:
                                subselectedItem[item.questionid] == index
                                    ? "white"
                                    : "black",
                                
                              }, styles.answerText]}
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
                              style={[{
                                color:
                                 subselectedItem[item.questionid] == index
                                    ? "white"
                                    : "black",
                              
                               
                              },styles.answerTextSub]}
                            >
                              {option}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}

                    
                    

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        marginTop: 15,
                      }}
                    >
                      {/* <TouchableOpacity
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        backgroundColor: "rgba(255, 143, 15, 1)",
                        borderRadius: 22,
                      }}
                      onPress={() => setDisplayDetails(true)}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                          fontFamily: "Rubik_400Regular",
                        }}
                      >
                        Display Detail
                      </Text>
                    </TouchableOpacity> */}
                    </View>
                  </View>
  );
};


const styles= StyleSheet.create({
         mainContainer:{
          paddingHorizontal: 10,
        },
         totalQuestions:{
          fontSize: 14,
          fontWeight: 500,
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
          marginBottom: 10,
          fontFamily: "Rubik_400Regular",
        },
        answerStyler:{
        flexDirection: "row",
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 6,
        borderRadius: 80,
        alignItems: "flex-start",
       } ,
        answerText:{
          width: 20,
          fontSize: 15,
          fontFamily: "Rubik_400Regular",
        },
        answerTextSub:{
          fontSize: 15,
          fontFamily: "Rubik_400Regular",
          flex: 1,
          flexWrap: "wrap",
           },
});

export default PastpapersQuizItem;