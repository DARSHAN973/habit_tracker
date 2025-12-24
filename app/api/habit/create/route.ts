import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/current-user";
import { HabitCategory, HabitType } from "@prisma/client";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const { title, category, type, days } = await req.json();

  const baseData = {
    title: title as string,
    category: category as HabitCategory,
    type: type as HabitType,
    startDate: new Date(),
    userId: user.id,
  } as const;

  const createData =
    type === "WEEKLY" && Array.isArray(days)
      ? { ...baseData, days }
      : baseData;

  // Prisma typings can be strict for JSON fields; cast to unknown and then to the expected type
  try {
    const habit = await prisma.habit.create({ data: createData as unknown as Parameters<typeof prisma.habit.create>[0]["data"] });
    return NextResponse.json(habit);
  } catch (err) {
    console.error("prisma create habit error:", err);
    // If the DB schema wasn't migrated to include `days`, Prisma will reject the `days` arg.
  const e = err as unknown as { message?: string; code?: string };
  if (e?.message?.includes("Unknown argument `days`") || e?.code === "P1010") {
      return NextResponse.json(
        { error: "Database schema missing 'days' field. Run `npx prisma migrate dev` to apply migrations." },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to create habit" }, { status: 500 });
  }
}
