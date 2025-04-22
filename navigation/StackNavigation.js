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
import ReviewAllMCQs from "../screens/Home/ReviewAllMCQs";
const Stack = createStackNavigator();

import { connect } from "react-redux";
import { StatusBar } from "expo-status-bar";
// Stack navigator with Home as the initial screen



const MainStack = (props) => {
  return (
    <>
      <View>
        <StatusBar backgroundColor={props.auth.themeMainColor} />
      </View>
      <Stack.Navigator initialRouteName="TestType">
       


        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="QuizResult"
          component={QuizResult}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Quiz"
          component={Quiz}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MCQs"
          component={MCQs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AttemptAllMCQs"
          component={AttemptAllMCQs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReviewAllMCQs"
          component={ReviewAllMCQs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SubjectSelected"
          component={SubjectSelected}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CustomizeQuiz"
          component={CustomizeQuiz}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CustomizeQuizQuestions"
          component={CustomizeQuizQuestions}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TestType"
          component={TestType}
          options={{ header: (props) => <TestTypeHeader {...props} /> }}
        />

        <Stack.Screen
          name="SelectSubject"
          component={SelectSubject}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AppIntro"
          component={AppIntro}
          options={{ headerShown: false }}
        />

      
        <Stack.Screen
          name="Jobs"
          component={JobsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(MainStack);
