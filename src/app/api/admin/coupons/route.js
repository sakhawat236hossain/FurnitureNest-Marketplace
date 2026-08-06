import { dbConnect, collections } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/authGuard";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const DEFAULT_COUPONS = [
  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minSpend: 2000,
    maxDiscount: 1500,
    usageLimit: 500,
    usedCount: 34,
    status: "active",
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    description: "Welcome discount for new customers.",
  },
  {
    code: "FURNISH500",
    discountType: "fixed",
    discountValue: 500,
    minSpend: 5000,
    maxDiscount: 500,
    usageLimit: 200,
    usedCount: 89,
    status: "active",
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    description: "Flat ৳500 discount on orders above ৳5,000.",
  },
  {
    code: "EIDSPECIAL",
    discountType: "percentage",
    discountValue: 15,
    minSpend: 10000,
    maxDiscount: 3000,
    usageLimit: 100,
    usedCount: 12,
    status: "active",
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    description: "Special Eid promotional discount on luxury collections.",
  },
];

export async function GET(request) {
  try {
    const auth = await requireAuth("admin");
    if (!auth.authorized) return auth.response;

    const couponCol = await dbConnect(collections.COUPONS);
    let coupons = await couponCol.find({}).sort({ createdAt: -1 }).toArray();

    // Auto-seed sample coupons if database collection is empty
    if (coupons.length === 0) {
      const now = new Date();
      const docsToInsert = DEFAULT_COUPONS.map((c) => ({
        ...c,
        createdAt: now,
        updatedAt: now,
      }));
      await couponCol.insertMany(docsToInsert);
      coupons = await couponCol.find({}).sort({ createdAt: -1 }).toArray();
    }

    return NextResponse.json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.error("GET Admin Coupons Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = await requireAuth("admin");
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const {
      code,
      discountType,
      discountValue,
      minSpend,
      maxDiscount,
      usageLimit,
      expiryDate,
      status,
      description,
    } = body;

    if (!code || !code.trim()) {
      return NextResponse.json(
        { success: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    const formattedCode = code.toUpperCase().trim();
    const couponCol = await dbConnect(collections.COUPONS);

    const existing = await couponCol.findOne({ code: formattedCode });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Coupon code already exists" },
        { status: 400 }
      );
    }

    const newCoupon = {
      code: formattedCode,
      discountType: discountType || "percentage",
      discountValue: Number(discountValue) || 0,
      minSpend: Number(minSpend) || 0,
      maxDiscount: Number(maxDiscount) || 0,
      usageLimit: Number(usageLimit) || 100,
      usedCount: 0,
      status: status || "active",
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      description: description?.trim() || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await couponCol.insertOne(newCoupon);

    return NextResponse.json({
      success: true,
      message: "Coupon created successfully",
      coupon: { ...newCoupon, _id: result.insertedId },
    });
  } catch (error) {
    console.error("POST Admin Coupon Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create coupon" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const auth = await requireAuth("admin");
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const {
      id,
      code,
      discountType,
      discountValue,
      minSpend,
      maxDiscount,
      usageLimit,
      expiryDate,
      status,
      description,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Coupon ID is required" },
        { status: 400 }
      );
    }

    const couponCol = await dbConnect(collections.COUPONS);

    const updateFields = { updatedAt: new Date() };

    if (code) updateFields.code = code.toUpperCase().trim();
    if (discountType) updateFields.discountType = discountType;
    if (discountValue !== undefined) updateFields.discountValue = Number(discountValue);
    if (minSpend !== undefined) updateFields.minSpend = Number(minSpend);
    if (maxDiscount !== undefined) updateFields.maxDiscount = Number(maxDiscount);
    if (usageLimit !== undefined) updateFields.usageLimit = Number(usageLimit);
    if (expiryDate) updateFields.expiryDate = new Date(expiryDate);
    if (status) updateFields.status = status;
    if (description !== undefined) updateFields.description = description.trim();

    await couponCol.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return NextResponse.json({
      success: true,
      message: "Coupon updated successfully",
    });
  } catch (error) {
    console.error("PUT Admin Coupon Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const auth = await requireAuth("admin");
    if (!auth.authorized) return auth.response;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Coupon ID is required" },
        { status: 400 }
      );
    }

    const couponCol = await dbConnect(collections.COUPONS);
    await couponCol.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Admin Coupon Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
