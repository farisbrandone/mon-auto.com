import { PageProps } from "@/.next/types/app/page";
import DashboardUserAutoBackoffice from "@/composant-de-page/basckoffice-user-dashboard/DashboardUserAutoBackoffice";
import React from "react";

type PageParams = PageProps & {
  params: {
    slug: string;
  };
};

export default function page({ params }: PageParams) {
  console.log(params);
  return (
    <div>
      <DashboardUserAutoBackoffice userId={params.slug} />
    </div>
  );
}
