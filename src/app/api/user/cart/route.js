import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "User email is required" },
        { status: 400 },
      );
    }

    const cartCollection = await dbConnect("carts");
    const items = await cartCollection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("User Cart GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch cart items" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { userEmail, furnitureItem } = await request.json();

    if (!userEmail || !furnitureItem || !furnitureItem.id) {
      return NextResponse.json(
        {
          success: false,
          message: "userEmail and furnitureItem.id are required",
        },
        { status: 400 },
      );
    }

    const cartCollection = await dbConnect("carts");

    const existing = await cartCollection.findOne({
      userEmail,
      furnitureId: furnitureItem.id,
    });

    if (existing) {
      await cartCollection.updateOne(
        { _id: existing._id },
        { $inc: { quantity: 1 }, $set: { updatedAt: new Date() } },
      );

      return NextResponse.json({
        success: true,
        message: "Quantity updated in cart",
      });
    }

    const newItem = {
      userEmail,
      furnitureId: furnitureItem.id,
      name: furnitureItem.name,
      price: furnitureItem.price,
      image: furnitureItem.image,
      category: furnitureItem.category,
      vendorName: furnitureItem.vendorName,
      vendorEmail: furnitureItem.vendorEmail,
      quantity: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await cartCollection.insertOne(newItem);

    return NextResponse.json({
      success: true,
      message: "Added to cart",
    });
  } catch (error) {
    console.error("User Cart POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add to cart" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Cart item id is required" },
        { status: 400 },
      );
    }

    const cartCollection = await dbConnect("carts");
    await cartCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("User Cart DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove cart item" },
      { status: 500 },
    );
  }
}
