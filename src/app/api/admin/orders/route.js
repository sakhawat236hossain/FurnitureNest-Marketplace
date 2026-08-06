import { dbConnect, collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ordersCollection = await dbConnect(collections.ORDERS);

    const orders = await ordersCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Admin Orders GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const { orderId, status, approvedByAdmin } = await request.json();

    if (!orderId || (status === undefined && approvedByAdmin === undefined)) {
      return NextResponse.json(
        {
          success: false,
          message: "orderId and at least one update field are required",
        },
        { status: 400 },
      );
    }

    const updateData = { updatedAt: new Date() };
    if (status !== undefined) {
      if (!["pending", "approved", "delivered"].includes(status)) {
        return NextResponse.json(
          { success: false, message: "Invalid order status" },
          { status: 400 },
        );
      }
      updateData.status = status;
    }
    if (approvedByAdmin !== undefined)
      updateData.approvedByAdmin = approvedByAdmin;

    const ordersCollection = await dbConnect(collections.ORDERS);

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("Admin Orders PATCH Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order status" },
      { status: 500 },
    );
  }
}
