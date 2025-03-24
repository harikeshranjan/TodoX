import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db"
import Task from "@/models/Task";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tags = await Task.aggregate([
      { $match: { userId: session.user.id } },
      { $unwind: "$tags" }, // Flatten the tags array
      { $group: { _id: null, uniqueTags: { $addToSet: "$tags" } } },
      { $project: { _id: 0, uniqueTags: 1 } }
    ]);

    return NextResponse.json(tags.length > 0 ? tags[0].uniqueTags : [], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}