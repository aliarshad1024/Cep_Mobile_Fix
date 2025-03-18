import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import { connect } from "react-redux";
const ModalAlert = ({
 title,
    message,
  show,
  setShow,
  navigation,
  navigateTo,
  clearMessage,
  auth
}) => {
  return (
    <View>
      <Modal
        isVisible={show}
        onBackdropPress={() => setShow(false)}
        backdropOpacity={0.5}
        style={{ margin: 20, borderRadius: 8 }}
      >
        <View style={{ flex: 1, justifyContent: "center", borderRadius: 8 }}>
          <View
            style={{
              backgroundColor: auth.themeMainColor,
              paddingVertical: 20,
            }}
          ></View>

          <View style={{ backgroundColor: "#FFFF", padding: 20 }}>
            {title && 
             <Text
             style={{
               fontSize: 18,
               color: "black",
               fontWeight:500,
               marginBottom:40,
               textAlign: "center",
               fontFamily: "Rubik_400Regular",
             }}
             selectable={false}
           >
             {title}
           </Text>
            }
            <Text
              style={{
                fontSize: 16,
                color: "black",
                textAlign: "center",
                fontFamily: "Rubik_400Regular",
              }}
              selectable={false}
            >
              {message}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  clearMessage();
                  navigation.navigate(navigateTo);
                  setShow(false);
                }}
                style={{
                  backgroundColor: "#FF8F0F",
                  borderRadius: 100,
                  paddingVertical: 15,
                  paddingHorizontal: 40,
                  marginLeft: 10,
                  marginTop: 30,
                }}
              >
                <Text
                  style={{
                    color: "#FFFF",
                    fontSize: 14,
                    fontFamily: "Rubik_400Regular",
                  }}
                >
                  Ok
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ModalAlert);


