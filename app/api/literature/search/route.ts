import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "الاستعلام مطلوب" }, { status: 400 });
  }

  try {
    const openAlexRes = await fetch(
      `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=10`
    );
    const openAlexData = await openAlexRes.json();

    await new Promise((r) => setTimeout(r, 1100));
    const s2Res = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&fields=title,authors,year,venue,abstract&limit=10`,
      process.env.S2_API_KEY ? { headers: { "x-api-key": process.env.S2_API_KEY } } : undefined
    );
    const s2Data = await s2Res.json();

    return NextResponse.json({
      openAlex: openAlexData.results || [],
      semanticScholar: s2Data.data || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "فشل في جلب الأدبيات" },
      { status: 500 }
    );
  }
}
