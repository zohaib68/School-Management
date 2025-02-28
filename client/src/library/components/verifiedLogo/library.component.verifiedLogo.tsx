"use client";
import React from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Stack, Typography, useTheme } from "@mui/material";

export const VerifiedLogo = () => {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        background: theme.palette.primary[100],
        width: "fit-content",
        borderRadius: 10,
        paddingX: 1,
        paddingY: 0.5,
        paddingRight: 1.5,
        margin: 1,
        border: `1px solid ${theme.palette.primary[200]}`,
        boxShadow: 1,
      }}
      direction={"row"}
      alignItems={"center"}
    >
      <VerifiedIcon sx={{ fontSize: 40 }} color="primary" />
      <Stack direction={"column"}>
        <Typography
          sx={{
            color: theme.palette.primary.main,
          }}
          fontSize={15}
          fontWeight={700}
          lineHeight={1}
        >
          Verified
        </Typography>
        <Typography
          sx={{
            color: theme.palette.primary.main,
          }}
          align="center"
          fontSize={15}
          fontWeight={700}
          lineHeight={1}
        >
          Board
        </Typography>
      </Stack>
    </Stack>
  );
};
