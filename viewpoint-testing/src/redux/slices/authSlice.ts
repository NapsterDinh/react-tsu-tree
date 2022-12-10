import { stateAuthType } from "@models/type";
import { createSlice } from "@reduxjs/toolkit";
import { ROLE } from "@utils/constants";

const initialState: stateAuthType = {
  loginResponse: null,
  loginSuccess: null,
  loginLoading: false,
  logoutLoading: false,
  userLoading: false,
  user: null,
  errorLogin: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      // TODO: reducer for pending login action
      state.loginLoading = true;
    },

    loginSuccess(state, action) {
      // TODO: reducer for login success action
      const loginResponse = action.payload;
      localStorage.setItem("token", loginResponse.accessToken);
      localStorage.setItem("expiration", loginResponse.expire_in);
      localStorage.setItem("user", JSON.stringify(loginResponse.user));
      if (
        !localStorage.getItem("dataLanguage") &&
        localStorage.getItem("i18nextLng")
      ) {
        localStorage.setItem(
          "dataLanguage",
          localStorage.getItem("i18nextLng")
        );
      } else {
        localStorage.setItem("dataLanguage", "en");
      }
      state.loginResponse = loginResponse;
      state.loginSuccess = true;
      state.loginLoading = false;
      state.errorLogin = "";
    },

    loginFailure(state, action) {
      // TODO: reducer for login failure action
      state.loginSuccess = false;
      state.loginLoading = false;
      state.errorLogin = action.payload;
    },

    closeLoading(state, action) {
      state.loginLoading = false;
    },
    getCurrentUser(state, action) {
      // TODO: reducer for pending get current user action
      state.userLoading = true;
      state.user = null;
    },

    getCurrentUserSuccess(state, action) {
      // TODO: reducer for getting current user success action
      state.user = action.payload;
      state.userLoading = false;
    },

    getCurrentUserFailure(state, action) {
      // TODO: reducer for getting current user failure action
      state.user = { role: ROLE.GUEST };
      state.userLoading = false;
    },

    logoutUser(state, action) {
      // TODO:
      localStorage.removeItem("token");
      localStorage.removeItem("expiration");
      localStorage.removeItem("user");
      state.user = null;
    },
  },
});

const { actions, reducer } = authSlice;

export { actions as authActions, reducer as authReducer };
