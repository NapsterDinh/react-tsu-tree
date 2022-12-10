import { createSlice } from "@reduxjs/toolkit";
type stateRoleType = {
  roles: any;
  loading: boolean;
};
const initialState: stateRoleType = {
  roles: null,
  loading: false,
};

const roleSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getAllRole(state, action) {
      // TODO: reducer for pending login action
      state.loading = true;
    },
    getAllRoleSuccess(state, action) {
      state.roles = action.payload;
      state.loading = false;
    },
  },
});

const { actions, reducer } = roleSlice;

export { actions as roleActions, reducer as roleReducer };

