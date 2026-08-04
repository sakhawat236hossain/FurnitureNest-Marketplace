import { dbConnect, collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Vendor email is required" },
        { status: 400 }
      );
    }

    const furnitureCollection = await dbConnect(collections.FURNITURE);
    const ordersCollection = await dbConnect(collections.ORDERS);

    const totalFurniture = await furnitureCollection.countDocuments({
      vendorEmail: email,
    });

    const vendorOrders = await ordersCollection
      .find({ "items.vendorEmail": email })
      .toArray();

    const totalOrders = vendorOrders.length;
    const pendingOrders = vendorOrders.filter(
      (o) => o.status === "pending" || o.status === "processing"
    ).length;

    const totalEarnings = vendorOrders.reduce(
      (acc, curr) => acc + (Number(curr.totalPrice) || 0),
      0
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalFurniture,
        totalOrders,
        pendingOrders,
        totalEarnings,
      },
    });
  } catch (error) {
    console.error("Seller Stats GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch seller stats" },
      { status: 500 }
    );
  }
}
