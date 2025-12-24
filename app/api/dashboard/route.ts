import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/current-user";
import { computeDashboardForUser } from "@/app/lib/dashboard";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  try {
    const data = await computeDashboardForUser(user.id);
    return NextResponse.json(data);
  } catch (err) {
    console.error("/api/dashboard error:", err);
    return NextResponse.json({}, { status: 500 });
  }
}
