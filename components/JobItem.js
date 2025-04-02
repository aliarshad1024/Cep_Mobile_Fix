import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
// import { Feather } from "@expo/vector-icons";
// import { FontAwesome } from "@expo/vector-icons";

const JobItem = ({item, index, downloadingFileId ,setBookMark, delBookMark, loading, setDownloadingFileId, downloadFile }) => {

                              

  return (
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
                  >
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
                   // console.log("isBookMarker "+item.bookmarked)
                    if (item.bookmarked === 0) {
                      setBookMark(item.id);
                    } else {
                      delBookMark(item.id);
                    }
                    loading(true);
                  }}
                >
                  {/* {item.bookmarked === 0 ? (
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
                  )} */}
                </TouchableOpacity>
              </View>

              <View
                style={styles.secondaryContainer}
              >
                <View
                  style={styles.pdfContainer}
                >
                 
                  {/* <Image
                    source={require("../assets/icons/pdf.png")}
                    style={styles.imageIcon}
                  /> */}
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
                    downloadFile(item.path, item.path.split("/").pop());
                  }}
                  disabled={downloadingFileId === item.id}
                >
                  {/* {downloadingFileId === item.id ? (
                    <Image
                      source={require("../assets/icons/downloading.gif")}
                      style={styles.downloadContainer}
                    />
                  ) : (
                    <Feather
                      name="download"
                      size={26}
                      color="rgba(12, 229, 191, 1)"
                    />
                  )} */}
                </TouchableOpacity>
              </View>
            </View>
  );
};



export default JobItem;
