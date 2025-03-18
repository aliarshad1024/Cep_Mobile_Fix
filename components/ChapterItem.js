import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

const ChapterItem = ({ mainProps, item, openOptions, index, openOPtionCallback, quizClicked, mcqsClicked }) => {

     
  return (
    <TouchableOpacity
    style={styles.mainContainer}
    onPress={() => {
      if (openOptions === "0" || openOptions !== item.id) {
       // setOpenOptions(item.id);
        openOPtionCallback(item.id)
      } else {
        openOPtionCallback("0")
      }
    }}
    key={index}
  >
    <View
      style={styles.horizontalStyler}
    >
      <Text
        style={[styles.nameTextStyler,{color:mainProps.auth.themeMainColor} ]}
        selectable={false}
      >
        {item.name}
      </Text>
      {openOptions !== item.id ? (
        <View style={styles.rightMargin}>
          <Feather
            name="chevron-down"
            size={24}
            color="rgba(142, 142, 142, 1)"
          />
        </View>
      ) : (
        <View style={styles.rightMargin}>
          <Feather
            name="chevron-up"
            size={24}
            color="rgba(142, 142, 142, 1)"
          />
        </View>
      )}
    </View>
    <Text
      style={styles.secondaryTextStyler}
      selectable={false}
    >
      {item.description}
    </Text>
  
    {item.id === openOptions && (


      <View
        style={[styles.secondayViewStyler]}
      >

        {console.log("Open Options")}
        <TouchableOpacity
          onPress={() =>
            mcqsClicked(item, index)
          }
        >
          <View
            style={[styles.secondaryViewButtons,{backgroundColor: mainProps.auth.themeMainColor,}]}
          >
            <Text
              style={styles.buttonTxt}
              selectable={false}
            >
              MCQs
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            quizClicked(item, index)
          }
        >
          <View
            style={[styles.secondaryViewButtons,{backgroundColor: mainProps.auth.themeMainColor,}]}
          >
            <Text
              style={styles.buttonTxt}
            >
              Quiz
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )}
  </TouchableOpacity>
  );
};


const styles= StyleSheet.create({
         mainContainer:{
           padding: 24,
           background: "#FFFFFF",
           borderWidth: 1,
           borderColor: "#EEEEEE",
           borderStyle: "solid",
           borderRadius: 8,
           marginVertical: 5,
         },
         horizontalStyler:{
            flexDirection: "row",
            justifyContent: "space-between",
         },
         nameTextStyler:{
            fontSize: 18,
           // color: props.auth.themeMainColor,
            fontWeight: 500,
            fontFamily: "Rubik_400Regular",
        },
        rightMargin:{
            marginRight:20
        },
        secondaryTextStyler:{
            fontSize: 14,
            fontWeight: 400,
            fontFamily: "Rubik_400Regular",
        },
        secondayViewStyler:{
            flexDirection: "row",
            marginTop: 25,
            marginBottom: 5,
          
        },
        secondaryViewButtons:{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
            paddingVertical: 10,
            borderRadius: 100,
            marginRight: 10,
           // backgroundColor: props.auth.themeMainColor,
        },
        buttonTxt:{
          color: "#FFFFFF",
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "Rubik_400Regular",
        }
});

export default ChapterItem;
