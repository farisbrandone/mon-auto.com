import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CardDescription({
  descriptionAuto,
}: {
  descriptionAuto: string;
}) {
  return (
    <Card className="w-[350px] mt-2">
      <CardHeader>
        <CardTitle>Description de l'auto</CardTitle>
        {/*  <CardDescription>Deploy your new project in one-click.</CardDescription> */}
      </CardHeader>
      <CardContent className="text-wrap">{descriptionAuto}</CardContent>
    </Card>
  );
}
