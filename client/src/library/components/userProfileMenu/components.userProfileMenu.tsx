import { useToggleState } from "@/library/hooks/useToggleState/hooks.useToggleState";
import {
  getSystemTheme,
  setSystemTheme,
} from "@/library/redux/slices/systemSlice/redux.slices.systemSlice";
import { SystemThemeEnum } from "@/types/enums/types.enums";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Typography,
} from "@mui/material";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

export const UserProfileMenu = () => {
  const [{ openToggleHandler, closeToggleHandler }, openMenu] =
    useToggleState();

  const ref = useRef<HTMLButtonElement>(null);

  const dispatch = useDispatch();

  const systemTheme = useSelector(getSystemTheme);

  const themeSwitchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { checked },
    } = event;

    dispatch(
      setSystemTheme(checked ? SystemThemeEnum.DARK : SystemThemeEnum.LIGHT)
    );
  };
  return (
    <Box component={"div"}>
      <IconButton ref={ref} onClick={openToggleHandler} color="primary">
        <AccountCircleRoundedIcon />
      </IconButton>

      <Menu
        onClick={closeToggleHandler}
        onClose={closeToggleHandler}
        open={openMenu}
        anchorEl={ref.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        sx={{
          "& .MuiPaper-root": {
            width: "250px",
          },
        }}
      >
        <MenuItem
          onClick={(evevt) => evevt.stopPropagation()}
          sx={{ justifyContent: "space-between" }}
        >
          <Typography fontWeight={600}> Settings</Typography>
          <Box component={"div"}>
            <SettingsRoundedIcon />
          </Box>
        </MenuItem>

        <MenuItem
          sx={{ justifyContent: "space-between" }}
          onClick={(evevt) => evevt.stopPropagation()}
        >
          <Typography fontWeight={600}>Dark</Typography>

          <Box component={"div"}>
            <Switch
              onChange={themeSwitchHandler}
              size="medium"
              checked={systemTheme === SystemThemeEnum.DARK}
            />
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};
