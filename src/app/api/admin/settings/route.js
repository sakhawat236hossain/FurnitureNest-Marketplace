import { dbConnect, collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

const SETTINGS_ID = "platform-settings";

export async function GET() {
  try {
    const settingsCollection = await dbConnect("settings");
    const settings = await settingsCollection.findOne({ _id: SETTINGS_ID });

    return NextResponse.json({
      success: true,
      settings: settings || {
        autoApproveVendorFurniture: true,
        vendorSignUpModeration: true,
      },
    });
  } catch (error) {
    console.error("Admin settings GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const settingsCollection = await dbConnect("settings");

    await settingsCollection.updateOne(
      { _id: SETTINGS_ID },
      {
        $set: {
          _id: SETTINGS_ID,
          autoApproveVendorFurniture: Boolean(body.autoApproveVendorFurniture),
          vendorSignUpModeration: Boolean(body.vendorSignUpModeration),
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({ success: true, message: "Settings updated" });
  } catch (error) {
    console.error("Admin settings PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update settings" },
      { status: 500 },
    );
  }
}
