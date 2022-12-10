import { createSlice } from "@reduxjs/toolkit";
type stateRoleType = {
  users: any;
  loading: boolean;
  loadingUpdateRole: boolean;
  error: string,
  resultSearch: any;
  loadingSearch: boolean; 
};
const initialState: stateRoleType = {
  users: null,
  loading: false,
  loadingUpdateRole: false,
  error: "",
  resultSearch: [],
  loadingSearch: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getAllUser(state, action) {
      // TODO: reducer for pending login action
      state.loading = true;
    },
    getAllUserSuccess(state, action) {
      state.users = action.payload;
      state.loading = false;
    },
    updateRole(state, action) {
      state.loading = true;
      state.error = ""
    },
    updateRoleSuccess(state, action) {
      state.loading = false;
    },
    updateRoleError(state, action) {
      state.loading = false;
      state.error = action.payload.code
    },
    updateStatus(state, action) {
      state.loading = true;
      state.error = ""
    },
    updateStatusSuccess(state, action) {
      state.loading = false;
    },
    updateStatusError(state, action) {
      state.loading = false;
      state.error = action.payload.code
    },
    searchUser(state, action) {
      state.loadingSearch = true;
    },
    searchUserSuccess(state, action) {
      state.resultSearch = action.payload;
      state.loadingSearch = false;
    },
    searchUserFailed(state) {
      state.loadingSearch = false;
    },
  },
});

const { actions, reducer } = userSlice;

export { actions as userActions, reducer as userReducer };
