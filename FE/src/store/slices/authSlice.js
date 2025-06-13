import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const safeJwtDecode = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
const user = accessToken ? safeJwtDecode(accessToken)?.user : null;

const initialState = {
  user: user || null,
  access_token: accessToken,
  refresh_token: refreshToken,
  isAuthenticated: !!accessToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logIn: (state, action) => {
      const { access_token, refresh_token } = action.payload;

      state.access_token = access_token;
      state.refresh_token = refresh_token;
      
      const decoded = safeJwtDecode(access_token);
      state.user = decoded?.user;
      state.isAuthenticated = true;
      state.cartId = decoded?.cartId;

      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
      }
    },
    refreshUserToken: (state, action) => {
      const { access_token, refresh_token } = action.payload;
      
      state.access_token = access_token;
      if (refresh_token) {
        state.refresh_token = refresh_token;
      }
      
      const decoded = safeJwtDecode(access_token);
      state.user = decoded?.user;
      state.isAuthenticated = true;
      state.cartId = decoded?.cartId;
      
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", access_token);
        if (refresh_token) {
          localStorage.setItem("refresh_token", refresh_token);
        }
      }
    },
    logOut: (state) => {
      state.user = null;
      state.access_token = null;
      state.refresh_token = null;
      state.isAuthenticated = false;
      state.cartId = null;
      
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    },
    setAuthenticated: (state, action) => {
        state.isAuthenticated = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { logIn, logOut, refreshUserToken, setAuthenticated, setAddress, setUser } = authSlice.actions;
export default authSlice.reducer;