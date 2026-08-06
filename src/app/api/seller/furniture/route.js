import { dbConnect, collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Vendor email is required" },
        { status: 400 },
      );
    }

    const furnitureCollection = await dbConnect(collections.FURNITURE);
    const items = await furnitureCollection
      .find({ vendorEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("Seller Furniture GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch vendor furniture" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (
      !data.name ||
      !data.price ||
      !data.vendorEmail ||
      !Array.isArray(data.images) ||
      data.images.length !== 3
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, price, vendor email, and exactly 3 images are required",
        },
        { status: 400 },
      );
    }

    const usersCollection = await dbConnect(collections.USERS);
    const seller = await usersCollection.findOne({ email: data.vendorEmail });

    if (seller?.isFraud) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This seller has been marked as fraud and cannot add new items",
        },
        { status: 403 },
      );
    }

    const furnitureCollection = await dbConnect(collections.FURNITURE);

    const newItem = {
      name: data.name,
      category: data.category || "General",
      price: Number(data.price),
      oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
      stock: Number(data.stock) || 1,
      description: data.description || "",
      material: data.material || "Wood",
      dimensions: data.dimensions || "",
      images: Array.isArray(data.images)
        ? data.images
        : data.images
          ? [data.images]
          : [],
      image: data.image || (Array.isArray(data.images) ? data.images[0] : ""),
      vendorEmail: data.vendorEmail,
      vendorName: data.vendorName || "Vendor",
      status: "approved",
      inStock: true,
      hidden: false,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await furnitureCollection.insertOne(newItem);

    return NextResponse.json({
      success: true,
      message: "Furniture item added successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Seller Furniture POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add furniture" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const { itemId, ...updateData } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        { success: false, message: "itemId is required" },
        { status: 400 },
      );
    }

    const furnitureCollection = await dbConnect(collections.FURNITURE);
    updateData.updatedAt = new Date();

    const result = await furnitureCollection.updateOne(
      { _id: new ObjectId(itemId) },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Furniture item updated successfully",
    });
  } catch (error) {
    console.error("Seller Furniture PATCH Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update furniture" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json(
        { success: false, message: "itemId is required" },
        { status: 400 },
      );
    }

    const furnitureCollection = await dbConnect(collections.FURNITURE);
    const result = await furnitureCollection.deleteOne({
      _id: new ObjectId(itemId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Furniture item deleted successfully",
    });
  } catch (error) {
    console.error("Seller Furniture DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete furniture" },
      { status: 500 },
    );
  }
}
