import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import Greetings from "../../components/Greetings";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import Subject from "../../components/Subject";
import MainSection from "../../components/MainSection";
import { baseUrl } from "../../constants/global";

const SelectSubject = (props) => {
  const [filteredSubjects, setFilteredSubjects] = useState(null);
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilterSubject, setSelectedFilterSubject] = useState("All");
  const [filterSubjects, setFilterSubjects] = useState([]);

  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });

  const renderItem = useCallback(
    ({ item }) => <MainSection navigation={props.navigation} item={item} />,
    []
  );

  const CustomizeQuiz = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            backgroundColor: "rgba(224, 255, 250, 1)",
            marginTop: 10,
            borderRadius: 8,
            paddingVertical: 10,
            paddingLeft: 8,
          }}
        >
          <View>
            <Text
              style={{
                color: "rgba(255, 143, 15, 1)",
                fontSize: 18,
                fontWeight: "500",
                fontFamily: "Rubik_400Regular",
              }}
            >
              Customize Quiz
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: "400",
                fontFamily: "Rubik_400Regular",
              }}
            >
              Select Subject According to paper
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 100,
                  backgroundColor: "rgba(255, 143, 15, 1)",
                  paddingVertical: 5,
                  paddingHorizontal: 20,
                  marginTop: 10,
                }}
                onPress={() => props.navigation.navigate("CustomizeQuiz")}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 10,
                    fontWeight: "600",
                  }}
                >
                  Start
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    getSubjects();
  }, []);

  const getSubjects = async () => {
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    let data = {
      examid: props.route.params.examid,
      active: 1,
    };
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, data[key]);
    }
    fetch(`${baseUrl}/api/subjects/listexamssubjects`, {
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
        if (response.data) {
          const data = response.data[0];
          const sectionData = Object.keys(data).map((key) => {
            const categoryData = data[key];
            const subSections = Object.keys(categoryData).map((subKey) => {
              const subjects = categoryData[subKey].map((item) => item);
              return {
                title: subKey,
                data: subjects,
              };
            });
            return {
              title: key,
              data: subSections,
            };
          });
          setData(sectionData);
          setRawData(data);

          let subGroups = [];
          for (let subject in data) {
            let groups = data[subject];
            for (let group in groups) {
              subGroups.push(group);
            }
          }
          setFilterSubjects(["All", ...subGroups]);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const searchSubjectsUsingFilter = (filterKeyword) => {
    if (filterKeyword === "All" || filterKeyword === "") {
      setFilteredSubjects(null);
    } else {
      let subjects = [];
      for (let key in rawData) {
        let subGroups = rawData[key];
        for (let subGroup in subGroups) {
          if (subGroup === filterKeyword) {
            subjects = subGroups[subGroup];
          }
        }
      }
      setFilteredSubjects(subjects);
    }
  };

  const searchSubjects = (searchKeyword) => {
    if (searchKeyword === "All" || searchKeyword === "") {
      setFilteredSubjects(null);
    } else {
      let subjects = [];
      for (let key in rawData) {
        let subGroups = rawData[key];
        for (let subGroup in subGroups) {
          subGroups[subGroup].map((item) => {
            if (item.name.includes(searchKeyword)) {
              subjects = [...subjects, item];
            }
          });
        }
      }
      setFilteredSubjects(subjects);
    }
  };

  return (
    <View style={{ height: "100%", backgroundColor: "white" }}>
      <View style={{ backgroundColor: props.auth.themeMainColor }}>
        <View style={{ padding: 30 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20, height: 50 }}>
            <View>
              <Greetings />
              <Text style={{ fontSize: 18, fontWeight: "500", color: "white" }}>{props.auth.user?.fullname}</Text>
            </View>
            <Image
              style={{ width: 45, height: 45, borderRadius: 204, borderWidth: 1, borderColor: "#FFF" }}
              source={!props.auth.picture ? require("../../assets/profilePicture.jpg") : { uri: props.auth.picture }}
              resizeMode="contain"
            />
          </View>
          <View style={{ borderRadius: 100, paddingHorizontal: 20, paddingVertical: 10, marginTop: 20, flexDirection: "row", alignItems: "center", backgroundColor: "white" }}>
            <TextInput
              style={{ marginLeft: 5, fontFamily: "Rubik_400Regular", width: "100%" }}
              placeholder="Search Subject or Topic"
              placeholderTextColor="#888"
              onChangeText={(t) => searchSubjects(t)}
            />
            <View style={{ marginLeft: "auto" }}>
              <Image source={require("../../assets/icons/filter.png")} style={{ width: 17, height: 17 }} />
            </View>
          </View>
        </View>
        <View style={{ marginBottom: 10, marginLeft: 20 }}>
          <FlatList
            data={filterSubjects}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedFilterSubject(item);
                  searchSubjectsUsingFilter(item);
                }}
                key={`${item}-${index}`}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 8,
                    paddingHorizontal: 20,
                    height: 36,
                    borderWidth: 1.5,
                    borderColor: selectedFilterSubject !== item ? "#FFFFFF" : props.auth.themeSecondaryColor,
                    borderRadius: 100,
                    marginRight: 10,
                    backgroundColor: selectedFilterSubject === item ? props.auth.themeSecondaryColor : props.auth.themeMainColor,
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 12, fontFamily: "Rubik_400Regular" }}>{item}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {loading ? (
        <Loading />
      ) : (
        <>
          {filteredSubjects == null ? (
            <>
              <FlatList
                style={{ marginHorizontal: 10, marginBottom: 70 }}
                data={data}
                disableVirtualization={true}
                ListHeaderComponent={CustomizeQuiz}
                keyExtractor={(item, index) => `${item.title}-${index}`}
                renderItem={({ item: section, index }) => (
                  <View key={`section-${index}`}>
                    <Text style={{ color: props.auth.themeMainColor, fontSize: 18, fontWeight: "500", marginLeft: 10, marginVertical: 8 }}>
                      <Text style={{ color: "#FF8F0F" }}>{index === 0 ? "A" : index === 1 ? "B" : "C"}. </Text>
                      {section.title}
                    </Text>

                    <FlatList
                      data={section.data}
                      renderItem={({ item: subSection, index: subIndex }) => (
                        <View key={`${subIndex}-${subSection.title}`}>
                          {subSection.title !== section.title && <Text style={styles.subsection_text}>{subSection.title}</Text>}
                          <View style={styles.subsection_container}>
                            <FlatList
                              data={subSection.data}
                              style={{ flex: 1 }}
                              numColumns={2}
                              keyExtractor={(item, index) => `subject-${index}`}
                              renderItem={renderItem}
                            />
                          </View>
                        </View>
                      )}
                    />
                  </View>
                )}
              />
            </>
          ) : (
            <ScrollView style={{ marginBottom: 70 }}>
              <View style={{ marginHorizontal: 20 }}>
                {CustomizeQuiz()}
                <View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" }}>
                    {filteredSubjects.map((item, index) => (
                      <Subject navigation={props.navigation} item={item} key={`subject-${index}`} />
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </>
      )}
      <Footer {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  subsection_text: {
    fontSize: 16,
    color: "#424242",
    fontFamily: "Rubik_400Regular",
    marginVertical: 8,
    marginLeft: 10,
  },
  subsection_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(SelectSubject);
