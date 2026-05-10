import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      // ✅ This saves the token so API interceptor can find it
      localStorage.setItem("fittrack-app-token", action.payload.token);
    },
    logout: (state) => {
      state.currentUser = null;
      // ✅ FIXED: was "fitttrack" (3 t's) — token was never actually cleared
      localStorage.removeItem("fittrack-app-token");
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;