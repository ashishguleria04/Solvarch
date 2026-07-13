import { NextResponse } from "next/server";
import { executeSchema } from "@/lib/validations/dsa";
import { runSamples } from "@/lib/judge";

export async function POST(req: Request) {
  const parsed = executeSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { slug, language, code, customInput } = parsed.data;

  const result = await runSamples({ slug, language, code, customInput });
  return NextResponse.json(result);
}
