import { createSlice } from "@reduxjs/toolkit";
type stateRoleType = {
  products: any;
  loading: boolean;
  loadingGetById: boolean;
  loadingSearch: boolean;
  currentProduct: any;
  resultSearch: any;
};
const initialState: stateRoleType = {
  products: [],
  loading: false,
  loadingGetById: false,
  loadingSearch: false,
  currentProduct: null,
  resultSearch: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    getAllProduct(state, action) {
      // TODO: reducer for pending login action
      state.loading = true;
    },
    getAllProductSuccess(state, action) {
      state.products = action.payload;
      state.loading = false;
    },
    getAllProductError(state) {
      state.loading = false;
    },
    getProductById(state, action) {
      // TODO: reducer for pending login action
      state.loadingGetById = true;
    },
    getProductByIdSuccess(state, action) {
      state.currentProduct = action.payload.data;
      state.loadingGetById = false;
    },
    getProductByIdError(state) {
      state.loadingGetById = false;
    },
    deleteProduct(state, action) {
      state.loading = false;
    },
    cloneProduct(state, action) {
      state.loading = true;
    },
    cloneProductSuccess(state, action) {
      state.loading = false;
    },
    cloneProductError(state, action) {
      state.loading = false;
    },
    createProduct(state, action) {
      state.loading = true;
    },
    createProductSuccess(state, action) {
      state.loading = false;
    },
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

const { actions, reducer } = productSlice;

export { actions as productActions, reducer as productReducer };
