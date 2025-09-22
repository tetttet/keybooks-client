import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: "diogifwah",
  api_key: "372623341317342",
  api_secret: "WdnQU4ecxiFa0iqK7yvEhiovTdE",
});

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const public_id = searchParams.get("public_id");

    if (!public_id) {
      return NextResponse.json({ error: "public_id required" }, { status: 400 });
    }

    await cloudinary.v2.uploader.destroy(public_id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete image", details: err }, { status: 500 });
  }
}
