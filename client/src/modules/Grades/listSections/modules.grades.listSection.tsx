import { useListSectionApi } from "@/library/hooks/useListSectionsApi/hooks.useListSectionApi";
import { useListUsersApi } from "@/library/hooks/useListUsersApi/hooks.useListUsersApi";
import { ViewSectionInfo } from "@/modules/Sections/viewSectionInfo/modules.viewSectionInfo";
import { TComponentProps } from "@/types/interfacesAndtypes/interafacesAndtypes";
import { Box } from "@mui/material";
import React from "react";

export interface IListSections extends TComponentProps<"div"> {
  gradeId: string;
}
export const ListSections = ({ gradeId }: IListSections) => {
  const [sections] = useListSectionApi({
    params: {
      gradeId,
    },
  });

  const [users] = useListUsersApi({ params: { gradeId } });

  return (
    <Box
      component={"div"}
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        p: 2,
      }}
    >
      {sections.map((section) => (
        <ViewSectionInfo
          users={users.filter((user) => user.sectionIds?.includes(section._id))}
          {...section}
          key={section._id}
          as="div"
        />
      ))}
    </Box>
  );
};
