import { dbConnect, collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "User email is required" },
        { status: 400 }
      );
    }

    const reviewsCollection = await dbConnect("wishlists");
    const items = await reviewsCollection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("User Wishlist GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch wishlist items" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userEmail, furnitureItem } = await request.json();

    if (!userEmail || !furnitureItem) {
      return NextResponse.json(
        { success: false, message: "userEmail and furnitureItem are required" },
        { status: 400 }
      );
    }

    const wishlistCollection = await dbConnect("wishlists");

    const existing = await wishlistCollection.findOne({
      userEmail,
      furnitureId: furnitureItem.id || furnitureItem._id,
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Item already in wishlist",
      });
    }

    const newItem = {
      userEmail,
      furnitureId: furnitureItem.id || furnitureItem._id,
      name: furnitureItem.name,
      price: furnitureItem.price,
      image: furnitureItem.image,
      createdAt: new Date(),
    };

    await wishlistCollection.insertOne(newItem);

    return NextResponse.json({
      success: true,
      message: "Added to wishlist",
    });
  } catch (error) {
    console.error("User Wishlist POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Wishlist item id is required" },
        { status: 400 }
      );
    }

    const wishlistCollection = await dbConnect("wishlists");
    await wishlistCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: "Item removed from wishlist",
    });
  } catch (error) {
    console.error("User Wishlist DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove wishlist item" },
      { status: 500 }
    );
  }
}
