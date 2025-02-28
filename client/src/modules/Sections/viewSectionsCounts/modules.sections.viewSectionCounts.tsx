import { ViewSectionItemTile } from "@/library/HOC/viewSectionItemTile/HOC.viewSectionItemTile";
import {
  ICounts,
  TComponentProps,
} from "@/types/interfacesAndtypes/interafacesAndtypes";
import { Box, Chip, CSSObject, Divider } from "@mui/material";
import React from "react";

export interface IViewSectionCounts extends ICounts, TComponentProps<"div"> {
  containerStyles?: CSSObject;
  countsContainerStyles?: CSSObject;
}
export const ViewSectionCounts = ({
  activeStudentsCount,
  activeTeachersCount,
  inActiveStudentsCount,
  inActiveTeachersCount,
  studentsCount,
  teachersCount,
  containerStyles = {},
  countsContainerStyles = {},
}: IViewSectionCounts) => {
  return (
    <ViewSectionItemTile title="Counts" as="div" styles={containerStyles}>
      <Box
        component={"div"}
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          flexWrap: "wrap",
          ...countsContainerStyles,
        }}
      >
        <Chip
          size="small"
          variant="filled"
          color="info"
          label={`Teachers: ${teachersCount}`}
        />
        <Divider
          sx={{
            display: {
              lg: "block",
              sm: "none",
              xs: "none",
            },
          }}
          orientation="vertical"
          flexItem
        />

        <Chip
          size="small"
          variant="filled"
          color="success"
          label={`Students: ${studentsCount}`}
        />
        <Divider
          sx={{
            display: {
              lg: "block",
              sm: "none",
              xs: "none",
            },
          }}
          orientation="vertical"
          flexItem
        />

        <Chip
          size="small"
          variant="filled"
          color="primary"
          label={`Active Teachers: ${activeTeachersCount}`}
        />
        <Divider
          sx={{
            display: {
              lg: "block",
              sm: "none",
              xs: "none",
            },
          }}
          orientation="vertical"
          flexItem
        />

        <Chip
          size="small"
          variant="filled"
          color="secondary"
          label={`Active Students: ${activeStudentsCount}`}
        />
        <Divider
          sx={{
            display: {
              lg: "block",
              sm: "none",
              xs: "none",
            },
          }}
          orientation="vertical"
          flexItem
        />

        <Chip
          size="small"
          variant="filled"
          color="warning"
          label={`In-Active Teachers: ${inActiveTeachersCount}`}
        />
        <Divider
          sx={{
            display: {
              lg: "block",
              sm: "none",
              xs: "none",
            },
          }}
          orientation="vertical"
          flexItem
        />

        <Chip
          size="small"
          variant="filled"
          color="error"
          label={`In-Active Students: ${inActiveStudentsCount}`}
        />
      </Box>
    </ViewSectionItemTile>
  );
};
