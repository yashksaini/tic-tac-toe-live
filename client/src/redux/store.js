import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./userAuthentication";
export default configureStore({
  reducer: {
    userAuth: userAuthReducer,
  },
});
