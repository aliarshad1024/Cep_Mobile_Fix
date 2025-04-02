import { View, Text, TouchableOpacity, FlatList, Image,Alert } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";
import Loading from "../../components/Loading";
import url from "../../utils/URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { logout } from "../../redux/actions/authActions";
// import { Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import Pagination from "../../components/Pagination";
import { useFonts } from "expo-font";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import MCQItem from "../../components/MCQItem";
import { baseUrl } from "../../constants/global";


const MCQs = (props) => {
  
  const [displayDetails, setDisplayDetails] = useState(false);
  const [details, setDetails] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [mcqs, setMcqs] = useState([]);
  const [displayMcqs, setDisplayMcqs] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);

  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });

  useEffect(() => {
    getMcqs();
  }, []);

  useEffect(()=>{
    if(isClosed)
      updatePage()
     
  },[isClosed])



  useEffect(() => {
    if(page%4==0 && !isLoaded){
       load()
    }
  }, [page]);


  
  const renderMCQItem=useCallback(({item, index}) => (
    <MCQItem
       item={item}
       index={index}
       page={page}
       isReview={false}
       mainProps={props}
       showDetailModal={(det, detType, detImage)=>{
        const detailObject = {
          detail:det,
          detailType:detType,
          detailImage:detImage
        }
        setDetails(detailObject);
        setDisplayDetails(true);
       }}
    />
  ),[page]);





  const getMcqs = async () => {
    let user = await AsyncStorage.getItem("persist:auth");
    let token = JSON.parse(user).token.slice(1, -1);

    if (token === "ul") {
      user = await AsyncStorage.getItem("persist:auth");
      token = JSON.parse(user).token.slice(1, -1);
    }

    fetch(`${baseUrl}/api/mcqs/show`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${props.auth.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Token has expired") {
          Alert.alert("Session Token Expired!", "Kindly login again!", [
            {
              text: "Ok",
              onPress: () => {
                props.logout();
              },
            },
          ]);
        } else if (data?.status === "success") {
          setMcqs(data.data);
          setDisplayMcqs(data.data);
          setTotalQuestions(data.data.length);
          setLoading(false);
          setRefreshing(false);
        }
      })
      .catch((e) => {
        Alert.alert("Kindly, check your internet connection", "", [
          { text: "Try Again", onPress: () => getMcqs() },
        ]);
      });
  };

  
