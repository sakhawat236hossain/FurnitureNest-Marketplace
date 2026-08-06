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

    const ordersCollection = await dbConnect(collections.ORDERS);
    const normalizedEmail = email.trim().toLowerCase();
    const orders = await ordersCollection
      .find({
        $or: [
          { vendorEmail: normalizedEmail },
          { "items.vendorEmail": normalizedEmail, vendorEmail: { $exists: false } },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Seller Orders GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch vendor orders" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const { orderId, status, vendorEmail } = await request.json();

    if (!orderId || !status || !vendorEmail) {
      return NextResponse.json(
        { success: false, message: "orderId, status, and vendorEmail are required" },
        { status: 400 },
      );
    }

    if (!["approved", "delivered"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Status must be approved or delivered" },
        { status: 400 },
      );
    }

    const ordersCollection = await dbConnect(collections.ORDERS);
    const result = await ordersCollection.updateOne(
      {
        _id: new ObjectId(orderId),
        vendorEmail: vendorEmail.trim().toLowerCase(),
        ...(status === "approved" ? { status: "pending" } : { status: "approved" }),
      },
      { $set: { status, updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Seller Orders PATCH Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order status" },
      { status: 500 },
    );
  }
}
