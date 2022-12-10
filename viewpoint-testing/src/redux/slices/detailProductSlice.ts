import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  resultSearch: [],
  loadingSearch: false,
};

const detailProductSlice = createSlice({
  name: "detailProduct",
  initialState,
  reducers: {
    searchProduct(state, action) {
      state.loadingSearch = true;
    },
    searchProductSuccess(state, action) {
      state.resultSearch = action.payload;
      state.loadingSearch = false;
    },
    searchProductFailed(state) {
      state.loadingSearch = false;
    },
  },
});

const { actions, reducer } = detailProductSlice;

export { actions as detailProductActions, reducer as detailProductReducer };
