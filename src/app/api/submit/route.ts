import { NextResponse } from "next/server";
import { getProblem } from "@/data/dsa";
import { submitSchema } from "@/lib/validations/dsa";
import { submitSolution } from "@/lib/judge";

export async function POST(req: Request) {
  const parsed = submitSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { slug, language, code } = parsed.data;

  if (!getProblem(slug)) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  const result = await submitSolution({ slug, language, code });
  return NextResponse.json(result);
}
