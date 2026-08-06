import { dbConnect, collections } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/authGuard";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const auth = await requireAuth(["seller", "admin"]);
    if (!auth.authorized) return auth.response;

    const sessionEmail = auth.session.user.email?.toLowerCase();
    const queryEmail = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();
    const normalizedEmail = auth.session.user.role === "admin" ? (queryEmail || sessionEmail) : sessionEmail;

    if (!normalizedEmail) {
      return NextResponse.json(
        { success: false, message: "Vendor email is required" },
        { status: 400 },
      );
    }

    const ordersCollection = await dbConnect(collections.ORDERS);
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
    const auth = await requireAuth(["seller", "admin"]);
    if (!auth.authorized) return auth.response;

    const { orderId, status } = await request.json();
    const vendorEmail = auth.session.user.email?.toLowerCase();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: "orderId and status are required" },
        { status: 400 },
      );
    }

    if (!["pending", "approved", "shipped", "delivered", "cancelled"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid order status" },
        { status: 400 },
      );
    }

    const ordersCollection = await dbConnect(collections.ORDERS);
    const updateQuery = auth.session.user.role === "admin"
      ? { _id: new ObjectId(orderId) }
      : { _id: new ObjectId(orderId), vendorEmail };

    const result = await ordersCollection.updateOne(
      updateQuery,
      { 
        $set: { status, updatedAt: new Date() },
        $push: { timeline: { status, updatedAt: new Date(), note: `Status changed to ${status}` } }
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found or access denied" },
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
