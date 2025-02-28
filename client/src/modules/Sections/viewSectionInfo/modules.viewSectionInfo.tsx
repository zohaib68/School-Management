import { TComponentProps } from "@/types/interfacesAndtypes/interafacesAndtypes";
import { ISectionInfo } from "@/types/sectionsModule/types.sectionsModule";
import {
  Box,
  CSSObject,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { ViewSectionCounts } from "../viewSectionsCounts/modules.sections.viewSectionCounts";
import { ViewUsersRow } from "@/library/components/viewUsersRow/components.viewUsersRow";
import { IUserInfo, UserRoleEnum } from "@/types/userModule/types.userModule";
import { ViewSectionItemTile } from "@/library/HOC/viewSectionItemTile/HOC.viewSectionItemTile";

export interface IViewSectionInfo extends ISectionInfo, TComponentProps<"div"> {
  containerStyles?: CSSObject;
  itemsContainerStyles?: CSSObject;
  users: IUserInfo[];
}
export const ViewSectionInfo = ({
  itemsContainerStyles = {},
  name,
  containerStyles = {},
  category,
  users,
  ...restCounts
}: IViewSectionInfo) => {
  const {
    palette: { primary },
  } = useTheme();
  return (
    <Box
      component={"div"}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        ...containerStyles,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "end",
          gap: 1,
        }}
      >
        <Typography component={"span"} variant="h6" fontWeight={700}>
          {name}
        </Typography>
        <Typography
          component={"span"}
          sx={{ color: primary.main }}
          fontWeight={700}
          alignSelf={"center"}
        >
          ({category})
        </Typography>{" "}
      </Box>
      <ViewSectionCounts
        countsContainerStyles={itemsContainerStyles}
        {...restCounts}
      />
      <Divider />
      <ViewSectionItemTile as="div" title="Users">
        <Stack direction={"row"} gap={2}>
          <ViewSectionItemTile
            titleStyles={{
              borderBottomStyle: "none",
            }}
            as="div"
            title="Teachers"
          >
            {" "}
            <ViewUsersRow
              chipVariant="filled"
              chipColor="default"
              users={users.filter((user) => user.role === UserRoleEnum.TEACHER)}
            />
          </ViewSectionItemTile>
          <Divider flexItem orientation="vertical" variant="middle" />
          <ViewSectionItemTile
            titleStyles={{
              borderBottomStyle: "none",
            }}
            as="div"
            title="Students"
          >
            {" "}
            <ViewUsersRow
              chipVariant="filled"
              chipColor="default"
              users={users.filter((user) => user.role === UserRoleEnum.STUDENT)}
            />
          </ViewSectionItemTile>
        </Stack>
      </ViewSectionItemTile>
    </Box>
  );
};
