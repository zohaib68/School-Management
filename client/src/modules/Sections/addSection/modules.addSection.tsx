import { Input } from "@/library/components/input/components.Input";
import { Select } from "@/library/components/selcect/components.select";
import { TComponentProps } from "@/types/interfacesAndtypes/interafacesAndtypes";
import {
  Box,
  Button,
  ButtonProps,
  Grid2,
  GridBaseProps,
  Stack,
} from "@mui/material";
import React from "react";

export interface AddSectionContent extends TComponentProps<"div"> {
  onSubmit: () => void;
  submitButtonProps?: ButtonProps;
  gridItemProps?: GridBaseProps;
  gridContainerProps?: GridBaseProps;
}
export const AddSection = ({
  onSubmit,
  submitButtonProps = {},
  gridItemProps,
  gridContainerProps = {},
}: AddSectionContent) => {
  const gridSize = {
    xs: 12,
    sm: 6,
    md: 6,
    lg: 6,
    xl: 6,
  };

  return (
    <Stack
      direction={"column"}
      gap={2}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Box component={"div"}>
        <Grid2 container gap={2} columns={12} sx={{ width: "100%" }}>
          <Grid2 size={gridSize} key={1}>
            <Input fullWidth label="Name*" />
          </Grid2>
          <Grid2 size={gridSize} key={2}>
            <Input fullWidth label="Category*" />
          </Grid2>
          <Grid2 size={gridSize} key={3}>
            <Select fullWidth label="Teachers" />
          </Grid2>
          <Grid2 size={gridSize} key={4}>
            <Select fullWidth label="Students" />
          </Grid2>
        </Grid2>
      </Box>

      <Button
        fullWidth
        onClick={onSubmit}
        size="small"
        variant="contained"
        {...submitButtonProps}
      >
        Submit
      </Button>
    </Stack>
  );
};
