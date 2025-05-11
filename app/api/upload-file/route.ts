import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { baseUrl } from "@/lib/utils";

export async function POST(req: Request) {
  const authHeader = (await headers()).get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Forward the upload to your actual backend
  const formData = await req.formData();

  const response = await fetch(`${baseUrl}/uploadFile`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  console.log(response.status);

  return response;
}
