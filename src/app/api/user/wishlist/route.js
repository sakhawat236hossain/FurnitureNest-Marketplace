import { dbConnect, collections } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/authGuard";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const email = auth.session.user.email?.toLowerCase();

    const wishlistCollection = await dbConnect("wishlists");
    const items = await wishlistCollection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    const legacyFurnitureIds = items
      .filter((item) => !item.vendorEmail && ObjectId.isValid(item.furnitureId))
      .map((item) => new ObjectId(item.furnitureId));

    if (legacyFurnitureIds.length > 0) {
      const furnitureCollection = await dbConnect(collections.FURNITURE);
      const furniture = await furnitureCollection
        .find({ _id: { $in: legacyFurnitureIds } })
        .toArray();
      const furnitureById = new Map(
        furniture.map((item) => [item._id.toString(), item]),
      );

      items.forEach((item) => {
        const matchingFurniture = furnitureById.get(item.furnitureId?.toString());
        if (matchingFurniture) {
          item.vendorName = matchingFurniture.vendorName;
          item.vendorEmail = matchingFurniture.vendorEmail;
          item.category = matchingFurniture.category;
        }
      });
    }

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
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const { furnitureItem } = await request.json();
    const userEmail = auth.session.user.email?.toLowerCase();

    if (!furnitureItem) {
      return NextResponse.json(
        { success: false, message: "furnitureItem is required" },
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
      category: furnitureItem.category,
      vendorName: furnitureItem.vendorName,
      vendorEmail: furnitureItem.vendorEmail,
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
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userEmail = auth.session.user.email?.toLowerCase();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Wishlist item id is required" },
        { status: 400 }
      );
    }

    const wishlistCollection = await dbConnect("wishlists");
    await wishlistCollection.deleteOne({ _id: new ObjectId(id), userEmail });

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
