import { PageTitle } from "@/library/HOC/pageTitle/HOC.pageTitle";
import { HeadUserDashboard } from "@/modules/Users/HeadDashbaord/modules.user.headDashboard";
import React from "react";

export const Dashboard = () => {
  return (
    <PageTitle as="div" title="Dashboard">
      <HeadUserDashboard />
    </PageTitle>
  );
};
