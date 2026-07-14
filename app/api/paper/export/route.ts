import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format, content } = body;

    if (format === "latex") {
      return NextResponse.json({
        latex: content,
        filename: "paper.tex",
      });
    }

    if (format === "pdf") {
      return NextResponse.json({
        message: "يتطلب إنشاء PDF إعدادات إضافية",
        latex: content,
      });
    }

    return NextResponse.json({ content, format });
  } catch (error) {
    return NextResponse.json(
      { error: "فشل التصدير" },
      { status: 500 }
    );
  }
}
