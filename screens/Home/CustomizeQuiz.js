import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Loading from "../../components/Loading";
import url from "../../utils/URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { logout } from "../../redux/actions/authActions";
import { useFonts } from "expo-font";
// import { MaterialIcons, Feather, Entypo } from "@expo/vector-icons";
import Footer from "../../components/Footer";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import { SelectList } from "react-native-dropdown-select-list";
import { baseUrl } from "../../constants/global";

const CustomizeQuiz = (props) => {
  const [customizeQuiz, setCustomizeQuiz] = useState([
    {
      subjectname: "Select a subject",
      mcqs: "",
      subjectid: 0,
    },
  ]);
  const [quizName, setQuizName] = useState("");
  const [quizId, setQuizId] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [displaySavedQuizzes, setDisplaySavedQuizzes] = useState([]);
  const [showSavedQuizzes, setShowSavedQuizzes] = useState(false);
  const [quizUpdate, setQuizUpdate] = useState(false);

  const input2 = useRef(null);

  useEffect(() => {
    listSubjects();
    getSaveQuizzes();
  }, []);

  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });

  const updateCustomizeQuiz = (index, subjectid, mcqs) => {
    let subject = availableSubjects.find((item) => item.key === subjectid);
    setCustomizeQuiz((prevState) => {
      const newState = [...prevState];
      newState[index] = { subjectname: subject.value, mcqs, subjectid };
      return newState;
    });
  };

  const removeCustomizeQuiz = (indexToRemove) => {
    const newArray = customizeQuiz.filter(
      (_, index) => index !== indexToRemove
    );
    setCustomizeQuiz(newArray);
  };

  const saveQuiz = async () => {
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    let subjects = [];
    customizeQuiz.forEach((q) => {
      subjects.push({
        subjectid: q.subjectid,
        questions: Number(q.mcqs),
      });
    });
    let data = {
      userid: props.auth.user.id,
      name: quizName,
      subjects,
    };
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, JSON.stringify(data[key]));
    }
    fetch(`${baseUrl}/api/customizequiz/store`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: searchParams.toString(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.messsage === "created a customized quiz") {
          setShowSavedQuizzes(true);

          getSaveQuizzes();
        }
      })
      .catch((e) => {
        Alert.alert("Session Token Expired", "Kindly login again!", [
          {
            text: "Ok",
            onPress: () => {
           //   props.navigation.navigate("SignIn");
              props.logout();
            },
          },
        ]);
      });
  };
  const getSaveQuizzes = async () => {
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    const searchParams = new URLSearchParams();
    searchParams.append("userid", JSON.stringify(props.auth.user.id));
    fetch(`${baseUrl}/api/customizequiz/show`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: searchParams.toString(),
    })
      .then((res) => res.json())
      .then((data) => {
        setSavedQuizzes(data.data);
        setDisplaySavedQuizzes(data.data);
        setLoading(false);
      })
      .catch((e) => {
        Alert.alert("Session Token Expired", "Kindly login again!", [
          {
            text: "Ok",
            onPress: () => {
             // props.navigation.navigate("SignIn");
              props.logout();
            },
          },
        ]);
      });
  };
  const listSubjects = async () => {
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    fetch(`${baseUrl}/api/subjects/show`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.message === "Token has expired") {
          Alert.alert("Session Token Expired!", "Kindly login again!", [
            {
              text: "Ok",
              onPress: () => {
               // props.navigation.navigate("SignIn");
                props.logout();
              },
            },
          ]);
        } else {
          let subjects = response.data.map((item) => ({
            value: item.name,
            key: item.id,
          }));
          setAvailableSubjects(subjects);
          setLoading(false);
        }
      })
      .catch((e) => {});
  };

  if (loading) {
    return <Loading />;
  }

  const searchQuiz = (searchKeyword) => {
    if (searchKeyword === "") {
      setDisplaySavedQuizzes(savedQuizzes);
    } else {
      let filteredQuizzes = savedQuizzes.filter((quiz) =>
        quiz.quizname.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setDisplaySavedQuizzes(filteredQuizzes);
    }
  };

  const deleteQuiz = async (quizId) => {
    setLoading(true);
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    let data = {
      userid: props.auth.user.id,
      quizid: quizId,
    };
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, JSON.stringify(data[key]));
    }
    fetch(`${baseUrl}/api/customizequiz/remove`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: searchParams.toString(),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          getSaveQuizzes();
          setShowSavedQuizzes(true);
        } else {
          Alert.alert("Check your internet connection and try again!", "", [
            { text: "Try Again" },
          ]);
        }
      });
  };

  const updateQuiz = async () => {
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    let data = {
      subjects: customizeQuiz,
      name: quizName,
      userid: props.auth.user.id,
      quizid: quizId,
    };
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, JSON.stringify(data[key]));
    }
    fetch(`${baseUrl}/api/customizequiz/edit`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: searchParams.toString(),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          setLoading(true);
          setQuizUpdate(false);
          setShowSavedQuizzes(true);
          getSaveQuizzes();
        } else {
          Alert.alert("Check your internet connection and try again!", "", [
            { text: "Try Again" },
          ]);
        }
      });
  };
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 60,
        height: "100%",
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row" }}>
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
              fontWeight: "600",
              fontFamily: "Rubik_400Regular",
            }}
          >
            Customize Quiz
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
          marginTop: 10,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setShowSavedQuizzes(true);
          }}
          style={{
            width: "45%",
          }}
        >
          <View
            style={{
              alignItems: "center",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderWidth: 1.5,
              borderColor: props.auth.themeMainColor,
              backgroundColor: showSavedQuizzes
                ? props.auth.themeMainColor
                : "#0000",
              borderRadius: 100,
            }}
          >
            <Text
              style={{
                color: showSavedQuizzes ? "#FFFFFF" : "#000",
                fontSize: 12,
                fontWeight: "600",
                fontFamily: "Rubik_400Regular",
              }}
              selectable={false}
            >
              Saved Quizzes
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setShowSavedQuizzes(false);
            setQuizName(null);
            setQuizId(null);
            setCustomizeQuiz([
              {
                subjectname: "Select a subject",
                mcqs: "",
                subjectid: 0,
              },
            ]);

            setQuizUpdate(false);
          }}
          style={{
            width: "45%",
          }}
        >
          <View
            style={{
              alignItems: "center",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderWidth: 1.5,
              borderColor: props.auth.themeMainColor,
              backgroundColor: !showSavedQuizzes
                ? props.auth.themeMainColor
                : "#0000",
              borderRadius: 100,
            }}
          >
            <Text
              style={{
                color: !showSavedQuizzes ? "#FFFFFF" : "#000",
                fontSize: 12,
                fontWeight: "600",
                fontFamily: "Rubik_400Regular",
              }}
              selectable={false}
            >
              Create New Quiz
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {showSavedQuizzes ? (
        <>
          {savedQuizzes.length !== 0 ? (
            <View>
              <View
                style={{
                  borderRadius: 100,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  marginTop: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(189, 189, 189, 1)",
                }}
              >
                {/* <MaterialIcons name="search" size={17} color="#BDBDBD" /> */}
                <TextInput
                  style={{
                    marginLeft: 5,
                    fontFamily: "Rubik_400Regular",
                    width: "100%",
                  }}
                  placeholder="Search Test"
                  placeholderTextColor="#BDBDBD"
                  onChangeText={(t) => {
                    searchQuiz(t);
                  }}
                />
                <View style={{ marginLeft: "auto" }}>
                  <Image
                    source={require("../../assets/icons/filter.png")}
                    style={{ width: 17, height: 17 }}
                  />
                </View>
              </View>
              <FlatList
                data={displaySavedQuizzes}
                numColumns={1}
                contentContainerStyle={{ paddingBottom: 150 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      padding: 20,
                      background: "#FFFFFF",
                      borderWidth: 1,
                      borderColor: "#EEEEEE",
                      borderStyle: "solid",
                      borderRadius: 8,
                      marginVertical: 10,
                    }}
                    key={index}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontSize: 18,
                            color: props.auth.themeMainColor,
                            fontWeight: "500",
                            fontFamily: "Rubik_400Regular",
                            marginTop: 10,
                          }}
                          selectable={false}
                        >
                          {item.quizname}
                        </Text>
                        {/* <Text
                      style={{
                        fontSize: 14,
                        color: "black",
                        marginHorizontal: 10,
                        textAlign: "center",
                        fontFamily: "Rubik_400Regular",
                      }}
                      selectable={false}
                    >
                      Subject:{" "}
                      <Text style={{ fontWeight: 500 }}>{item.name}</Text>
                    </Text> */}
                      </View>
                    </View>

                    <>
                      <View
                        style={{
                          margin: 8,
                        }}
                      >
                        {item.quiz.map((m, t) => {
                          return (
                            <Text
                              style={{
                                fontSize: 13,
                                color: "#A3A3A3",
                                fontFamily: "Rubik_400Regular",
                                fontWeight: "400",
                                marginVertical: 2,
                              }}
                              key={`quiz ${t}`}
                            >
                              {t + 1}. {m.subjectname}({m.mcqs})
                            </Text>
                          );
                        })}
                      </View>
                    </>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        marginTop: 15,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          props.navigation.navigate("CustomizeQuizQuestions", {
                            quizid: item.quizid,
                            quizName: item.quizname,
                          })
                        }
                        style={{
                          paddingHorizontal: 40,
                          paddingVertical: 10,
                          borderRadius: 40,
                          marginRight: 7,
                          backgroundColor: props.auth.themeMainColor,
                        }}
                      >
                        <Text
                          style={{
                            color: "#FFFFFF",
                            fontSize: 12,
                            fontWeight: "600",
                            fontFamily: "Rubik_400Regular",
                          }}
                        >
                          Start
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          paddingHorizontal: 44,
                          paddingVertical: 10,
                          borderRadius: 40,
                          marginRight: 7,
                          backgroundColor: "cornflowerblue",
                        }}
                        onPress={() => {
                          setQuizName(item.quizname);
                          setQuizId(item.quizid);
                          setCustomizeQuiz(item.quiz);
                          setShowSavedQuizzes(false);
                          setQuizUpdate(true);
                        }}
                      >
                        <Text
                          style={{
                            color: "#FFFFFF",
                            fontSize: 12,
                            fontWeight: "600",
                            fontFamily: "Rubik_400Regular",
                          }}
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
          ) : (
            <View>
              <Text
                style={{
                  marginTop: 140,
                  fontFamily: "Rubik_400Regular",
                  fontWeight: "400",
                  color: "rgba(139, 139, 139, 1)",
                  fontSize: 16,
                  textAlign:'center'
                }}
              >
                No Customize Quiz Saved
              </Text>
            </View>
          )}
        </>
      ) : (
        <View style={{ marginVertical: 20 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "400",
              color: props.auth.themeMainColor,
              fontFamily: "Rubik_400Regular",
              marginBottom: 8,
            }}
          >
            Make your own test
          </Text>
       
          <FlatList
            data={customizeQuiz}
            numColumns={1}
            contentContainerStyle={{ paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: "#DADADA",
                  borderRadius: 8,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    marginLeft: 10,
                    marginBottom: 5,
                    marginTop: 15,
                  }}
                >
                  Title
                </Text>
                <TextInput
                  placeholder="Enter title"
                  value={quizName}
                  onChangeText={(text) => setQuizName(text)}
                  style={{
                    borderWidth: 1,
                    borderColor: "lightgray",
                    borderRadius: 100,
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    marginVertical: 10,
                    fontFamily: "Rubik_400Regular",
                  }}
                />
              </View>
            }
            ListFooterComponent={
              <View>
                <TouchableOpacity
                  onPress={() =>
                    setCustomizeQuiz([
                      ...customizeQuiz,
                      {
                        subjectname: "Select a subject",
                        mcqs: "",
                        subjectid: customizeQuiz.length,
                      },
                    ])
                  }
                >
                  <Text
                    style={{
                      textAlign: "right",
                      color: props.auth.themeMainColor,
                      fontSize: 14,
                      fontFamily: "Rubik_400Regular",
                    }}
                  >
                    {" "}
                    + Add New
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (quizUpdate) {
                        updateQuiz();
                      } else {
                        saveQuiz();
                      }
                    }}
                    style={{
                      backgroundColor:
                        quizName === "" ||
                        customizeQuiz[0].mcqs === "" ||
                        customizeQuiz[0].subjectname === "Select a subject"
                          ? "lightgray"
                          : props.auth.themeSecondaryColor,
                      borderRadius: 100,
                      paddingVertical: 15,
                      width: "45%",
                      marginTop: 20,
                      alignItems: "center",
                    }}
                    disabled={
                      quizName === "" ||
                      customizeQuiz[0].mcqs === "" ||
                      customizeQuiz[0].subjectname === "Select a subject"
                    }
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: 14,
                        fontFamily: "Rubik_400Regular",
                      }}
                    >
                      {!quizUpdate ? "Save" : "Update"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      if (!quizUpdate) {
                        props.navigation.navigate("CustomizeQuizQuestions", {
                          startquiz: 1,
                          quizName: quizName,
                          customizeQuiz: [...customizeQuiz],
                        });
                      } else {
                        deleteQuiz(quizId);
                      }
                    }}
                    style={{
                      // borderWidth: 1,
                      // borderColor: !quizUpdate
                      //   ? "rgba(12, 229, 191, 1)"
                      //   : "red",
                      borderRadius: 100,
                      paddingVertical: 15,
                      width: "45%",

                      marginTop: 20,
                      alignItems: "center",
                      backgroundColor: !quizUpdate
                      &&
                      (quizName === "" ||
                        customizeQuiz[0].mcqs === "" ||
                        customizeQuiz[0].subjectname === "Select a subject")
                        ? 'lightgray': !quizUpdate ? props.auth.themeMainColor
                        : "red",
                    }}
                    disabled={
                      !quizUpdate &&
                      (quizName === "" ||
                        customizeQuiz[0].mcqs === "" ||
                        customizeQuiz[0].subjectname === "Select a subject")
                    }
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        fontFamily: "Rubik_400Regular",
                        color: !quizUpdate ? "white" : "white",
                      }}
                    >
                      {!quizUpdate ? "Start" : "Delete"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View
                style={{
                  padding: 14,
                  backgroundColor: "#FFFFFF",
                  borderWidth: 0.5,
                  borderColor: "#DADADA",
                  borderRadius: 8,
                  marginVertical: 10,
                }}
                key={index}
              >
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        marginLeft: 10,
                        marginBottom: 10,
                      }}
                    >
                      Subject
                    </Text>
                    {customizeQuiz.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeCustomizeQuiz(index)}
                        style={{ alignItems: "flex-end" }}
                      >
                        {/* <Entypo name="cross" size={20} color="black" /> */}
                      </TouchableOpacity>
                    )}
                  </View>
                  {/* 
                  <TouchableOpacity
                    onPress={() => {
                      setShowDropdown(!showDropdown);
                      setDropdownId(item.subjectid);
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderWidth: 1,
                        borderColor: "lightgray",
                        borderRadius: 100,
                        paddingHorizontal: 20,
                        paddingVertical: 8,
                        marginVertical: 10,
                      }}
                    >
                      <Text style={{ color: "black" }}>{item.subjectname}</Text>
                      <Feather name="chevron-down" size={24} color="black" />
                    </View>
                  </TouchableOpacity> */}
                  <SelectList
                    setSelected={(subjectid) => {
                      updateCustomizeQuiz(index, subjectid, item.mcqs);
                      input2.current.focus();
                    }}
                    defaultOption={
                      item.subjectname !== "Select a subject" && {
                        key: item.subjectid,
                        value: item.subjectname,
                      }
                    }
                    data={availableSubjects}
                    save="key"
                    placeholder="Select a subject"
                    boxStyles={{ borderColor: "lightgray", borderRadius: 100 }}
                  />
                  {/* {showDropdown && dropdownId === item.subjectid && (
                    <View
                      style={{
                        backgroundColor: "#fff",
                        borderColor: "#ddd",
                        borderWidth: 1,
                        padding: 5,
                      }}
                    >
                      {availableSubjects.map((subject, subIndex) => (
                        <>
                          <View
                            style={{
                              borderBottomColor: "black",
                              borderBottomWidth: 1,
                              marginVertical: 8,
                            }}
                            key={subject.id}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              updateCustomizeQuiz(
                                index,
                                subject.name,
                                subject.id,
                                item.mcqs
                              );
                              setShowDropdown(false);
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Rubik_400Regular",
                              }}
                            >
                              {subject.name}
                            </Text>
                          </TouchableOpacity>
                        </>
                      ))} */}
                  {/* </View>
                  )} */}
                </View>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        marginLeft: 10,
                        marginBottom: 5,
                        marginTop: 15,
                      }}
                    >
                      Number of MCQs
                    </Text>
                    <TextInput
                      placeholder="Write No. of Mcq's here..."
                      value={item.mcqs.toString()}
                      onChangeText={(text) =>
                        updateCustomizeQuiz(index, item.subjectid, text)
                      }
                      ref={input2}
                      style={{
                        borderWidth: 1,
                        borderColor: "lightgray",
                        borderRadius: 100,
                        paddingHorizontal: 20,
                        paddingVertical: 8,
                        marginVertical: 10,
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                </KeyboardAvoidingView>
              </View>
            )}
          />
        </View>
      )}
      <Footer {...props} />
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(CustomizeQuiz);
