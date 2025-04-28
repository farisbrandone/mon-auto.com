import DashboardUserAutoBackoffice from "@/composant-de-page/basckoffice-user-dashboard/DashboardUserAutoBackoffice";
import React from "react";

interface PageParams {
  params: {
    slug: string;
  };
}

export default function page({ params }: PageParams) {
  console.log(params);
  return (
    <div>
      <DashboardUserAutoBackoffice userId={params.slug} />
    </div>
  );
}
