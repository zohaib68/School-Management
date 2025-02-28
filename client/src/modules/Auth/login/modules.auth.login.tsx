"use client";
import {
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import SchoolIcon from "@mui/icons-material/School";
import { LoginPageFields } from "./loginFields/module.login.loginfields";

export const Login = () => {
  const theme = useTheme();

  return (
    <Stack
      sx={{ width: "100%" }}
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={4}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SchoolIcon sx={{ fontSize: "300px" }} color={"primary"} />

        <Typography
          variant="h4"
          sx={{ textShadow: `4px 6px 4px ${theme.palette.grey[400]}` }}
        >
          School Management System
        </Typography>
      </Box>
      <Divider orientation="vertical" variant="fullWidth" flexItem />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          sx={{
            p: 2,
            height: "35vh",
            width: {
              xs: "90%",
              sm: "90%",
              md: "80%",
              lg: "70%",
              xl: "70%",
            },
          }}
          component={Paper}
          direction={"column"}
          justifyContent={"center"}
        >
          <LoginPageFields />
        </Stack>
      </Box>
    </Stack>
  );
};
