import React, { useState } from "react";

import HouseIcon from "@mui/icons-material/House";
import {
  Box,
  CSSObject,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  styled,
  Theme,
  Tooltip,
  useTheme,
} from "@mui/material";

import { ExpandMoreOrLessButton } from "../expandMorOrLessButton/componenets.expandMoreOrLessButton";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  }),
  overflowX: "hidden",
  height: "calc(100vh - 67px) !important",
  position: "relative",
  background: theme.palette.grey[50],
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create(["width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  }),
  overflowX: "hidden",
  height: "calc(100vh - 67px) !important",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  position: "relative",
  background: theme.palette.grey[50],
});

const MuiDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  overflowY: "hidden",
  zIndex: 1,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export const UserSideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const styles: CSSObject = isCollapsed
    ? { justifyContent: "initial", mr: 3, transition: "margin .5s ease" }
    : { justifyContent: "center", mr: "auto", transition: "margin .5s ease" };
  return (
    <Box sx={{ position: "relative" }}>
      <MuiDrawer variant="permanent" open={isCollapsed}>
        {" "}
        <List>
          <ListItem>
            <ListItemButton sx={{ ...styles }}>
              <ListItemIcon sx={styles}>
                <Tooltip title="home" arrow placement="top">
                  <HouseIcon color="primary" />
                </Tooltip>
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
      </MuiDrawer>

      <ExpandMoreOrLessButton
        position="rightCenter"
        isCollapsed={isCollapsed}
        onClick={() => setIsCollapsed((prev) => !prev)}
        sx={{
          right: -12,
        }}
      />
    </Box>
  );
};
