import { Login } from "@/modules/Auth/login/modules.auth.login";
import { Box } from "@mui/material";
import React from "react";

export const LoginPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Login />;
    </Box>
  );
};
