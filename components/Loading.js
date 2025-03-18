import React, { Component } from "react";
import { ActivityIndicator, View } from "react-native";
import { connect } from "react-redux";
const Loading = (props) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
      <ActivityIndicator size="large" color={props.auth.themeMainColor} />
    </View>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Loading);
