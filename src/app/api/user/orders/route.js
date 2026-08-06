import { dbConnect, collections } from "@/lib/dbConnect";
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

    const ordersCollection = await dbConnect(collections.ORDERS);
    const orders = await ordersCollection
      .find({ userEmail: email.trim().toLowerCase() })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("User Orders GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user orders" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (
      !data.userEmail ||
      !data.userName?.trim() ||
      !data.userPhone?.trim() ||
      !data.district?.trim() ||
      !data.shippingAddress?.trim() ||
      !Array.isArray(data.items) ||
      data.items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer and delivery details are required",
        },
        { status: 400 },
      );
    }

    const hasItemWithoutVendor = data.items.some(
      (item) => !item.vendorEmail?.trim(),
    );
    if (hasItemWithoutVendor) {
      return NextResponse.json(
        { success: false, message: "Every product must have a vendor email" },
        { status: 400 },
      );
    }

    const itemsByVendor = data.items.reduce((groups, item) => {
      const vendorEmail = item.vendorEmail?.trim().toLowerCase();
      if (!groups[vendorEmail]) groups[vendorEmail] = [];
      groups[vendorEmail].push(item);
      return groups;
    }, {});

    const ordersCollection = await dbConnect(collections.ORDERS);
    const createdAt = new Date();
    const orders = Object.entries(itemsByVendor).map(([vendorEmail, items]) => ({
      userEmail: data.userEmail.trim().toLowerCase(),
      userName: data.userName.trim(),
      userImage: data.userImage || "",
      userPhone: data.userPhone.trim(),
      district: data.district.trim(),
      shippingAddress: data.shippingAddress.trim(),
      vendorEmail,
      vendorName: items[0]?.vendorName || "Vendor",
      items,
      totalPrice: items.reduce(
        (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0,
      ),
      paymentMethod: data.paymentMethod || "Cash on Delivery",
      status: "pending",
      createdAt,
      updatedAt: createdAt,
    }));

    const result = await ordersCollection.insertMany(orders);

    return NextResponse.json({
      success: true,
      message: "Order request sent to the vendor",
      orderIds: Object.values(result.insertedIds),
    });
  } catch (error) {
    console.error("User Orders POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order" },
      { status: 500 },
    );
  }
}
