import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("theme") || "dark",
  anim: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    darkTheme: (state) => {
      localStorage.setItem("theme", "dark");
      state.theme = "dark";
    },
    lightTheme: (state) => {
      localStorage.setItem("theme", "light");
      state.theme = "light";
    },
    toggleAnim: (state) => {
      state.anim = !state.anim;
    },
  },
});

export const { darkTheme, lightTheme, toggleAnim } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
