import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalVisits = await prisma.visit.count();
    const monthVisits = await prisma.visit.count({ where: { createdAt: { gte: startOfMonth } } });
    const todayVisits = await prisma.visit.count({ where: { createdAt: { gte: startOfDay } } });
    const uniqueVisits = await prisma.visit.groupBy({ by: ["ip"], _count: { ip: true } });
    const countries = await prisma.visit.groupBy({ by: ["country"], _count: { country: true } });
    const totalUsers = await prisma.user.count();
    const newUsers = await prisma.user.count({ where: { createdAt: { gte: startOfMonth } } });
    const totalResearches = await prisma.researchRun.count();
    const completedResearches = await prisma.researchRun.count({ where: { status: "COMPLETED" } });

    return NextResponse.json({
      totalVisits,
      monthVisits,
      todayVisits,
      uniqueVisits: uniqueVisits.length,
      countries,
      totalUsers,
      newUsers,
      totalResearches,
      completedResearches,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}