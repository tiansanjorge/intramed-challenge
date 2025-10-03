// src/store/searchSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchText: string;
}

const initialState: SearchState = { searchText: "" };

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    resetSearch: (state) => {
      state.searchText = "";
    },
  },
});

export const { setSearchText, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
