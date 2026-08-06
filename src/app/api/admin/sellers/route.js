import { dbConnect, collections } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/authGuard";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const auth = await requireAuth("admin");
    if (!auth.authorized) return auth.response;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q") || "";
    const verificationFilter = searchParams.get("verification") || "all";

    const usersCollection = await dbConnect(collections.USERS);
    const furnitureCollection = await dbConnect(collections.FURNITURE);
    const ordersCollection = await dbConnect(collections.ORDERS);

    // Find all users with role 'seller' (or containing vendor/seller attributes)
    const sellerQuery = {
      $or: [{ role: "seller" }, { role: "vendor" }],
    };

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      sellerQuery.$and = [
        { $or: [{ name: regex }, { email: regex }, { shopName: regex }] },
      ];
    }

    if (verificationFilter !== "all") {
      if (verificationFilter === "verified") {
        sellerQuery.verified = true;
      } else if (verificationFilter === "pending") {
        sellerQuery.verified = false;
      }
    }

    const rawSellers = await usersCollection
      .find(sellerQuery, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    // Fetch furniture items and orders for all sellers in batch
    const sellerEmails = rawSellers.map((s) => s.email).filter(Boolean);

    const furnitureListings = await furnitureCollection
      .find({ vendorEmail: { $in: sellerEmails } })
      .toArray();

    const allOrders = await ordersCollection.find({}).toArray();

    // Aggregate stats per seller
    const enrichedSellers = rawSellers.map((seller) => {
      const sellerProducts = furnitureListings.filter(
        (item) => item.vendorEmail === seller.email
      );

      const approvedProducts = sellerProducts.filter(
        (item) => item.status === "approved"
      ).length;

      const pendingProducts = sellerProducts.filter(
        (item) => item.status === "pending" || item.status === "requested"
      ).length;

      // Calculate total orders and revenue involving this seller's products
      let totalOrders = 0;
      let totalRevenue = 0;

      allOrders.forEach((order) => {
        if (order.items && Array.isArray(order.items)) {
          let sellerItemsInOrder = order.items.filter(
            (item) => item.vendorEmail === seller.email
          );
          if (sellerItemsInOrder.length > 0) {
            totalOrders += 1;
            sellerItemsInOrder.forEach((item) => {
              const price =
                typeof item.price === "number"
                  ? item.price
                  : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
              const qty = item.quantity || 1;
              totalRevenue += price * qty;
            });
          }
        }
      });

      return {
        ...seller,
        totalProducts: sellerProducts.length,
        approvedProducts,
        pendingProducts,
        totalOrders,
        totalRevenue,
        verified: Boolean(seller.verified),
        status: seller.status || "active",
      };
    });

    return NextResponse.json({
      success: true,
      sellers: enrichedSellers,
    });
  } catch (error) {
    console.error("GET Admin Sellers Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch seller data" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const auth = await requireAuth("admin");
    if (!auth.authorized) return auth.response;

    const { sellerId, verified, status, commissionRate } = await request.json();

    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "sellerId is required" },
        { status: 400 }
      );
    }

    const usersCollection = await dbConnect(collections.USERS);

    const updateFields = { updatedAt: new Date() };

    if (typeof verified === "boolean") {
      updateFields.verified = verified;
    }

    if (status && ["active", "suspended", "inactive"].includes(status)) {
      updateFields.status = status;
    }

    if (typeof commissionRate === "number") {
      updateFields.commissionRate = commissionRate;
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(sellerId) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Seller profile updated successfully",
    });
  } catch (error) {
    console.error("PATCH Admin Seller Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update seller" },
      { status: 500 }
    );
  }
}
