import { dbConnect, collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get("role");
    const searchQuery = searchParams.get("q");

    const usersCollection = await dbConnect(collections.USERS);

    const query = {};
    if (roleFilter && roleFilter !== "all") {
      query.role = roleFilter;
    }
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const users = await usersCollection
      .find(query, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Admin Users GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const { userId, role, status, isFraud } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 },
      );
    }

    const usersCollection = await dbConnect(collections.USERS);
    const furnitureCollection = await dbConnect(collections.FURNITURE);

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const updateFields = {};
    if (role) {
      if (!["user", "seller", "admin"].includes(role)) {
        return NextResponse.json(
          { success: false, message: "Invalid role value" },
          { status: 400 },
        );
      }
      updateFields.role = role;
    }
    if (status) {
      updateFields.status = status;
    }
    if (typeof isFraud === "boolean") {
      updateFields.isFraud = isFraud;
    }
    updateFields.updatedAt = new Date();

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateFields },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    if (typeof isFraud === "boolean") {
      await furnitureCollection.updateMany(
        { vendorEmail: user.email },
        { $set: { hidden: isFraud } },
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Admin Users PATCH Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 },
      );
    }

    const usersCollection = await dbConnect(collections.USERS);
    const result = await usersCollection.deleteOne({
      _id: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Admin Users DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user" },
      { status: 500 },
    );
  }
}
