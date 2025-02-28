"use client";
import { CountsWidget } from "@/library/components/countsWidget/library.components.countsWidget";
import { useTheme, Box, Stack, Zoom } from "@mui/material";
import React from "react";

export const CountsWidgetView = () => {
  const {
    palette: { secondary, warning, grey, success, text, error, info },
  } = useTheme();

  return (
    <Stack justifyContent={"center"} direction={"row"} gap={5} flexWrap="wrap">
      <Box component={"div"}>
        <Zoom in={true}>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box
              sx={{
                width: 200,
                height: 130,
              }}
            >
              <CountsWidget
                as="div"
                title={"Teachers"}
                count={5}
                bgColor={success.light}
                color={success.contrastText}
              />
            </Box>
          </Stack>
        </Zoom>
      </Box>
      <Box component={"div"}>
        <Zoom in={true}>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box sx={{ width: 200, height: 130 }}>
              {" "}
              <CountsWidget
                as="div"
                title={"Students"}
                count={5}
                bgColor={secondary.light}
                color={secondary.contrastText}
              />
            </Box>
          </Stack>
        </Zoom>
      </Box>
      <Box component={"div"}>
        <Zoom in={true}>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box sx={{ width: 200, height: 130 }}>
              {" "}
              <CountsWidget
                as="div"
                title={"Active Students"}
                count={5}
                bgColor={info.light}
                color={info.contrastText}
              />
            </Box>
          </Stack>
        </Zoom>
      </Box>
      <Box component={"div"}>
        <Zoom in={true}>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box sx={{ width: 200, height: 130 }}>
              {" "}
              <CountsWidget
                as="div"
                title={"Active Teachers"}
                count={5}
                bgColor={grey[50]}
                color={text.primary}
              />
            </Box>{" "}
          </Stack>
        </Zoom>
      </Box>
      <Box component={"div"}>
        <Zoom in={true}>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box sx={{ width: 200, height: 130 }}>
              {" "}
              <CountsWidget
                as="div"
                title={"In-Active Students"}
                count={5}
                bgColor={error.light}
                color={error.contrastText}
              />
            </Box>
          </Stack>
        </Zoom>
      </Box>
      <Box component={"div"}>
        <Zoom in={true}>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box sx={{ width: 200, height: 130 }}>
              {" "}
              <CountsWidget
                as="div"
                title={"In-Active Teachers"}
                count={5}
                bgColor={warning.light}
                color={warning.contrastText}
              />
            </Box>{" "}
          </Stack>
        </Zoom>
      </Box>
    </Stack>
  );
};
