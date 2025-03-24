import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Task from "@/models/Task";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// API routes to update the task completion status
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract ID from request URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Extracts ID from URL

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const { completed } = await request.json();
    if (typeof completed !== "boolean") {
      return NextResponse.json({ error: "Enter all the fields" }, { status: 400 });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { completed },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task completion status updated" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to toggle completion" }, { status: 500 });
  }
}

// API routes to delete a task
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Extract the ID from URL

    if (!id) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: session.user.id });

    if (!deletedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}