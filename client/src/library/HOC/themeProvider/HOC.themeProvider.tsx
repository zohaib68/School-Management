"use client";
import {
  ThemeProvider as MUIThemeProvider,
  CssBaseline,
  Theme,
} from "@mui/material";
import React from "react";
import { darkTheme, lightTheme } from "@/library/theme/library.themes";
import { TComponentProps } from "@/types/interfacesAndtypes/interafacesAndtypes";
import { SystemThemeEnum } from "@/types/enums/types.enums";
import { useSelector } from "react-redux";
import { getSystemTheme } from "@/library/redux/slices/systemSlice/redux.slices.systemSlice";

export const ThemeProvider = ({ children }: TComponentProps<"div">) => {
  const systemTheme = useSelector(getSystemTheme);

  const selectedTheme: Record<SystemThemeEnum, Theme> = {
    [SystemThemeEnum.DARK]: darkTheme,
    [SystemThemeEnum.LIGHT]: lightTheme,
  };
  return (
    <MUIThemeProvider theme={selectedTheme[systemTheme]}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};
