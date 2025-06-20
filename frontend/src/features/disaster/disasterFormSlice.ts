
// // 2. disasterFormSlice.ts
// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
// import { RootState } from "@/app/store";

// interface AuditEntry {
//   action: string;
//   user_id: string;
//   timestamp: string;
// }

// interface DisasterFormState {
//   title: string;
//   locationName: string;
//   description: string;
//   tags: string[];
//   priority: string;
//   location: string;
//   owner_id: string;
//   audit_trail: AuditEntry[];
//   currentTag: string;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: DisasterFormState = {
//   title: "",
//   locationName: "",
//   description: "",
//   tags: [],
//   priority: "medium",
//   location: "",
//   owner_id: "netrunnerX",
//   audit_trail: [],
//   currentTag: "",
//   loading: false,
//   error: null,
// };

// export const createDisaster = createAsyncThunk<
//   any,
//   void,
//   { state: RootState; rejectValue: string }
// >("disasterForm/createDisaster", async (_, thunkAPI) => {
//   try {
//     const state = thunkAPI.getState().disasterForm;
//     const now = new Date().toISOString();

//     const payload = {
//       id: crypto.randomUUID(),
//       title: state.title,
//       location_name: state.locationName,
//       location: state.location || "POINT(0 0)",
//       description: state.description,
//       tags: state.tags,
//       owner_id: state.owner_id,
//       created_at: now,
//       audit_trail: [
//         {
//           action: "create",
//           user_id: state.owner_id,
//           timestamp: now,
//         },
//       ],
//       priority: state.priority,
      
//     };

//     const res = await axios.post("http://localhost:8000/api/disasters", payload);
//     return res.data;
//   } catch (err: any) {
//     return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
//   }
// });

// const disasterFormSlice = createSlice({
//   name: "disasterForm",
//   initialState,
//   reducers: {
//     updateField: (state, action: PayloadAction<{ field: string; value: any }>) => {
//       (state as any)[action.payload.field] = action.payload.value;
//     },
//     addTag: (state, action: PayloadAction<string>) => {
//       const tag = action.payload.trim();
//       if (tag && !state.tags.includes(tag)) {
//         state.tags.push(tag);
//       }
//     },
//     removeTag: (state, action: PayloadAction<string>) => {
//       state.tags = state.tags.filter((tag) => tag !== action.payload);
//     },
//     setCurrentTag: (state, action: PayloadAction<string>) => {
//       state.currentTag = action.payload;
//     },
//     resetForm: () => initialState,
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createDisaster.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createDisaster.fulfilled, () => {
//         return initialState;
//       })
//       .addCase(createDisaster.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to create disaster";
//       });
//   },
// });

// export const {
//   updateField,
//   addTag,
//   removeTag,
//   resetForm,
//   setCurrentTag,
// } = disasterFormSlice.actions;
// export default disasterFormSlice.reducer;

// 2. disasterFormSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/app/store";

interface AuditEntry {
  action: string;
  user_id: string;
  timestamp: string;
}

interface DisasterFormState {
  title: string;
  locationName: string;
  description: string;
  tags: string[];
  priority: string;
  location: string;
  owner_id: string;
  audit_trail: AuditEntry[];
  currentTag: string;
  loading: boolean;
  error: string | null;
}

const initialState: DisasterFormState = {
  title: "",
  locationName: "",
  description: "",
  tags: [],
  priority: "medium",
  location: "",
  owner_id: "netrunnerX",
  audit_trail: [],
  currentTag: "",
  loading: false,
  error: null,
};

export const createDisaster = createAsyncThunk<
  any,
  void,
  { state: RootState; rejectValue: string }
>("disasterForm/createDisaster", async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const disasterForm = state.disasterForm;
    const token = state.auth.token; // ← 🔐 token from auth slice
    const now = new Date().toISOString();

    const payload = {
      id: crypto.randomUUID(),
      title: disasterForm.title,
      location_name: disasterForm.locationName,
      location: disasterForm.location || "POINT(0 0)",
      description: disasterForm.description,
      tags: disasterForm.tags,
      owner_id: disasterForm.owner_id,
      created_at: now,
      audit_trail: [
        {
          action: "create",
          user_id: disasterForm.owner_id,
          timestamp: now,
        },
      ],
      priority: disasterForm.priority,
    };

    const res = await axios.post("http://localhost:8000/api/disasters", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
  }
});

const disasterFormSlice = createSlice({
  name: "disasterForm",
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      (state as any)[action.payload.field] = action.payload.value;
    },
    addTag: (state, action: PayloadAction<string>) => {
      const tag = action.payload.trim();
      if (tag && !state.tags.includes(tag)) {
        state.tags.push(tag);
      }
    },
    removeTag: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter((tag) => tag !== action.payload);
    },
    setCurrentTag: (state, action: PayloadAction<string>) => {
      state.currentTag = action.payload;
    },
    resetForm: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDisaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDisaster.fulfilled, () => {
        return initialState;
      })
      .addCase(createDisaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create disaster";
      });
  },
});

export const {
  updateField,
  addTag,
  removeTag,
  resetForm,
  setCurrentTag,
} = disasterFormSlice.actions;

export default disasterFormSlice.reducer;
