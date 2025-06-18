import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface UserState {
  username: string | null;
  role: "admin" | "contributor" | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  username: null,
  role: null,
  loading: false,
  error: null,
};

// 🔁 Async thunk for login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (
    { username, password }: { username: string; password: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", {
        username,
        password,
      });

      return response.data; // { token, user: { username, role } }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || "Login failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.username = null;
      state.role = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.user.username;
        state.role = action.payload.user.role;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
