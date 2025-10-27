import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import * as api from "../api/api";

interface User {
  id: string;
  login: string;
  isModerator: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const getUserFromToken = (token: string | null): User | null => {
  if (!token) return null;
  try {
    const decoded: { login: string; is_moderator: boolean; user_id: string } =
      jwtDecode(token);
    return {
      id: decoded.user_id,
      login: decoded.login,
      isModerator: decoded.is_moderator,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const token = localStorage.getItem("jwt_token");

const initialState: AuthState = {
  user: getUserFromToken(token),
  token: token,
  isAuthenticated: !!token,
  status: "idle",
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: api.UserCredentials, { rejectWithValue }) => {
    try {
      const data = await api.login(credentials);
      localStorage.setItem("jwt_token", data.token);
      return data.token;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return rejectWithValue("Неверный логин или пароль");
      }
      return rejectWithValue(
        error.response?.data?.description || "Ошибка входа"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials: api.UserCredentials, { dispatch, rejectWithValue }) => {
    try {
      await api.register(credentials);
      await dispatch(loginUser(credentials));
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.description || "Ошибка регистрации"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.logout();
      localStorage.removeItem("jwt_token");
    } catch (error: any) {
      localStorage.removeItem("jwt_token");
      return rejectWithValue("Logout failed on server but cleared locally");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await api.getProfile(id);
      return data;
    } catch (error: any) {
      return rejectWithValue("Не удалось загрузить профиль");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (payload: api.UpdateProfilePayload, { rejectWithValue }) => {
    try {
      await api.updateProfile(payload);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.description || "Не удалось обновить профиль"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.token = action.payload;
        state.isAuthenticated = true;
        state.user = getUserFromToken(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = "idle";
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<api.UserProfile>) => {
          if (state.user) {
            state.user.login = action.payload.login;
            state.user.isModerator = action.payload.isModerator;
          }
        }
      )
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAuthStatus = (state: { auth: AuthState }) =>
  state.auth.status;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;
