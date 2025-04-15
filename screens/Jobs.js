import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Image,
  StyleSheet,
  ToastAndroid
} from "react-native";
import React, { useState, useEffect } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import url from "../utils/URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { logout } from "../redux/actions/authActions";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import * as FileSystem from "expo-file-system";
import * as Permissions from 'expo-permissions';
import ModalAlert from "../components/ModalAlert";
import { clearMessage } from "../redux/actions/authActions";
import { baseUrl } from "../constants/global";



const Jobs = (props) => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterJobs, setFilterJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [uri, setUri] = useState(null);
  const [downloadingFileId, setDownloadingFileId] = useState(null);
  const [downloadingFilePath, setDownloadingFilePath] = useState(null);
  const [downloadStarted, setDownloadStarted] = useState(false)
  
//  downloadFile(item.path, item.path.split("/").pop());


  useEffect(() => {
    getJobs();
  }, []);

  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });

  const getJobs = async () => {
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    let data = {
      userid: props.auth.user.id,
    };
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, data[key]);
    }
    fetch(`${baseUrl}/api/jobs/show`, {
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
        setJobs(data.data);
        setFilterJobs(data.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((e) => {
        Alert.alert("Session Token Expired", "Kindly login again!", [
          {
            text: "Ok",
            onPress: () => {
              props.navigation.navigate("SignIn");
              props.logout();
            },
          },
        ]);
      });
  };

  if (loading) {
    return <Loading />;
  }

  // const requestExternalStoragePermission = async () => {
  //   const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY_WRITE_ONLY);
  
  //   if (status !== 'granted') {
  //     console.error('Permission to access external storage denied.');
  //     return false;
  //   }
  
  //   return true;
  // };

  // async function getpermissions() {
  //   if (Platform.OS === "android") {
  //     const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  //     if (permissions.granted) {
  //       ToastAndroid.show("Permissions granted", ToastAndroid.SHORT);
  //     } else {
  //       ToastAndroid.show("Permissions Rejected", ToastAndroid.SHORT);
    
  //     }
  //   } 
  // }


  async function saveFile(uri, filename, mimetype) {
    console.log("save file called "+filename+" "+mimetype)
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 }).then((newuri)=>{
                 console.log("done "+newuri)
                 setUri("Internal Storage/Cep")
                 setShowModal(true);
                 setDownloadingFileId(null);
                 setDownloadStarted(false)
            });
          })
          .catch(e => console.log(e));
      } else {
       // shareAsync(uri);
      }
    } else {
      //shareAsync(uri);
    }
  }

  const downloadFile = async ( downloadingFilePathn) => {
   //                    downloadFile(item.path, item.path.split("/").pop());
    setDownloadStarted(true)
    let url = "" 
    url = downloadingFilePathn;
    var filename = ""
    
    console.log("url "+url)
    if(url.includes("https")){
       console.log("includes https")
       filename = url.split("/").pop()
    }else{
      console.log("dont includes")
      filename = url.split("/").pop()
    }
    console.log("filename "+filename)
     
    const directory = `${FileSystem.documentDirectory}/CEP`;
    const fileUri = `${directory}/${filename}`;


    try {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    } catch (e) {
      console.error(e);
    }

    const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);

    try {
      const result = await downloadResumable.downloadAsync();
      await saveFile(result.uri, filename,  'application/pdf')
     
    } catch (e) {
      setDownloadStarted(false)
      console.error(e);
    }
  };

  const searchJob = (searchKeyword) => {
    if (searchKeyword === "") {
      setFilterJobs(jobs);
    } else {
      let filteredJobs = jobs.filter((job) =>
        job.jobname.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilterJobs(filteredJobs);
    }
  };


  const filteringJobs = (searchKeyword) => {
    if (searchKeyword === "") {
      setFilterJobs(jobs);
    } else {
      let filteredJobs = jobs.filter((job) =>
        job.jobdescription.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilterJobs(filteredJobs);
    }
  };


  const bookmark = async (id) => {
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    let data = {
      jobid: id,
      userid: props.auth.user.id,
    };
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, data[key]);
    }
    fetch(`${baseUrl}/api/jobs/bookmark/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: searchParams.toString(),
    }).then(() => {
      var updatedJobs = jobs;
      let job = updatedJobs.find((item) => item.id === id);
      // Update the bookmarked property
      if (job) {
        job.bookmarked = 1;
      }
      setJobs([...updatedJobs]);
      setLoading(false);
    });
  };


  const unbookmark = async (id) => {
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);
    let data = {
      jobid: id,
      userid: props.auth.user.id,
    };
    const searchParams = new URLSearchParams();
    for (const key in data) {
      searchParams.append(key, data[key]);
    }
    fetch(`${baseUrl}/api/jobs/unbook/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: searchParams.toString(),
    }).then((response) => {
      var updatedJobs = jobs;
      let job = updatedJobs.find((item) => item.id === id);
      // Update the bookmarked property
      if (job) {
        job.bookmarked = 0;
      }
      setJobs([...updatedJobs]);
      setLoading(false);
    });
  };

  return (
    <View
      style={{
        height: "100%",
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "white",
      }}
    > 
      <View>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => props.navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text
            style={{
              textAlign: "center",
              marginRight: 20,
              fontSize: 18,
              fontWeight: "500",
              fontFamily: "Rubik_400Regular",
            }}
          >
            Job Updates
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#FFF",
            height: 35,
            paddingHorizontal: 10,
            borderWidth: 0.5,
            borderColor: "#DADADA",
            borderRadius: 100,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* <Image
              source={require("../assets/icons/searchIcon.png")}
              style={{ width: 17, height: 17, marginRight: 20 }}
            /> */}
            <TextInput
              placeholder="Search"
              placeholderTextColor="#888"
              onChangeText={(t) => searchJob(t)}
              style={{
                fontFamily: "Rubik_400Regular",
                width: "80%",
              }}
            />
          </View>
          <Image
            source={require("../assets/icons/filter.png")}
            style={{ width: 17, height: 17 }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              fontFamily: "Rubik_400Regular",
            }}
          >
            Recent Jobs
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "rgba(189, 189, 189, 1)",
              fontFamily: "Rubik_400Regular",
            }}
          >
            Search Results "{jobs?.length}”
          </Text>
        </View>

        <FlatList
          data={filterJobs}
          numColumns={1}
          contentContainerStyle={{ paddingBottom: 180 }}
          showsVerticalScrollIndicator={false}
          onRefresh={() => {
            setRefreshing(true);
            getJobs();
          }}
          refreshing={refreshing}
          renderItem={({ item, index }) => (
          
            <View
              style={styles.mainContainer}
              key={index}
            >
              <View
                style={styles.horizontalStyler}
              >
                <View>
                  <Text
                    style={styles.nameTextStyler}
                    selectable={false}
                  > {console.log("Job item "+JSON.stringify(item))} 
                    {item.jobname}
                  </Text>
                  <Text
                    style={styles.dateStyler}
                    selectable={false}
                  >
                    Last date: {item.expirydate}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    if (item.bookmarked === 0) {
                      bookmark(item.id);
                    } else {
                      unbookmark(item.id);
                    }
                    setLoading(true);
                  }}
                >
                  {item.bookmarked === 0 ? (
                    <Feather
                      style={styles.rightMarginA}
                      name="bookmark"
                      size={22}
                      color="cornflowerblue"
                    />
                  ) : (
                    <FontAwesome
                      name="bookmark"
                      style={styles.rightMarginB}
                      size={22}
                      color="gold"
                    />
                  )}
                </TouchableOpacity>
              </View>

              <View
                style={styles.secondaryContainer}
              >
                <View
                  style={styles.pdfContainer}
                >
                  <Feather
                    name="file-text"
                    size={24}
                    color="rgba(203, 16, 0, 1)"
                  />
                  <Image
                    source={require("../assets/icons/pdf.png")}
                    style={styles.imageIcon}
                  />
                  <Text
                    style={styles.pdfText}
                    selectable={false}
                  >
                    {item.path.split("/").pop()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setDownloadingFileId(item.id);
                    setDownloadingFilePath(item.path);
                    console.log("path "+item.path)
                    downloadFile(item.path)
                  }}
                  disabled={downloadingFileId === item.id}
                >
                  {downloadingFileId === item.id && downloadStarted ? (
                    <Image
                      // source={require ("../../assets/icons/downloading.png")}
                      source={require("../assets/icons/downloading.png")}
                      style={styles.downloadContainer}
                    />
                  ) : (
                    <Feather
                      name="download"
                      size={26}
                      color="rgba(12, 229, 191, 1)"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
      <Footer {...props} />
      <ModalAlert
        title={"File Downloaded Successfully"}
        message={`Location: ${uri}`}
        show={showModal}
        setShow={setShowModal}
        navigation={props.navigation}
        navigateTo={"Jobs"}
        clearMessage={props.clearMessage}
      />
    </View>
  );
};



