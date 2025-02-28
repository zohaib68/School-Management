import { TComponentProps } from "@/types/interfacesAndtypes/interafacesAndtypes";
import { Box, Paper, Stack, Typography } from "@mui/material";
import React from "react";

export interface ICountsWidget extends TComponentProps<"div"> {
  title: string;
  count: number;
  bgColor: string;
  color: string;
}
export const CountsWidget = ({
  title,
  count,
  color,
  bgColor,
}: ICountsWidget) => {
  return (
    <Stack
      component={Paper}
      direction={"column"}
      spacing={2}
      sx={{
        background: bgColor,
        p: 1,
        borderRadius: 5,
        color,
        width: "100%",
        height: "100%",
      }}
      alignItems={"center"}
    >
      <Box
        component={"span"}
        sx={{
          flexGrow: 1,
          alignContent: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </Box>

      <Box component={"span"} sx={{ flexGrow: 1, alignContent: "flex-start" }}>
        {" "}
        <Typography variant="h6" fontWeight={600}>
          {count}
        </Typography>
      </Box>
    </Stack>
  );
};
