import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
const ProgressBar = ({progress,auth}) => {

  return (
    <View style={styles.container}>
      <View style={ { width: `${progress * 100}%`,

    height: "100%",
    backgroundColor: auth.themeMainColor,
    borderRadius: 20,
    }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 10,
    backgroundColor: "black",
    borderRadius: 20,
  },
  bar: {
   
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ProgressBar);



