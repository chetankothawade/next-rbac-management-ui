// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

/** Admin roles */
const adminRoles = ["admin", "super_admin", "editor"];

/** Select prefix based on role */
const prefixForRole = (role) =>
  adminRoles.includes(role) ? "admin" : "client";

/** Safe JSON parse */
const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

/** Load auth from localStorage */
const getAuthFromStorage = (prefix) => ({
  user:
    typeof window !== "undefined"
      ? safeParse(localStorage.getItem(`${prefix}_user`))
      : null,
  token:
    typeof window !== "undefined"
      ? localStorage.getItem(`${prefix}_auth_token`)
      : null,
  role:
    typeof window !== "undefined"
      ? localStorage.getItem(`${prefix}_role`)
      : null,
  isAuth:
    typeof window !== "undefined"
      ? localStorage.getItem(`${prefix}_is_auth`) === "true"
      : false,
});

/** Initial State */
const initialState = {
  admin: getAuthFromStorage("admin"),
  user: getAuthFromStorage("client"),
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    /** 🔥 Called when app boots to load auth from LS */
    initAuth: (state) => {
      state.admin = getAuthFromStorage("admin");
      state.user = getAuthFromStorage("client");
      state.loading = false;
    },

    /** Login successful */
    loginSuccess: (state, action) => {
      const { user, token, role } = action.payload;
      const prefix = prefixForRole(role);
      const target = prefix === "admin" ? state.admin : state.user;

      target.user = user;
      target.role = role;
      target.isAuth = true;

      // ✅ Only update token if explicitly provided
      if (token) {
        target.token = token;
        localStorage.setItem(`${prefix}_auth_token`, token);
      }

      localStorage.setItem(`${prefix}_user`, JSON.stringify(user));
      localStorage.setItem(`${prefix}_role`, role);
      localStorage.setItem(`${prefix}_is_auth`, "true");

      state.loading = false;
    },

    /** Logout */
    logout: (state, action) => {
      const role = action.payload.role;
      const prefix = prefixForRole(role);

      const target = prefix === "admin" ? state.admin : state.user;

      target.user = null;
      target.token = null;
      target.role = null;
      target.isAuth = false;

      localStorage.removeItem(`${prefix}_user`);
      localStorage.removeItem(`${prefix}_auth_token`);
      localStorage.removeItem(`${prefix}_role`);
      localStorage.removeItem(`${prefix}_is_auth`);

      state.loading = false;
    },
  },
});

export const { initAuth, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
