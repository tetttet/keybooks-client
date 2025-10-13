// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: "dbvwldsrw",
  api_key: "485772356342131",
  api_secret: "zu4lkw24X8OoWu00Ljp3gJWAroU",
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // читаем файл как buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // загружаем на Cloudinary
    const result = await cloudinary.v2.uploader.upload_stream({
      folder: "responses",
    });

    // upload_stream требует промиса
    const uploaded: Record<string, unknown> = await new Promise(
      (resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: "responses" },
          (err, res) => {
            if (err) reject(err);
            else if (!res) reject(new Error("No response from Cloudinary"));
            else resolve(res as Record<string, unknown>);
          }
        );
        stream.end(buffer);
      }
    );

    return NextResponse.json({
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
