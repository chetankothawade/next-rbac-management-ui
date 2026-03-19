import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import authReducer from "./authSlice";
import modulesReducer from "./modulesSlice";
import accessReducer from "./accessSlice";
// import otherReducer from "./otherSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  modules: modulesReducer,
  access: accessReducer,
  // other: otherReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;


