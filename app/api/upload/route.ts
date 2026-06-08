import { cookies } from "next/headers";
import { config } from "@/config";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const formData = await req.formData();

  const res = await fetch(`${config.next_public_base_api}/csv/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await res.json();
  return Response.json(result);
}
