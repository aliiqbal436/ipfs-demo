import {
    UPLOAD_FILE
  } from "../actions/actionTypes";
   
  const initialState = {
    value: 0,
    loading: null,
    error: null,
  };
   
  const fileReducers = (state = initialState, action) => {
    switch (action.type) {
      case UPLOAD_FILE:
        return {
          ...state,
          value: state.value + 1,
          loading: false,
          error: null,
        };

      default:
        return state;
    }
  };
   
  export default fileReducers;