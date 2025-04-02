import { View, Text, TouchableOpacity, Image,  StyleSheet } from "react-native";
import React from "react";
import FastImage from 'react-native-fast-image'

const MainSection = ({ navigation, item}) => {
  //  {console.log("Main Section Item : "+JSON.stringify(section))}
       

  return (
    <TouchableOpacity
      style={styles.main_container}
      
      onPress={() =>
        navigation.navigate("SubjectSelected", {
          subject: item.name,
          id: item.id,
          totalQuestions: item.totalquestions,
        })
      }
      // key={item.id}
    >
      <View
        style={styles.sub_container}
      >
         <FastImage
          resizeMode={FastImage.resizeMode.contain}
         // source={require("../assets/bookcover.png")}
          source={{ uri: `${item.icon}` }}
          style={styles.image_styler}
        /> 
      </View>
      <Text
        style={styles.text_styler}
        selectable={false}
      >
        {item.name}
      </Text>
      <Text
        style={styles.small_text}
        selectable={false}
      >
         {item.totalquestions === 0
          ? "coming soon"
          : `${Math.trunc(item.totalquestions / 10)} Quiz`} 
      </Text>
    </TouchableOpacity>
);
};



const styles= StyleSheet.create({
  main_container:{
        borderRadius: 12,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width:'45%',
        height: 145,
        borderWidth: 0.5,
        borderColor: "#DADADA",
        marginVertical: 10,
        marginHorizontal:10
  },
  sub_container:{
    backgroundColor: "#DDF4F0",
    borderRadius: 100,
    padding: 10,
    marginBottom: 5,
  },
  image_styler:{
    width: 26, 
    height: 26 
  },
  text_styler:{
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    marginHorizontal: 10,
    textAlign: "center",
    fontFamily: "Rubik_400Regular",
  },
  small_text:{
    fontSize: 12,
          color: "rgba(255, 143, 15, 1)",
          fontWeight: "400",
          marginTop: 5,
  }

})

export default MainSection;