const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);
  
  
  const preupdatePage=async(type, p)=>{
        if(page%4==0 && isLoaded){
          show()
        }else{
          updatePageSkipAd(type, p)
        }


  }



  
  const updatePage = () => {
    if (type === "inc") {
      if (page * 10 === mcqs.length) {
        if (page < (Math.trunc(props.route.params.totalQuestions / 10)+1)) {
          setPage(page + 1);
          setLoadingData(true);
          getMcqs();
        }
      } else {
        setPage(page + 1);
        setDisplayMcqs(mcqs.slice(page * 10, (page + 1) * 10));
      }
    } else if(type === "dec") {
      if (page > 1) {
        setPage(page - 1);
        setDisplayMcqs(mcqs.slice((page - 1) * 10, page * 10));
      }
    } else {
      setPage(p)
      setLoadingData(true);
      getMcqs();
    }
  };


  const updatePageSkipAd = (type, p) => {
    console.log("inside updatePage")
    console.log("type "+type)
    if (type === "inc") {
      if (page * 10 === mcqs.length) {
        if (page < (Math.trunc(props.route.params.totalQuestions / 10)+1)) {
          setPage(page + 1);
          setLoadingData(true);
          console.log("page "+page)
    
          getMcqs();
        }
      } else {
        setPage(page + 1);
        setDisplayMcqs(mcqs.slice(page * 10, (page + 1) * 10));
      }
    } else if(type === "dec") {
      if (page > 1) {
        setPage(page - 1);
        setDisplayMcqs(mcqs.slice((page - 1) * 10, page * 10));
      }
    } else {
      setPage(p)
      setLoadingData(true);
      getMcqs();
    }
  }; 




  if (loading) {
    return <Loading />;
  }

  return (
    <View
      style={{
        padding: 30,
        backgroundColor: "white",
        height: "100%",
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
            fontWeight: "500",
            fontFamily: "Rubik_400Regular",
          }}
          selectable={false}
        >
          {props.route.params.chapterName}
        </Text>
      </View>

      <Text
        style={{
          marginTop: 10,
          color: "#A3A3A3",
          fontFamily: "Rubik_400Regular",
        }}
      >
        Showing results "{displayMcqs.length}"
      </Text>
      {mcqs.length === 0 ? (
        <Text
          style={{
            color: "rgba(139, 139, 139, 1)",
            textAlign: "center",
            marginTop: 140,
            fontSize: 16,
            fontFamily: "Rubik_400Regular",
            fontWeight: "400",
          }}
        >
          Coming Soon
        </Text>
      ) : (
        <>
          {loadingData ? (
            <Loading />
          ) : (
            <FlatList
              data={displayMcqs}
              numColumns={1}
              contentContainerStyle={{ paddingBottom: 50 }}
              showsVerticalScrollIndicator={false}
              onRefresh={() => {
                setRefreshing(true);
                getMcqs();
              }}
              refreshing={refreshing}
              renderItem={renderMCQItem}
            />
          )}
        </>
      )}
      <View>
        <Modal
          isVisible={displayDetails}
          onBackdropPress={() => setDisplayDetails(false)}
          backdropOpacity={0.5}
          style={{ margin: 20, borderRadius: 8 }}
        >
          <View style={{ flex: 1, justifyContent: "center", borderRadius: 8 }}>
          <View
              style={{
                flexDirection:'row-reverse',
                backgroundColor: props.auth.themeMainColor,
                paddingVertical: 10,
                justifyContent:'space-between'
              }}
            >

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignSelf: "flex-end",
                  marginRight:10,
                }}
                onPress={() => setDisplayDetails(false)}
              >
                <Image
                  source={require("../../assets/icons/cross.png")}
                  style={{ width: 17, height: 17 }} 
                 />

                {/* <FontAwesome
                name="window-close"
                size={17}
                color={"#FF8F0F"}
                >

                </FontAwesome> */}
              </TouchableOpacity>
              <Text
                style={{
                  textAlign: "center",
                  color: "#FFFF",
                  width:'100%',
                  fontWeight: "600",
                  paddingLeft:20,
                  fontSize: 18,
                  marginLeft:10,
                  fontFamily: "Rubik_400Regular",
                }}
              >
                Details
              </Text>
              
            </View>
            <View style={{ backgroundColor: "white", padding: 20 }}>
            
            <View style={{
                flexDirection:'column'
              }}>
              {/* <Fontisto
                name="quote-a-right"
                size={8}
                style={{
                 color:"#FF8F0F",
                }}
             /> */}
              
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(130, 130, 130, 1)",
                  textAlign: "center",
                  paddingLeft:10,
                  paddingRight:10,
                  fontFamily: "Rubik_400Regular",
                }}
                selectable={false}
              >
                 {details.detail}
              </Text>
              {/* <Fontisto
                name="quote-a-left"
                size={8}
                style={{
                 color:"#FF8F0F",
                 alignSelf:'flex-end'
                }}
             /> */}
              
              </View>
               



               <View
                style={{
                  width: 274,
                  height: 274,
                  borderRadius: 8,
                  marginVertical: 30,
                  alignSelf:'center'
                }}
              > 

                <Image
                     source={{ uri: details.detailImage }}
                     style={{ flex: 1 }}
                     resizeMode="cover"
                /> 
               </View> 



              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => setDisplayDetails(false)}
                  style={{
                    borderRadius: 100,
                    paddingVertical: 15,
                    backgroundColor: "#FF8F0F",
                    paddingHorizontal: 40,
                    marginLeft: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      fontFamily: "Rubik_400Regular",
                    }}
                  >
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      {mcqs.length !== 0 && (
        <Pagination
          {...props}
          subjectid={props.route.params.subjectid}
          chapterid={props.route.params.chapterid}
          subjectName={props.route.params.subjectName}
          chapterName={props.route.params.chapterName}
          chapterDescription={props.route.params.chapterDescription}
          updatePage={preupdatePage}
          page={page}
          setPage={setPage}
        />
      )}
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(MCQs);
