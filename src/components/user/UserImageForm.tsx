"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Trash2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/diogifwah/upload";
const UPLOAD_PRESET = "new_books";

interface UploadedImage {
  url: string;
  public_id: string;
}

const UserImageForm: React.FC = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("User.upload");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);

    const uploaded: UploadedImage[] = [];

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const res = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        uploaded.push({ url: data.secure_url, public_id: data.public_id });
      } catch (err) {
        console.error("Upload error", err);
      }
    }

    setImages((prev) => [...prev, ...uploaded]);
    setLoading(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: { "image/*": [] },
  });

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert(t("copy"));
  };

  const deleteImage = async (public_id: string) => {
    if (!window.confirm(t("deleteConfirm"))) return;

    try {
      const res = await fetch(`/api/delete-image?public_id=${public_id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setImages((prev) => prev.filter((img) => img.public_id !== public_id));
      } else {
        alert(t("deleteError"));
        console.error(data);
      }
    } catch (err) {
      console.error(err);
      alert(t("deleteError"));
    }
  };

  return (
    <div className="space-y-4 px-6 mb-2 lg:-mb-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition"
      >
        <input {...getInputProps()} />
        <p className="text-white hover:text-blue-400">{t("dropzone")}</p>
      </div>

      {loading && <p className="text-white">{t("loading")}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <Card key={img.public_id} className="relative">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="truncate">{img.public_id}</CardTitle>
              <Button
                onClick={() => deleteImage(img.public_id)}
                variant="destructive"
                size="sm"
              >
                <Trash2 size={16} />
              </Button>
            </CardHeader>
            <CardContent>
              <Image
                width={1280}
                height={720}
                src={img.url}
                alt="uploaded"
                className="w-full h-32 object-cover rounded-md"
              />
              <div className="flex mt-2 gap-2">
                <Input value={img.url} readOnly />
                <Button
                  onClick={() => copyToClipboard(img.url)}
                  variant="outline"
                >
                  <Copy size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserImageForm;
