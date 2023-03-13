import { combineReducers } from "redux";
import fileReducers from "./fileReducers";
 
const allReducers = combineReducers({
    fileReducers,
});
 
export default allReducers;