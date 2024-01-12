import { createSlice } from "@reduxjs/toolkit";

export const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: {
    isAuth: false,
    fullName: "",
  },
  reducers: {
    changeAuthentication: (state, action) => {
      state.isAuth = action.payload.isAuth;
      state.fullName = action.payload.fullName;
    },
  },
});

export const { changeAuthentication } = userAuthSlice.actions;
export default userAuthSlice.reducer;
