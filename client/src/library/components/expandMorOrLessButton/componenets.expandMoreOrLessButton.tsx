"use client";
import { TBlockPositions } from "@/types/interfacesAndtypes/interafacesAndtypes";
import { Button, ButtonProps, useTheme, CSSObject } from "@mui/material";
import React from "react";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { NavigateBeforeRounded } from "@mui/icons-material";

export interface IExpandMoreOrLessButton extends ButtonProps {
  position: TBlockPositions;
  isCollapsed: boolean;
  iconStyles?: CSSObject;
}

export const ExpandMoreOrLessButton = ({
  position,
  isCollapsed,
  iconStyles,
  ...restProps
}: IExpandMoreOrLessButton) => {
  const {
    palette: { primary },
  } = useTheme();

  const btnPosition: Record<TBlockPositions, CSSObject> = {
    bottomCenter: {
      position: "absolute",
      bottom: "0",
      left: "50%",
    },
    bottomLeft: {
      position: "absolute",
      bottom: "0",
      left: "0",
    },
    bottomRight: {
      position: "absolute",
      bottom: "0",
      right: "0",
    },
    center: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    leftCenter: {
      position: "absolute",
      bottom: "0",
      left: "0",
      top: "50%",
    },
    rightCenter: { position: "absolute", bottom: "0", right: "0", top: "50%" },
    topCenter: {
      position: "absolute",
      top: "0",
      left: "50%",
    },
    topLeft: {
      position: "absolute",
      top: "0",
      left: "0",
    },
    topRight: {
      position: "absolute",
      top: "0",
      right: "0",
    },
  };

  const { sx, ...otherThanSxObj } = restProps;

  return (
    <Button
      sx={{
        background: primary.main,
        borderRadius: 10,
        ...btnPosition[position],
        minWidth: 10,
        zIndex: 2,
        height: 22,
        "&:hover": {
          transition: ".2s ease",

          transform: `scale(1.5)`,
        },

        ...sx,
      }}
      size="small"
      {...otherThanSxObj}
    >
      {isCollapsed ? (
        <NavigateBeforeRounded
          sx={{ color: primary.contrastText, fontSize: 15, ...iconStyles }}
        />
      ) : (
        <NavigateNextRoundedIcon
          sx={{ color: primary.contrastText, fontSize: 15, ...iconStyles }}
        />
      )}
    </Button>
  );
};
