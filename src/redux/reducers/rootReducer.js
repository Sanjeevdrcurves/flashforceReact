import { combineReducers } from "redux";
import { AuthReducer } from "./AuthReducer";
import { PlanReducer } from "./planReducer";


const rootReducer = combineReducers({
    AuthReducerKey: AuthReducer,
    PlanReducer:PlanReducer
    
  });
  
  export default rootReducer;