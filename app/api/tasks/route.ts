import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Task from "@/models/Task";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
  try {
    const { title, dueDate, priority, tags } = await request.json(); 

    if (!title || !dueDate || !priority) {
      return NextResponse.json({ error: "Enter all the fields" }, { status: 400 });
    }

    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newTask = await Task.create({
      title,
      dueDate,
      priority,
      completed: false,
      tags,
      userId: session.user.id,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error(error);
    NextResponse.json({ error: "Failed to add task" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session || !session.user){
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const tasks = await Task.find({ userId: session.user.id }).sort({ dueDate: 1 });

    return NextResponse.json({ tasks }, { status: 200 })
  } catch (error) {
    console.error(error);
    NextResponse.json({ error: "Failed to fetch the tasks" }, { status: 500 });
  }
}