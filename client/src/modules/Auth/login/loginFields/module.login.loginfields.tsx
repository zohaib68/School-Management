"use client";
import { Input } from "@/library/components/input/components.Input";
import { useFetch } from "@/library/hooks/useFetch/hooks.useFetch";
import { useRouteChange } from "@/library/hooks/useRouteChange/hooks.useRouteChange";
import { setAuthToken } from "@/library/redux/slices/userSlice/redux.slices.userSlice";
import {
  ILoginPayload,
  ILoginResponseInfo,
} from "@/types/interfacesAndtypes/interafacesAndtypes";
import { Stack, Box, Typography, Button, useTheme } from "@mui/material";
import { setCookie } from "cookies-next";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

interface IValues {
  userName: string;
  password: string;
}
export const LoginPageFields = () => {
  const [values, setValues] = useState<IValues>({ password: "", userName: "" });

  const theme = useTheme();

  const { fetchHandler } = useFetch();

  const { push: navigate } = useRouteChange();

  const dispatch = useDispatch();

  const valuesChangeHandler = (key: keyof IValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{ textShadow: `4px 6px 4px ${theme.palette.grey[400]}` }}
          variant="h4"
        >
          Login into the school
        </Typography>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Stack direction={"column"} justifyContent={"center"} gap={2}>
          <Input
            onChange={({ target: { value } }) =>
              valuesChangeHandler("userName", value)
            }
            label="User Name"
            size="small"
            fullWidth
            value={values.userName}
          />
          <Input
            onChange={({ target: { value } }) =>
              valuesChangeHandler("password", value)
            }
            label="Password"
            size="small"
            fullWidth
            value={values.password}
            type="password"
          />
        </Stack>
      </Box>

      <Button
        size="small"
        onClick={() =>
          fetchHandler<ILoginResponseInfo, ILoginPayload>({
            url: "/auth/login",
            method: "POST",
            payload: values,
          }).then((res) => {
            const token = res.data.data?.accessToken ?? "";
            dispatch(setAuthToken(token));

            setCookie("token", token);

            navigate("/dashboard");
          })
        }
        color="primary"
        variant="contained"
      >
        Login
      </Button>
    </>
  );
};
