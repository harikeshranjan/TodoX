import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Task from "@/models/Task";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// tasks due date is yesterday or earlier
export async function GET(){
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session || !session.user){
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = await Task.find({
      userId: session.user.id,
      dueDate: { $lt: today },
      completed: false
    })

    return NextResponse.json({ overdueTasks }, { status: 200 });
  } catch(error) {
    console.error(error);
    NextResponse.json({ message: "Failed to fetch the overdue tasks" }, { status: 500 });
  } 
}