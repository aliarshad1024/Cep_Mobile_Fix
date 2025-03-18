import React from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import TestType from "../screens/Home/TestType";
import JobsScreen from "../screens/Jobs";
import SignInScreen from "../screens/authentication/SigIn";
import SignUpScreen from "../screens/authentication/SignUp";
import OTPVerification from "../screens/authentication/OTPVerification";
import CustomizeQuiz from "../screens/Home/CustomizeQuiz";
import TestTypeHeader from "../components/TestTypeHeader";
import AppIntro from "../screens/AppIntro";

import SelectSubject from "../screens/Home/SelectSubject";
import SubjectSelected from "../screens/Home/SubjectSelected";
import MCQs from "../screens/Home/MCQs";
import Quiz from "../screens/Home/Quiz";
import QuizResult from "../screens/Home/QuizResult";
import CustomizeQuizQuestions from "../screens/Home/CustomizeQuizQuestions";
import Settings from "../screens/settings/Settings";
import Profile from "../screens/Profile";
import AttemptAllMCQs from "../screens/Home/AttemptAllMCQs";
import ForgotPassword from "../screens/authentication/ForgotPassword";
import AboutUsScreen from "../screens/settings/AboutUs";
const UnAuth_Stack = createStackNavigator();

import { connect } from "react-redux";
import { StatusBar } from "expo-status-bar";
import PasswordSent from "../screens/authentication/PasswordSent";
const UnauthenticatedStack=(props)=>{
 // console.log("Props "+JSON.stringify(props))
  


    return (
      <>
        <View style={{ marginBottom: 30 }}>
          <StatusBar backgroundColor={props.auth.themeMainColor} />
        </View>
        <UnAuth_Stack.Navigator initialRouteName="SignIn">
          <UnAuth_Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ headerShown: false }}
          />
  
          <UnAuth_Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
          <UnAuth_Stack.Screen
            name="OTPVerification"
            component={OTPVerification}
            options={{ headerShown: false }}
          />
          <UnAuth_Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: false }}
          />

         <UnAuth_Stack.Screen
            name="PasswordSent"
            component={PasswordSent}
            options={{ headerShown: false }}
          />
        </UnAuth_Stack.Navigator>  
      </>  
    )
  }



  const mapStateToProps = (state) => ({
    auth: state.auth,
  });
  
  export default connect(mapStateToProps)(UnauthenticatedStack);