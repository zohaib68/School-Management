"use client";
import { UserNavBar } from "@/library/components/userNavbar/components.userNavBar";
import { UserSideBar } from "@/library/components/userSideBar/components.userSideBar";
import { TComponentProps } from "@/types/interfacesAndtypes/interafacesAndtypes";
import { Box, Divider, Stack, useTheme } from "@mui/material";

export const ProtectedPagesLayout = ({ children }: TComponentProps<"div">) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        overflow: "auto",
      }}
    >
      <UserNavBar />
      <Divider
        orientation="horizontal"
        sx={{ background: theme.palette.grey[100] }}
      />
      <Stack
        direction={"row"}
        sx={{ height: "calc(100vh - 66px)", overflow: "hidden" }}
      >
        <UserSideBar />

        <Box
          flexGrow={1}
          sx={{
            overflow: "auto",
            height: "100%",
            p: 4,
          }}
        >
          {children}
        </Box>
      </Stack>
    </Box>
  );
};
