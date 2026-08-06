import { dbConnect, collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { code, cartTotal } = await request.json();

    if (!code || !code.trim()) {
      return NextResponse.json(
        { success: false, message: "Please enter a promo code." },
        { status: 400 }
      );
    }

    const formattedCode = code.toUpperCase().trim();
    const couponCol = await dbConnect(collections.COUPONS);

    const coupon = await couponCol.findOne({ code: formattedCode });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Invalid promo code." },
        { status: 404 }
      );
    }

    if (coupon.status !== "active") {
      return NextResponse.json(
        { success: false, message: "This coupon is currently inactive." },
        { status: 400 }
      );
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json(
        { success: false, message: "This coupon code has expired." },
        { status: 400 }
      );
    }

    if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, message: "Coupon usage limit reached." },
        { status: 400 }
      );
    }

    const subtotal = Number(cartTotal) || 0;

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum spend of ৳${coupon.minSpend.toLocaleString()} required for this coupon.`,
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Cap discount to not exceed subtotal
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    return NextResponse.json({
      success: true,
      message: `Promo code "${coupon.code}" applied! You saved ৳${Math.round(
        discountAmount
      ).toLocaleString()}`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discountAmount),
      },
    });
  } catch (error) {
    console.error("Coupon Validation Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
