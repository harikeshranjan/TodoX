import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db"
import Task from "@/models/Task";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest){
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // extracting tag from the request URL
    const url = new URL(request.url);
    const tag = url.pathname.split("/").pop();

    if (!tag) {
      return NextResponse.json({ error: "Tag is required" }, { status: 400 });
    }

    // fetching tasks with the given tag
    const tasks = await Task.find({ userId: session.user.id, tags: tag });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch tagged filter tasks" }, { status: 500 })
  }
}