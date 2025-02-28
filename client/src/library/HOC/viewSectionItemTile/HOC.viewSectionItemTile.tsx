import { TComponentProps } from "@/types/interfacesAndtypes/interafacesAndtypes";
import { Box, CSSObject, Typography, useTheme } from "@mui/material";
import React from "react";

export interface IViewSectionItemTitle extends TComponentProps<"div"> {
  title: string;
  styles?: CSSObject;
  titleStyles?: CSSObject;
}
export const ViewSectionItemTile = ({
  title,
  styles = {},
  titleStyles = {},
  children,
}: IViewSectionItemTitle) => {
  const {
    palette: { grey },
  } = useTheme();
  return (
    <Box
      component={"div"}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        ...styles,
      }}
    >
      <Typography
        component={"span"}
        fontWeight={700}
        sx={{
          width: "fit-content",
          borderBottom: `1px solid ${grey[200]}`,
          ...titleStyles,
        }}
      >
        {title}
      </Typography>

      {children}
    </Box>
  );
};
