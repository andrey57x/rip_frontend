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
  draftReactionIds: number[];
  cartStatus: "idle" | "loading" | "succeeded" | "failed";
  currentCalculation: api.MassCalculationDetails | null;
  history: api.MassCalculationInList[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  loadingReactionId: number | null;
  updatingMassReactionIds: number[];
}

const initialState: CalculationState = {
  draftInfo: { id: null, reactions_count: 0 },
  draftReactionIds: [],
  cartStatus: "idle",
  currentCalculation: null,
  history: [],
  status: "idle",
  error: null,
  loadingReactionId: null,
  updatingMassReactionIds: [],
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

export const fetchDraftReactionIds = createAsyncThunk(
  "calculations/fetchDraftReactionIds",
  async (draftId: number, { rejectWithValue }) => {
    try {
      const details = await api.fetchCalculationById(draftId);
      return details.reactions.map((item) => item.reaction.id);
    } catch (error) {
      return rejectWithValue("Failed to fetch draft items");
    }
  }
);

export const addToDraft = createAsyncThunk(
  "calculations/addToDraft",
  async (reactionId: number, { dispatch, rejectWithValue }) => {
    try {
      await api.addReactionToDraft(reactionId);
      const data = await api.getCartInfo();
      if (data.id && data.id !== -1) {
        dispatch(fetchDraftReactionIds(data.id));
      }
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
  async (filters: api.HistoryFilters | undefined, { rejectWithValue }) => {
    try {
      const data = await api.fetchCalculationsHistory(filters);
      return data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch history");
    }
  }
);

export const moderate = createAsyncThunk(
  "calculations/moderate",
  async (
    params: { id: number; status: "completed" | "rejected" },
    { rejectWithValue }
  ) => {
    try {
      const updatedCalculation = await api.moderateCalculation(
        params.id,
        params.status
      );
      return updatedCalculation;
    } catch (error: any) {
      return rejectWithValue("Moderation failed");
    }
  }
);

export const deleteDraft = createAsyncThunk(
  "calculations/deleteDraft",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.deleteCalculation(id);
    } catch (error: any) {
      return rejectWithValue("Failed to delete draft");
    }
  }
);

export const updateKoef = createAsyncThunk(
  "calculations/updateKoef",
  async (params: { id: number; output_koef: number }, { rejectWithValue }) => {
    try {
      await api.updateCalculationKoef(params.id, params.output_koef);
      return params.output_koef;
    } catch (error: any) {
      return rejectWithValue("Failed to update coefficient");
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
      return params.reactionId;
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
      .addCase(
        fetchDraftReactionIds.fulfilled,
        (state, action: PayloadAction<number[]>) => {
          state.draftReactionIds = action.payload;
        }
      )
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
      .addCase(
        removeFromDraft.fulfilled,
        (state, action: PayloadAction<number>) => {
          const removedId = action.payload;
          if (state.currentCalculation) {
            state.currentCalculation.reactions =
              state.currentCalculation.reactions.filter(
                (item) => item.reaction.id !== removedId
              );
          }
          state.draftReactionIds = state.draftReactionIds.filter(
            (id) => id !== removedId
          );
        }
      )
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
      .addCase(moderate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        moderate.fulfilled,
        (state, action: PayloadAction<api.MassCalculationInList>) => {
          state.status = "succeeded";
          if (state.currentCalculation) {
            state.currentCalculation.calculation.status = action.payload.status;
          }
        }
      )
      .addCase(moderate.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(deleteDraft.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteDraft.fulfilled, (state) => {
        state.status = "succeeded";
        state.currentCalculation = null;
        state.draftInfo = { id: null, reactions_count: 0 };
        state.draftReactionIds = [];
      })
      .addCase(deleteDraft.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateKoef.fulfilled, (state, action) => {
        if (state.currentCalculation) {
          state.currentCalculation.calculation.output_koef = action.payload;
        }
      })
      .addCase(updateMass.pending, (state, action) => {
        state.updatingMassReactionIds.push(action.meta.arg.reactionId);
      })
      .addCase(
        updateMass.fulfilled,
        (state, action: PayloadAction<api.UpdateMassPayload>) => {
          const { reactionId, output_mass } = action.payload;
          state.updatingMassReactionIds = state.updatingMassReactionIds.filter(
            (id) => id !== reactionId
          );
          if (state.currentCalculation) {
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
      .addCase(updateMass.rejected, (state, action) => {
        const { reactionId } = action.meta.arg;
        state.updatingMassReactionIds = state.updatingMassReactionIds.filter(
          (id) => id !== reactionId
        );
      })
      .addCase(confirmCalculation.fulfilled, (state) => {
        state.currentCalculation = null;
        state.draftReactionIds = [];
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.draftInfo = { id: null, reactions_count: 0 };
        state.cartStatus = "idle";
        state.currentCalculation = null;
        state.history = [];
        state.draftReactionIds = [];
        state.status = "idle";
        state.error = null;
        state.loadingReactionId = null;
        state.updatingMassReactionIds = [];
      });
  },
});

export const { clearCurrentCalculation } = calculationSlice.actions;

export const selectDraftInfo = (state: { calculations: CalculationState }) =>
  state.calculations.draftInfo;
export const selectDraftReactionIds = (state: {
  calculations: CalculationState;
}) => state.calculations.draftReactionIds;
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
export const selectUpdatingMassReactionIds = (state: {
  calculations: CalculationState;
}) => state.calculations.updatingMassReactionIds;

export default calculationSlice.reducer;
