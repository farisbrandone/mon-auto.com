import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const authHeader = (await headers()).get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Forward the upload to your actual backend
  const formData = await req.formData();

  const response = await fetch("http://localhost:8090/uploadFile", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
      /* "Content-Type": "multipart/form-data", */
    },
  });

  return response;
}
