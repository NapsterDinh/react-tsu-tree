import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  resultSearch: [],
  loadingSearch: false,
};

const detailViewpointSlice = createSlice({
  name: "detailViewpoint",
  initialState,
  reducers: {
    searchViewpoint(state, action) {
      state.loadingSearch = true;
    },
    searchViewpointSuccess(state, action) {
      state.resultSearch = action.payload;
      state.loadingSearch = false;
    },
    searchViewpointFailed(state) {
      state.loadingSearch = false;
    },
  },
});

const { actions, reducer } = detailViewpointSlice;

export { actions as detailViewpointActions, reducer as detailViewpointReducer };
