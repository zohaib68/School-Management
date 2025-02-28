import { TComponentProps } from "@/types/interfacesAndtypes/interafacesAndtypes";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";

export interface IPageTitle extends TComponentProps<"div"> {
  title: string;
}

export const PageTitle = ({ children, title }: IPageTitle) => {
  return (
    <Stack
      direction={"column"}
      gap={4}
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
      </Box>
      {children}
    </Stack>
  );
};
