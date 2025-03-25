import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Task from "@/models/Task";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the beginning of the day
    const tomorrow = new Date(today); // Set to the beginning of tomorrow
    tomorrow.setDate(tomorrow.getDate() + 1); // Add one day

    const tasks = await Task.find({
      userId: session.user.id,
      dueDate: { $gte: today, $lt: tomorrow },
    })

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error(error);
    NextResponse.json({ message: "Failed to fetch today's tasks" }, { status: 500 });
  }
}