import { dbConnect, collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const furnitureCollection = await dbConnect(collections.FURNITURE);
    const featuredItems = await furnitureCollection
      .find({ featured: true, status: "approved", hidden: { $ne: true } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, featured: featuredItems });
  } catch (error) {
    console.error("Featured GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch featured items" },
      { status: 500 },
    );
  }
}
