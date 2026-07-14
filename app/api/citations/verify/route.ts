import { NextRequest, NextResponse } from "next/server";
import { verifyCitation, getOverallVerification } from "@/lib/verification";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { citation } = body;

    const results = await verifyCitation(citation);
    const overall = getOverallVerification(results);

    return NextResponse.json({ results, overall });
  } catch (error) {
    return NextResponse.json(
      { error: "فشل التحقق" },
      { status: 500 }
    );
  }
}
