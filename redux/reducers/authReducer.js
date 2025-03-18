import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  NO_MORE_NOTIFICATIONS,
  CLEAR_MESSAGE,
  UPDATE_PROFILE_IMAGE,
  WELCOME_PAGE_SEEN,
  ADD_PHONE_NUMBER,
  UPDATE_USER,
  CHANGE_THEME_COLOR,
  SHUFFLE_LOGIN,
  CHANGE_REWARD,
  REWARD_BACK
} from "../Types";

const initialState = {
  token: null,
  isAuthenticated: false,
  user: {},
  msg: "",
  picture: null,
  notifications: [],
  welcomePageSeen: false,
  newNotification: false,
  themeMainColor: "#0E81B4",
  themeSecondaryColor: "#FF8F0F",
  rewardedShown:false
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
     console.log("LOGIN_SUCCESS "+JSON.stringify(action.payload))  
     return {
        ...state,
        isAuthenticated:true,
        msg:action.payload.message,
        token:action.payload.access_token,
        user:action.payload.data,
        picture:action.payload.picture
      }
    case REGISTER_SUCCESS:
     console.log("REGISTER_SUCCESS "+JSON.stringify(action.payload))  
      return {
        ...state,
        user: action.payload.data,
        picture: action.payload.picture,
        token: action.payload.access_token,
        isAuthenticated: true,
        msg: action.payload.message,
      };
    case LOGIN_FAIL:
      console.log("LOGIN_FAIL "+JSON.stringify(action.payload))  
    
    case REGISTER_FAIL:
      console.log("REGISTER_FAIL "+JSON.stringify(action.payload))  
    
    case LOGOUT_SUCCESS:
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        msg: action.payload,
        picture: null,
      };
    case CHANGE_REWARD:
      console.log("inputing rewarded")
      return {
        ...state,
        rewardedShown:true
      } 
    case REWARD_BACK:
      console.log("inputing rewarded")
      return {
        ...state,
        rewardedShown:false
      }   
    case CHANGE_THEME_COLOR:
      return {
        ...state,
        themeMainColor: action.payload.mainColor,
        themeSecondaryColor: action.payload.secondaryColor,
        welcomePageSeen:true
      };

    // case NEW_NOTIFICATION:
    //   return {
    //     ...state,
    //     newNotification: action.payload,
    //   };
    // case GET_NOTIFICATIONS:
    //   return {
    //     ...state,
    //     notifications: action.payload,
    //   };
    // case ADD_NOTIFICATIONS:
    //   return {
    //     ...state,
    //     notifications: [...state.notifications, ...action.payload],
    //     msg: "",
    //   };
    case NO_MORE_NOTIFICATIONS:
      return {
        ...state,
        msg: "No More Notifications",
      };
    case SHUFFLE_LOGIN:
        console.log("Shuffle Login")
        return {
          ...state,
          isAuthenticated:false,
        };  
    case UPDATE_USER:
      console.log("UPDATE_USER "+JSON.stringify(action.payload))  
   
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
        msg: "User updated",
      };
    case ADD_PHONE_NUMBER:
      return {
        ...state,
        user: { ...state.user, contact: action.payload },
        msg: "Updated Successfully",
      };
    case UPDATE_PROFILE_IMAGE:
      return {
        ...state,
        picture: action.payload,
        msg: "DP updated",
      };
    case WELCOME_PAGE_SEEN:
      return {
        ...state,
        welcomePageSeen: true,
      };
    case CLEAR_MESSAGE:
      return {
        ...state,
        msg: null,
      };
    default:
      return state;
  }
}
