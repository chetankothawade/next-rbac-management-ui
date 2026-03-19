// src/redux/accessSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/http";

export const fetchAccess = createAsyncThunk(
  "access/fetchAccess",
  async (userUuid, { rejectWithValue }) => {
    try {
      if (!userUuid) {
        return rejectWithValue("User UUID is required.");
      }

      const response = await http.get(`user-permissions/${userUuid}/module-access`);
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
    list: {},        // final permissions
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

        // Extract only the permission matrix (action.payload.data)
        state.list = action.payload?.data || {};
      })

      .addCase(fetchAccess.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.error = action.payload || action.error?.message || "Something went wrong";
        state.list = {};
      });
  },
});

export default accessSlice.reducer;
