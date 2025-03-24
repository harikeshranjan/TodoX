import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest){
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Please fill all the fields" }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    await User.create({ username, email, password });

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to register the user" }, { status: 500 });
  }
}