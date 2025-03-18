import { LOGOUT_SUCCESS, CLEAR_MESSAGE } from "../Types";

const initialState = {
  msg: "",
  error: null,
};

export default function buyerReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_MESSAGE:
      return {
        ...state,
        msg: null,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        order: [],
        msg: null,
        error: null,
      };
    default:
      return state;
  }
}
