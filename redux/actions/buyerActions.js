import { CLEAR_MSG_ERROR, CLEAR_MESSAGE } from "../Types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../utils/URL";

export const clearMsgError = () => (dispatch) => {
  dispatch({
    type: CLEAR_MSG_ERROR,
  });
};

export const clearMessage = () => (dispatch) => {
  dispatch({
    type: CLEAR_MESSAGE,
  });
};
