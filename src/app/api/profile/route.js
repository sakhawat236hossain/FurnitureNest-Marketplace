import { dbConnect, collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    const usersCollection = await dbConnect(collections.USERS);

    const user = await usersCollection.findOne(
      { email },
      { projection: { password: 0 } }, // password hide
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
