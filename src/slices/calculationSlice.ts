import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/api";
import { logoutUser } from "./authSlice";

interface CartInfo {
  id: number | null;
  reactions_count: number;
  cart_icon?: string;
}

interface CalculationState {
  draftInfo: CartInfo;
  cartStatus: "idle" | "loading" | "succeeded" | "failed";
  currentCalculation: api.MassCalculationDetails | null;
  history: api.MassCalculationInList[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  loadingReactionId: number | null;
}

const initialState: CalculationState = {
  draftInfo: { id: null, reactions_count: 0 },
  cartStatus: "idle",
  currentCalculation: null,
  history: [],
  status: "idle",
  error: null,
  loadingReactionId: null,
};

export const fetchDraftInfo = createAsyncThunk(
  "calculations/fetchDraftInfo",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getCartInfo();
      return data.id === -1 ? { ...data, id: null } : data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch draft info");
    }
  }
);

export const addToDraft = createAsyncThunk(
  "calculations/addToDraft",
  async (reactionId: number, { rejectWithValue }) => {
    try {
      await api.addReactionToDraft(reactionId);
      const data = await api.getCartInfo();
      return data.id === -1 ? { ...data, id: null } : data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.description || "Не удалось добавить в расчет"
      );
    }
  }
);

export const fetchCalculationDetails = createAsyncThunk(
  "calculations/fetchCalculationDetails",
  async (calculationId: number, { rejectWithValue }) => {
    try {
      const data = await api.fetchCalculationById(calculationId);
      return data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch calculation details");
    }
  }
);

export const fetchHistory = createAsyncThunk(
  "calculations/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.fetchCalculationsHistory();
      return data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch history");
    }
  }
);

export const removeFromDraft = createAsyncThunk(
  "calculations/removeFromDraft",
  async (
    params: { calculationId: number; reactionId: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await api.removeReactionFromDraft(
        params.calculationId,
        params.reactionId
      );
      dispatch(fetchDraftInfo());
      dispatch(fetchCalculationDetails(params.calculationId));
    } catch (error: any) {
      return rejectWithValue("Failed to remove item from draft");
    }
  }
);

export const confirmCalculation = createAsyncThunk(
  "calculations/confirmCalculation",
  async (calculationId: number, { dispatch, rejectWithValue }) => {
    try {
      await api.confirmDraft(calculationId);
      dispatch(fetchDraftInfo());
    } catch (error: any) {
      return rejectWithValue("Failed to confirm calculation");
    }
  }
);

export const updateMass = createAsyncThunk(
  "calculations/updateMass",
  async (payload: api.UpdateMassPayload, { rejectWithValue }) => {
    try {
      await api.updateReactionMass(payload);
      return payload;
    } catch (error: any) {
      return rejectWithValue("Failed to update mass");
    }
  }
);

const calculationSlice = createSlice({
  name: "calculations",
  initialState,
  reducers: {
    clearCurrentCalculation: (state) => {
      state.currentCalculation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDraftInfo.pending, (state) => {
        state.cartStatus = "loading";
      })
      .addCase(
        fetchDraftInfo.fulfilled,
        (state, action: PayloadAction<CartInfo>) => {
          state.cartStatus = "succeeded";
          state.draftInfo = action.payload;
        }
      )
      .addCase(fetchDraftInfo.rejected, (state) => {
        state.cartStatus = "failed";
      })
      .addCase(addToDraft.pending, (state, action) => {
        state.loadingReactionId = action.meta.arg;
        state.error = null;
      })
      .addCase(
        addToDraft.fulfilled,
        (state, action: PayloadAction<CartInfo>) => {
          state.draftInfo = action.payload;
          state.loadingReactionId = null;
        }
      )
      .addCase(addToDraft.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.loadingReactionId = null;
      })
      .addCase(fetchCalculationDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCalculationDetails.fulfilled,
        (state, action: PayloadAction<api.MassCalculationDetails>) => {
          state.status = "succeeded";
          state.currentCalculation = action.payload;
        }
      )
      .addCase(fetchCalculationDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchHistory.fulfilled,
        (state, action: PayloadAction<api.MassCalculationInList[]>) => {
          state.status = "succeeded";
          state.history = action.payload;
        }
      )
      .addCase(fetchHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(
        updateMass.fulfilled,
        (state, action: PayloadAction<api.UpdateMassPayload>) => {
          if (state.currentCalculation) {
            const { reactionId, output_mass } = action.payload;
            const reactionIndex = state.currentCalculation.reactions.findIndex(
              (r) => r.reaction.id === reactionId
            );
            if (reactionIndex !== -1) {
              state.currentCalculation.reactions[reactionIndex].output_mass =
                output_mass;
            }
          }
        }
      )
      .addCase(confirmCalculation.fulfilled, (state) => {
        state.currentCalculation = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.draftInfo = { id: null, reactions_count: 0 };
        state.cartStatus = "idle";
        state.currentCalculation = null;
        state.history = [];
        state.status = "idle";
        state.error = null;
        state.loadingReactionId = null;
      });
  },
});

export const { clearCurrentCalculation } = calculationSlice.actions;

export const selectDraftInfo = (state: { calculations: CalculationState }) =>
  state.calculations.draftInfo;
export const selectCartStatus = (state: { calculations: CalculationState }) =>
  state.calculations.cartStatus;
export const selectCurrentCalculation = (state: {
  calculations: CalculationState;
}) => state.calculations.currentCalculation;
export const selectCalculationsHistory = (state: {
  calculations: CalculationState;
}) => state.calculations.history;
export const selectCalculationsStatus = (state: {
  calculations: CalculationState;
}) => state.calculations.status;
export const selectCalculationsError = (state: {
  calculations: CalculationState;
}) => state.calculations.error;
export const selectLoadingReactionId = (state: {
  calculations: CalculationState;
}) => state.calculations.loadingReactionId;

export default calculationSlice.reducer;
