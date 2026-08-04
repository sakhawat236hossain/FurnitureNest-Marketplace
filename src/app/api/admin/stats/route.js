import { dbConnect, collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const usersCollection = await dbConnect(collections.USERS);
    const furnitureCollection = await dbConnect(collections.FURNITURE);
    const ordersCollection = await dbConnect(collections.ORDERS);

    const totalUsers = await usersCollection.countDocuments();
    const totalSellers = await usersCollection.countDocuments({ role: "seller" });
    const totalFurniture = await furnitureCollection.countDocuments();
    const totalOrders = await ordersCollection.countDocuments();

    // Calculate revenue from orders
    const orders = await ordersCollection.find({}).toArray();
    const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0);

    const recentUsers = await usersCollection
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalSellers,
        totalFurniture,
        totalOrders,
        totalRevenue,
      },
      recentUsers,
    });
  } catch (error) {
    console.error("Admin Stats API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
