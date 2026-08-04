import { dbConnect, collections } from "@/lib/dbConnect";
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

    const ordersCollection = await dbConnect(collections.ORDERS);
    const orders = await ordersCollection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("User Orders GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user orders" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.userEmail || !data.items || !data.totalPrice) {
      return NextResponse.json(
        { success: false, message: "userEmail, items, and totalPrice are required" },
        { status: 400 }
      );
    }

    const ordersCollection = await dbConnect(collections.ORDERS);

    const newOrder = {
      userEmail: data.userEmail,
      userName: data.userName || "Customer",
      userPhone: data.userPhone || "",
      shippingAddress: data.shippingAddress || "N/A",
      items: data.items,
      totalPrice: Number(data.totalPrice),
      paymentMethod: data.paymentMethod || "Cash on Delivery",
      status: "pending",
      createdAt: new Date(),
    };

    const result = await ordersCollection.insertOne(newOrder);

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      orderId: result.insertedId,
    });
  } catch (error) {
    console.error("User Orders POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order" },
      { status: 500 }
    );
  }
}
