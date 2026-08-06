import { dbConnect, collections } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/authGuard";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const DEFAULT_PAYOUTS = [
  {
    vendorName: "Legacy Woodworks",
    vendorEmail: "legacywood@gmail.com",
    shopName: "Legacy Woodworks BD",
    amount: 45000,
    grossSales: 50000,
    commissionFee: 5000,
    paymentMethod: "bKash Personal",
    accountDetails: "01711223344",
    status: "pending",
    requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    transactionId: "",
    notes: "Payout request for July delivered dining sets.",
  },
  {
    vendorName: "Royal Craftsmen",
    vendorEmail: "royalcrafts@gmail.com",
    shopName: "Royal Craftsmen Studio",
    amount: 72000,
    grossSales: 80000,
    commissionFee: 8000,
    paymentMethod: "DBBL Bank Transfer",
    accountDetails: "A/C: 148.110.456782, Dutch-Bangla Bank, Dhanmondi Branch",
    status: "approved",
    requestedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    processedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    transactionId: "TXN8942019482",
    notes: "Bank transfer processed successfully.",
  },
  {
    vendorName: "Modern Living Furniture",
    vendorEmail: "modernliving@gmail.com",
    shopName: "Modern Living Decor",
    amount: 28500,
    grossSales: 30000,
    commissionFee: 1500,
    paymentMethod: "Nagad",
    accountDetails: "01822334455",
    status: "pending",
    requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    transactionId: "",
    notes: "Pending audit of order delivery confirmation.",
  },
];

export async function GET(request) {
  try {
    const auth = await requireAuth("admin");
    if (!auth.authorized) return auth.response;

    const payoutCol = await dbConnect(collections.PAYOUTS);
    let payouts = await payoutCol.find({}).sort({ requestedAt: -1 }).toArray();

    // Auto-seed sample payouts if empty
    if (payouts.length === 0) {
      const docsToInsert = DEFAULT_PAYOUTS.map((p) => ({
        ...p,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await payoutCol.insertMany(docsToInsert);
      payouts = await payoutCol.find({}).sort({ requestedAt: -1 }).toArray();
    }

    // Financial calculations
    const totalDisbursed = payouts
      .filter((p) => p.status === "approved")
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const totalPending = payouts
      .filter((p) => p.status === "pending")
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const totalCommissionEarned = payouts
      .filter((p) => p.status === "approved")
      .reduce((acc, curr) => acc + (curr.commissionFee || 0), 0);

    return NextResponse.json({
      success: true,
      payouts,
      stats: {
        totalDisbursed,
        totalPending,
        totalCommissionEarned,
      },
    });
  } catch (error) {
    console.error("GET Admin Payouts Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch payout records" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const auth = await requireAuth("admin");
    if (!auth.authorized) return auth.response;

    const { payoutId, status, transactionId, notes } = await request.json();

    if (!payoutId) {
      return NextResponse.json(
        { success: false, message: "payoutId is required" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    const payoutCol = await dbConnect(collections.PAYOUTS);

    const updateFields = {
      status,
      updatedAt: new Date(),
    };

    if (status === "approved") {
      updateFields.processedAt = new Date();
      updateFields.transactionId = transactionId || `TXN${Date.now()}`;
    }

    if (notes !== undefined) {
      updateFields.notes = notes;
    }

    const result = await payoutCol.updateOne(
      { _id: new ObjectId(payoutId) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Payout record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Payout request marked as ${status}.`,
    });
  } catch (error) {
    console.error("PATCH Admin Payout Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update payout record" },
      { status: 500 }
    );
  }
}
