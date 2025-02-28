import { IUserInfo } from "@/types/userModule/types.userModule";
import { Chip, ChipProps, Stack, StackProps } from "@mui/material";
import React from "react";

export interface IViewUsersRow extends StackProps {
  users: IUserInfo[];
  chipVariant: "filled" | "outlined";
  chipColor?: ChipProps["color"];
}
export const ViewUsersRow = ({
  users,
  chipVariant,
  chipColor,
  ...restProps
}: IViewUsersRow) => {
  return (
    <Stack direction={"row"} flexWrap={"wrap"} gap={1} {...restProps}>
      {users.map((user) => (
        <Chip
          color={chipColor}
          size="small"
          variant={chipVariant}
          label={`${user.firstName} ${user.lastName}`}
          key={user._id}
        />
      ))}
    </Stack>
  );
};
