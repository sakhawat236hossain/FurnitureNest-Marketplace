import { dbConnect, collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const vendorEmail = searchParams.get("vendorEmail");
    const search = searchParams.get("search");

    const furnitureCollection = await dbConnect(collections.FURNITURE);
    const query = {};

    if (status && status !== "all") query.status = status;
    if (category && category !== "all") query.category = category;
    if (featured === "true") query.featured = true;
    if (vendorEmail) query.vendorEmail = vendorEmail;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const furniture = await furnitureCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, furniture });
  } catch (error) {
    console.error("Admin Furniture GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch furniture" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const furnitureCollection = await dbConnect(collections.FURNITURE);

    const requiredFields = ["name", "price", "vendorEmail", "vendorName"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 },
        );
      }
    }

    const newItem = {
      name: body.name,
      category: body.category || "General",
      price: Number(body.price),
      oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
      stock: Number(body.stock) || 1,
      description: body.description || "",
      material: body.material || "Wood",
      dimensions: body.dimensions || "",
      image: body.image || "",
      vendorEmail: body.vendorEmail,
      vendorName: body.vendorName || "Admin",
      status: body.status || "approved",
      featured: false,
      hidden: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await furnitureCollection.insertOne(newItem);

    return NextResponse.json({
      success: true,
      message: "Furniture item created successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Admin Furniture POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create furniture" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { furnitureId, featured, status, ...updates } = body;

    if (!furnitureId) {
      return NextResponse.json(
        { success: false, message: "furnitureId is required" },
        { status: 400 },
      );
    }

    const furnitureCollection = await dbConnect(collections.FURNITURE);
    const item = await furnitureCollection.findOne({
      _id: new ObjectId(furnitureId),
    });

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Furniture item not found" },
        { status: 404 },
      );
    }

    const updateFields = { updatedAt: new Date() };

    if (typeof featured === "boolean") {
      if (featured && item.status !== "approved") {
        return NextResponse.json(
          {
            success: false,
            message: "Only approved items can be featured",
          },
          { status: 400 },
        );
      }

      if (featured && !item.featured) {
        const featuredCount = await furnitureCollection.countDocuments({
          featured: true,
          status: "approved",
        });
        if (featuredCount >= 6) {
          return NextResponse.json(
            {
              success: false,
              message: "No more than 6 featured items are allowed",
            },
            { status: 400 },
          );
        }
      }

      updateFields.featured = featured;
    }

    if (status) {
      updateFields.status = status;
      if (status !== "approved") {
        updateFields.featured = false;
      }
    }

    if (updates.name) updateFields.name = updates.name;
    if (updates.category) updateFields.category = updates.category;
    if (updates.price !== undefined) updateFields.price = Number(updates.price);
    if (updates.oldPrice !== undefined)
      updateFields.oldPrice = updates.oldPrice
        ? Number(updates.oldPrice)
        : null;
    if (updates.stock !== undefined) updateFields.stock = Number(updates.stock);
    if (updates.description !== undefined)
      updateFields.description = updates.description;
    if (updates.material !== undefined)
      updateFields.material = updates.material;
    if (updates.dimensions !== undefined)
      updateFields.dimensions = updates.dimensions;
    if (updates.image !== undefined) updateFields.image = updates.image;

    const result = await furnitureCollection.updateOne(
      { _id: new ObjectId(furnitureId) },
      { $set: updateFields },
    );

    return NextResponse.json({
      success: true,
      message: "Furniture item updated successfully",
    });
  } catch (error) {
    console.error("Admin Furniture PATCH Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update furniture",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const furnitureId = searchParams.get("furnitureId");

    if (!furnitureId) {
      return NextResponse.json(
        { success: false, message: "furnitureId is required" },
        { status: 400 },
      );
    }

    const furnitureCollection = await dbConnect(collections.FURNITURE);
    const result = await furnitureCollection.deleteOne({
      _id: new ObjectId(furnitureId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Furniture item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Furniture item deleted successfully",
    });
  } catch (error) {
    console.error("Admin Furniture DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete furniture" },
      { status: 500 },
    );
  }
}
