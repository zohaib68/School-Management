"use client";
import {
  Backdrop,
  Box,
  ModalProps,
  Modal as MUIModal,
  useTheme,
  Typography,
  CSSObject,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";
import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";

export const Modal = ({ children, ...restProps }: ModalProps) => {
  const {
    palette: { primary },
  } = useTheme();

  const style: CSSObject = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
  };

  return (
    <MUIModal
      {...restProps}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Box component={"div"} sx={style}>
        {restProps.title ? (
          <Box component={"div"}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              sx={{ p: 1 }}
            >
              <Typography variant="h4"> {restProps.title}</Typography>
              <IconButton
                onClick={(event) =>
                  restProps?.onClose
                    ? restProps.onClose(event, "escapeKeyDown")
                    : null
                }
                size="small"
                color="error"
              >
                <CancelIcon />
              </IconButton>
            </Stack>

            <Divider sx={{ background: primary.light }} />
          </Box>
        ) : null}
        <Box component={"div"} sx={{ p: 1 }}>
          {children}
        </Box>
      </Box>
    </MUIModal>
  );
};
