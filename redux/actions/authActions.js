import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  UPDATE_PROFILE_NAME,
  UPDATE_PROFILE_IMAGE,
  WELCOME_PAGE_SEEN,
  NEW_NOTIFICATION,
  NO_MORE_NOTIFICATIONS,
  ADD_NOTIFICATIONS,
  CLEAR_MESSAGE,
  UPDATE_USER,
  CHANGE_THEME_COLOR,
  SHUFFLE_LOGIN
} from "../Types";
import { returnErrors } from "./errorActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../constants/global";

// import registerForPushNotifications from "../../Constants/registerForPushNotifications";





export const login = (data) => (dispatch) => {
  const searchParams = new URLSearchParams();
  for (const key in data) {
    searchParams.append(key, data[key]);
  }

  fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: searchParams.toString(),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Login response : " + JSON.stringify(data));

      if (data.message === "Login successful") {
        console.log("User token:", data.access_token); // 👈 ADD THIS LINE

        if (data.data.displaypicture) {
          // Fetch picture only if displaypicture exists
          let dataForImage = {
            filename: data.data.displaypicture,
            signupmethod: data.data.signupmethod || "email",
          };

          const searchParams = new URLSearchParams();
          for (const key in dataForImage) {
            searchParams.append(key, dataForImage[key]);
          }

          fetch(`${baseUrl}/api/user/picture/`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${data.access_token}`,
            },
            body: searchParams.toString(),
          })
            .then((response) => response.json())
            .then((resp) => {
              if (resp.data && resp.data.filename && resp.data.image) {
                let picture = `data:image/${resp.data.filename
                  .split(".")
                  .pop()};base64,${resp.data.image}`;
                dispatch({
                  type: LOGIN_SUCCESS,
                  payload: { ...data, picture },
                });
              } else {
                console.log("Invalid image response, setting picture to null");
                dispatch({
                  type: LOGIN_SUCCESS,
                  payload: { ...data, picture: null },
                });
              }
            })
            .catch((e) => {
              console.log("ERROR in image fetch", e);
              dispatch({
                type: LOGIN_SUCCESS,
                payload: { ...data, picture: null },
              });
            });
        } else {
          // No picture, dispatch login success directly
          dispatch({
            type: LOGIN_SUCCESS,
            payload: { ...data, picture: null },
          });
        }
      } else {
        dispatch({
          type: LOGIN_FAIL,
          payload: data.message,
        });
      }
    })
    .catch(() => {
      dispatch(returnErrors({ error: { error: "Network Error" } }));
      dispatch({ type: REGISTER_FAIL });
    });
};



export const logout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};

export const welcomePageSeen = () => {
  return {
    type: WELCOME_PAGE_SEEN,
  };
};

export const changeThemeColor = (data) => {
  return {
    type: CHANGE_THEME_COLOR,
    payload: data,
  };
};

export const signup = (data) => (dispatch) => {
  fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.msg === "Signup Successfully") {
        registerForPushNotifications(data.data);
        dispatch({
          type: REGISTER_SUCCESS,
          payload: data,
        });
      } else {
        dispatch(returnErrors({ error: { error: data.error } }));
        dispatch({ type: REGISTER_FAIL });
      }
    })
    .catch(() => {
      dispatch(returnErrors({ error: { error: "Network Error" } }));
      dispatch({ type: REGISTER_FAIL });
    });
};

export const updateUser = (data, access_token) => (dispatch) => {
  const searchParams = new URLSearchParams();
  for (const key in data) {
    searchParams.append(key, data[key]);
  }
  fetch(`${baseUrl}/api/updateuser`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token}`,
    },
    body: searchParams.toString(),
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.status === "success") {
        // registerForPushNotifications(data.data);
        dispatch({
          type: UPDATE_USER,
          payload: data,
        });
      }
    })
    .catch((e) => {
      console.log("ERROR", e);
      // dispatch(returnErrors({ error: { error: "Network Error" } }));
      // dispatch({ type: REGISTER_FAIL });
    });
};

export const updateDP = (picture, userid, access_token) => (dispatch) => {
  let formData = new FormData();
  formData.append("picture", picture);
  formData.append("userid", userid);
  fetch(`${baseUrl}/api/uploadpicture`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${access_token}`,
    },
    body: formData,
  });
  dispatch({
    type: UPDATE_PROFILE_IMAGE,
    payload: picture,
  });
  // .then((res) => res.json())
  // .then((response) => {
  //   console.log(response.status);
  //   if (response.status === "success") {
  //     // registerForPushNotifications(data.data);

  //   }
  // })
  // .catch((e) => {
  //   console.log("Error", e);
  // });
};

export const newNotification = (newNotification) => async (dispatch) => {
  dispatch({
    type: NEW_NOTIFICATION,
    payload: newNotification,
  });
};

export const clearMessage = () => async (dispatch) => {
  dispatch({
    type: CLEAR_MESSAGE,
  });
};

export const rewardedShown = () =>async(dispatch) => {
  dispatch({
    type: CHANGE_REWARD
  }); 
}

export const rewardedNot = () =>async(dispatch) => {
  dispatch({
    type: REWARD_BACK
  }); 
}



export const shufflelogin = () => async (dispatch) => {
  dispatch({
    type: SHUFFLE_LOGIN,
  });
};