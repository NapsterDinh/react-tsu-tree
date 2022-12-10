import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loadingDomain: false,
  loadingUpdateDomain: false,
  isSuccess: null,
  dataSuccess: null,
  domain: [],
};

const domainSlice = createSlice({
  name: "domain",
  initialState,
  reducers: {
    getDomain(state) {
      state.loadingDomain = true;
    },
    getDomainSuccess(state, action) {
      state.domain = action.payload;
      state.loadingDomain = false;
    },
    getDomainFailed(state) {
      state.loadingDomain = false;
    },
    postDomain(state, action) {
      state.loadingDomain = true;
    },
    postDomainSuccess(state) {
      state.loadingDomain = false;
    },
    postDomainFailed(state) {
      state.loadingDomain = false;
    },
    updateDomain(state, action) {
      state.loadingUpdateDomain = true;
    },
    updateDomainSuccess(state) {
      state.loadingUpdateDomain = false;
    },
    updateDomainFailed(state) {
      state.loadingUpdateDomain = false;
    },
    updateDomainName(state, action) {
      state.loadingDomain = true;
    },
    updateDomainNameSuccess(state) {
      state.loadingDomain = false;
    },
    updateDomainNameFailed(state) {
      state.loadingDomain = false;
    },
    updateDomainParentId(state, action) {
      // state.loadingDomain = true;
    },
    updateDomainParentIdSuccess(state) {
      // state.loadingDomain = false;
    },
    updateDomainParentIdFailed(state) {
      // state.loadingDomain = false;
    },
    deleteDomain(state, action) {
      state.loadingDomain = false;
    },
    deleteDomainSuccess(state) {
      state.loadingDomain = false;
    },
    deleteDomainFailed(state) {
      state.loadingDomain = false;
    },
  },
});

const { actions, reducer } = domainSlice;

export { actions as domainActions, reducer as domainReducer };
