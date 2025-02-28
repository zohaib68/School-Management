import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

export const Input = (props: TextFieldProps) => {
  const { size = "small", ...restProps } = props;

  return <TextField {...restProps} size={size} />;
};
