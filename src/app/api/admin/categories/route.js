import { dbConnect, collections } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/authGuard";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const DEFAULT_CATEGORIES = [
  {
    name: "Living Room",
    slug: "living-room",
    description: "Sofas, coffee tables, armchairs, and media units for cozy living spaces.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
    status: "active",
    featured: true,
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    description: "Beds, wardrobes, nightstands, and dressing tables designed for restful sleep.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop",
    status: "active",
    featured: true,
  },
  {
    name: "Dining",
    slug: "dining",
    description: "Dining tables, chairs, cabinets, and bar stools for family meals.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=800&auto=format&fit=crop",
    status: "active",
    featured: true,
  },
  {
    name: "Office",
    slug: "office",
    description: "Ergonomic chairs, executive desks, and bookshelves for productive workspaces.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop",
    status: "active",
    featured: false,
  },
  {
    name: "Outdoor",
    slug: "outdoor",
    description: "Patio chairs, garden benches, and weatherproof tables for outdoor relaxing.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    status: "active",
    featured: false,
  },
  {
    name: "Decor & Accessories",
    slug: "decor-accessories",
    description: "Lamps, mirrors, rugs, and decorative pieces to enhance modern home interiors.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop",
    status: "active",
    featured: false,
  },
];

export async function GET(req) {
  try {
    const categoryCol = await dbConnect(collections.CATEGORIES);
    const furnitureCol = await dbConnect(collections.FURNITURE);

    let categories = await categoryCol.find({}).sort({ createdAt: -1 }).toArray();

    // Auto-seed if database categories collection is empty
    if (categories.length === 0) {
      const now = new Date();
      const docsToInsert = DEFAULT_CATEGORIES.map((cat) => ({
        ...cat,
        createdAt: now,
        updatedAt: now,
      }));
      await categoryCol.insertMany(docsToInsert);
      categories = await categoryCol.find({}).sort({ createdAt: -1 }).toArray();
    }

    // Attach real-time product counts for each category
    const furnitureItems = await furnitureCol
      .find({ status: "approved", hidden: { $ne: true } })
      .project({ category: 1 })
      .toArray();

    const countMap = {};
    furnitureItems.forEach((item) => {
      if (item.category) {
        const catName = item.category.toLowerCase().trim();
        countMap[catName] = (countMap[catName] || 0) + 1;
      }
    });

    const enrichedCategories = categories.map((cat) => {
      const catKey = (cat.name || "").toLowerCase().trim();
      const slugKey = (cat.slug || "").toLowerCase().trim();
      return {
        ...cat,
        productCount: countMap[catKey] || countMap[slugKey] || 0,
      };
    });

    return NextResponse.json({
      success: true,
      categories: enrichedCategories,
    });
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const authCheck = await requireAuth(["admin"]);
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json();
    const { name, description, image, status, featured } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const categoryCol = await dbConnect(collections.CATEGORIES);

    // Check if category name or slug already exists
    const existing = await categoryCol.findOne({
      $or: [{ slug }, { name: { $regex: `^${name.trim()}$`, $options: "i" } }],
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Category already exists with this name" },
        { status: 400 }
      );
    }

    const newCategory = {
      name: name.trim(),
      slug,
      description: description?.trim() || "",
      image:
        image?.trim() ||
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
      status: status || "active",
      featured: Boolean(featured),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await categoryCol.insertOne(newCategory);

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      category: { ...newCategory, _id: result.insertedId },
    });
  } catch (error) {
    console.error("POST Category Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const authCheck = await requireAuth(["admin"]);
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json();
    const { id, name, description, image, status, featured } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Category ID is required" },
        { status: 400 }
      );
    }

    const categoryCol = await dbConnect(collections.CATEGORIES);

    const updateFields = { updatedAt: new Date() };

    if (name) {
      updateFields.name = name.trim();
      updateFields.slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    if (description !== undefined) updateFields.description = description.trim();
    if (image) updateFields.image = image.trim();
    if (status) updateFields.status = status;
    if (featured !== undefined) updateFields.featured = Boolean(featured);

    await categoryCol.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("PUT Category Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const authCheck = await requireAuth(["admin"]);
    if (!authCheck.authorized) return authCheck.response;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Category ID is required" },
        { status: 400 }
      );
    }

    const categoryCol = await dbConnect(collections.CATEGORIES);
    await categoryCol.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 }
    );
  }
}
