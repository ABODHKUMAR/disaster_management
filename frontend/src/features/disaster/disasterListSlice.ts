

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { createDisaster } from "./disasterFormSlice";

export interface AuditEntry {
  action: string;
  user_id: string;
  timestamp: string;
}

export interface Disaster {
  id: string;
  title: string;
  location_name: string;
  location: string;
  description: string;
  tags: string[];
  owner_id: string;
  created_at: string;
  audit_trail: AuditEntry[];
}

interface DisasterListState {
  disasters: Disaster[];
  loading: boolean;
  error: string | null;
}

const initialState: DisasterListState = {
  disasters: [],
  loading: false,
  error: null,
};

// Assumes: state.auth.token exists
interface RootState {
  auth: {
    token: string | null;
  };
}

export const fetchDisasters = createAsyncThunk<
  Disaster[],
  void,
  { rejectValue: string }
>("disasterList/fetchDisasters", async (_, thunkAPI) => {
  try {
    const response = await axios.get("https://disaster-management-k7ux.vercel.app/api/disasters");
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
  }
});

export const updateDisaster = createAsyncThunk<
  Disaster,
  { id: string; data: Partial<Disaster> },
  { state: RootState; rejectValue: string }
>("disasterList/updateDisaster", async ({ id, data }, thunkAPI) => {
  const token = thunkAPI.getState().auth.token;

  try {
    const res = await axios.put(
      `https://disaster-management-k7ux.vercel.app/api/disasters/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
  }
});

export const deleteDisaster = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("disasterList/deleteDisaster", async (id, thunkAPI) => {
  const token = thunkAPI.getState().auth.token;

  try {
    await axios.delete(`https://disaster-management-k7ux.vercel.app/api/disasters/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return id;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
  }
});

const disasterListSlice = createSlice({
  name: "disasterList",
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDisasters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisasters.fulfilled, (state, action) => {
        state.disasters = action.payload;
        state.loading = false;
      })
      .addCase(fetchDisasters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch disasters";
      })
      .addCase(createDisaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDisaster.fulfilled, (state, action) => {
        state.disasters.push(action.payload);
        state.loading = false;
      })
      .addCase(createDisaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create disaster";
      })
      .addCase(updateDisaster.fulfilled, (state, action) => {
        const index = state.disasters.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.disasters[index] = action.payload;
        }
      })
      //pending and rejected cases for deleteDisaster can be added similarly
      .addCase(deleteDisaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDisaster.fulfilled, (state, action) => {
        state.disasters = state.disasters.filter((d) => d.id !== action.payload);
      })
      .addCase(deleteDisaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete disaster";
      });
  },
});

export default disasterListSlice.reducer;
