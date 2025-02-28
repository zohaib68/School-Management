import {
  SelectProps,
  FormControl,
  Select as MUISelect,
  InputLabel,
} from "@mui/material";
import React from "react";

export const Select = (props: SelectProps) => {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{props?.label ?? ""}</InputLabel>
      <MUISelect {...props}>{props.children}</MUISelect>
    </FormControl>
  );
};
