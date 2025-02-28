import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/redux.store";
import { SystemThemeEnum } from "@/types/enums/types.enums";

// Define the initial state for the counter
interface ISystemSlice {
  theme: SystemThemeEnum;
}

const initialState: ISystemSlice = {
  theme: SystemThemeEnum.LIGHT,
};

const systemSlice = createSlice({
  name: "systemSlcie",
  initialState,
  reducers: {
    setSystemTheme: (state, action: PayloadAction<SystemThemeEnum>) => {
      state.theme = action.payload;
    },
  },
});

export const { setSystemTheme } = systemSlice.actions;

export const getSystemTheme = (state: RootState) => state.system.theme;

export const { reducer: systemSliceReducer } = systemSlice;
