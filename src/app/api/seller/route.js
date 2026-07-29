import { NextResponse } from "next/server";
import { dbConnect, collections } from "@/lib/dbConnect";
export async function POST(request) {
  const data = await request.json();
  const collection = await dbConnect(collections.FURNITURE);
  const result = await collection.insertOne({
    ...data,
    status: "pending",
    createdAt: new Date(),
  });
  return NextResponse.json({ success: true, insertedId: result.insertedId });
}
export async function GET(request) {
  const email = request.nextUrl.searchParams.get("email");
  const collection = await dbConnect(collections.FURNITURE);
  const items = await collection
    .find({ vendorEmail: email })
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json(items);
}
