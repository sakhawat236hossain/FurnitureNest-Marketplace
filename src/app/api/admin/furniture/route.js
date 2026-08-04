import { dbConnect, collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const furnitureCollection = await dbConnect(collections.FURNITURE);

    let query = {};
    if (status && status !== "all") query.status = status;
    if (category && category !== "all") query.category = category;

    const furniture = await furnitureCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, furniture });
  } catch (error) {
    console.error("Admin Furniture GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch furniture" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { furnitureId, status } = await request.json();

    if (!furnitureId || !status) {
      return NextResponse.json(
        { success: false, message: "furnitureId and status are required" },
        { status: 400 }
      );
    }

    const furnitureCollection = await dbConnect(collections.FURNITURE);

    const result = await furnitureCollection.updateOne(
      { _id: new ObjectId(furnitureId) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Furniture item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Furniture status updated successfully",
    });
  } catch (error) {
    console.error("Admin Furniture PATCH Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update furniture status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const furnitureId = searchParams.get("furnitureId");

    if (!furnitureId) {
      return NextResponse.json(
        { success: false, message: "furnitureId is required" },
        { status: 400 }
      );
    }

    const furnitureCollection = await dbConnect(collections.FURNITURE);
    const result = await furnitureCollection.deleteOne({
      _id: new ObjectId(furnitureId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Furniture item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Furniture item deleted successfully",
    });
  } catch (error) {
    console.error("Admin Furniture DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete furniture" },
      { status: 500 }
    );
  }
}
