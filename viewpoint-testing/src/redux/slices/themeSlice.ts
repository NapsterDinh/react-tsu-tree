import { stateThemeType } from "@models/type";
import { createSlice } from "@reduxjs/toolkit";

// get theme in local storage
const theme = localStorage.getItem("theme");

// initial state for theme
const initialState: stateThemeType = {
  theme: theme ? theme : "light",
};

// create theme slice to manage state of theme
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    switchTheme(state, { payload }) {
      state.theme = payload;
    },
  },
});

const { actions, reducer } = themeSlice;

export { actions as themeActions, reducer as themeReducer };