const styles= StyleSheet.create({
  mainContainer:{
   padding: 18,
   backgroundColor: "#FFFFFF",
   borderWidth: 0.5,
   borderColor: "#DADADA",
   borderRadius: 8,
   marginVertical: 6,
 },
  horizontalStyler:{
   flexDirection: "row",
   justifyContent: "space-between",
 },
  nameTextStyler:{          
     fontWeight: "500",
     fontSize: 16,
     fontFamily: "Rubik_400Regular",          
 },
 dateStyler:{
   fontWeight: "400",
   fontSize: 13,
   color: "rgba(176, 176, 176, 1)",
   fontFamily: "Rubik_400Regular",
   marginTop: 5,
 },
 rightMarginA:{ marginRight: 2 },  
 rightMarginB:{ marginRight: 6 },

 secondaryContainer:{
   flexDirection: "row",
   justifyContent: "space-between",
   alignItems: "center",
   marginTop: 10,
 },
 pdfContainer:{
   flexDirection: "row",
   alignItems: "center",
   marginTop: 5,
 },
 imageIcon:{
    width: 28, 
    height: 28 
 },
 pdfText:{
     marginLeft: 10,
     fontSize: 12,
     fontFamily: "Rubik_400Regular",
 },
 downloadContainer:{
   
     width: 90,
     height: 30,
   
 }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout, clearMessage })(Jobs);
