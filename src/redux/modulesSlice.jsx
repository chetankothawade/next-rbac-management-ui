import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/http";

const getAuthToken = (state) =>
  state.auth?.admin?.token || state.auth?.user?.token || null;

export const fetchModules = createAsyncThunk(
  "modules/fetchModules",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState());
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined;

      const res = await http.get("user-permissions/side-menu", config);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch side menu"
      );
    }
  }
);

const modulesSlice = createSlice({
  name: "modules",
  initialState: {
    list: [],
    loading: false,
    loaded: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchModules.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.list = action.payload?.data || [];
      })

      .addCase(fetchModules.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.error = action.payload || action.error.message;
        state.list = [];
      });
  },
});

export default modulesSlice.reducer;
