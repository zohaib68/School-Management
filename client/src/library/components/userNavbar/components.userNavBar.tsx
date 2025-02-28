import { Stack, useTheme, Typography, alpha } from "@mui/material";
import React from "react";
import CastForEducationRoundedIcon from "@mui/icons-material/CastForEducationRounded";
import { UserProfileMenu } from "../userProfileMenu/components.userProfileMenu";

export const UserNavBar = () => {
  const theme = useTheme();
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={{
        height: 65,
        background: theme.palette.grey[50],
        color: theme.palette.primary.main,
        paddingX: 0.2,
      }}
    >
      <Stack
        sx={{
          borderTop: `1px solid ${theme.palette.primary.light}`,
          borderBottom: `1px solid ${theme.palette.primary.light}`,
          borderRight: `1px solid ${theme.palette.primary.light}`,
          paddingRight: 1,
          borderRadius: 1,
        }}
        direction={"row"}
        alignItems={"center"}
        gap={1}
      >
        <CastForEducationRoundedIcon sx={{ fontSize: 50 }} />
        <Typography variant="h6">School Management</Typography>
      </Stack>

      <UserProfileMenu />
    </Stack>
  );
};
