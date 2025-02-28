import { CountsWidgetView } from "@/modules/Grades/countsWidgetView/modules.grades.countsWidgetView";
import { GradesList } from "@/modules/Grades/dashboard/modules.grades.listGrades.dashboard";
import { Divider, Stack } from "@mui/material";
import React from "react";

export const HeadUserDashboard = () => {
  return (
    <Stack direction={"column"} gap={4}>
      <CountsWidgetView />

      <Divider />
      <GradesList />
    </Stack>
  );
};
