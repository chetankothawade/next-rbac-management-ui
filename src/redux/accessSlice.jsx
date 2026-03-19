// src/redux/accessSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/http";

const getAuthToken = (state) =>
  state.auth?.admin?.token || state.auth?.user?.token || null;

export const fetchAccess = createAsyncThunk(
  "access/fetchAccess",
  async (userUuid, { getState, rejectWithValue }) => {
    try {
      if (!userUuid) {
        return rejectWithValue("User UUID is required.");
      }

      const token = getAuthToken(getState());
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined;

      const response = await http.get(
        `user-permissions/${userUuid}/module-access`,
        config
      );
      return response.data; // contains status, message, data
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch access permissions"
      );
    }
  }
);

const accessSlice = createSlice({
  name: "access",
  initialState: {
    list: {},          // permissions
    roleModules: [],   // ✅ role-based modules
    loading: false,
    loaded: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAccess.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;

        state.list = action.payload?.data?.permissions || {};
        state.roleModules = action.payload?.data?.roleModules || [];
      })

      .addCase(fetchAccess.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.error = action.payload || action.error?.message;
        state.list = {};
        state.roleModules = [];
      });
  },
});

export default accessSlice.reducer;
