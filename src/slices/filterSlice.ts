import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { logoutUser } from "./authSlice"; // 1. Импортируем действие выхода

interface FilterState {
  searchTerm: string;
}

const initialState: FilterState = {
  searchTerm: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.searchTerm = "";
    });
  },
});

export const { setSearchTerm } = filterSlice.actions;

export const selectSearchTerm = (state: { filter: FilterState }) =>
  state.filter.searchTerm;

export default filterSlice.reducer;
