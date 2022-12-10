import { createSlice } from "@reduxjs/toolkit";
type stateRoleType = {
  viewpointCollection: any;
  loading: boolean;
  loadingGetById: boolean;
  currentViewpointCollection: any;
  errorCreateCollection: any;
};
const initialState: stateRoleType = {
  viewpointCollection: null,
  loading: false,
  loadingGetById: false,
  currentViewpointCollection: null,
  errorCreateCollection: null,
};

const viewpointCollectionSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getAllViewpointCollection(state, action) {
      // TODO: reducer for pending login action
      state.loading = true;
    },
    getAllViewpointCollectionSuccess(state, action) {
      state.viewpointCollection = action.payload;
      state.loading = false;
    },
    getAllViewpointCollectionError(state) {
      state.loading = false;
    },
    getViewpointCollectionById(state, action) {
      // TODO: reducer for pending login action
      state.loadingGetById = true;
    },
    getViewpointCollectionByIdSuccess(state, action) {
      state.currentViewpointCollection = action.payload.data;
      state.loadingGetById = false;
    },
    getViewpointCollectionByIdError(state) {
      state.loadingGetById = false;
    },
    deleteCollection(state, action) {
      state.loading = false;
    },
    cloneCollection(state, action) {
      state.loading = true;
    },
    cloneCollectionSuccess(state, action) {
      state.loading = false;
    },
    cloneCollectionError(state, action) {
      state.loading = false;
    },
    createViewpointCollection(state, action) {
      state.loading = true;
    },
    createViewpointCollectionSuccess(state, action) {
      state.loading = false;
    },
    createViewpointCollectionError(state, action) {
      state.loading = false;
      state.errorCreateCollection = action.payload;
    },
  },
});

const { actions, reducer } = viewpointCollectionSlice;

export {
  actions as viewpointCollectionActions,
  reducer as viewpointCollectionReducer,
};
