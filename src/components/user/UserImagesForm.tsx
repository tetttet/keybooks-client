"use client";

import React, { useState } from "react";
import { useImages } from "@/context/ImagesContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const UserImagesForm: React.FC = () => {
  const { images, addImage, deleteImage, loading } = useImages();
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const t = useTranslations("User.images");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    await addImage(url, description);
    setUrl("");
    setDescription("");
  };

  const handleDelete = (idx: number) => {
    const confirmed = window.confirm(t("deleteConfirm"));
    if (confirmed) {
      deleteImage(idx);
    }
  };

  return (
    <div className="px-6 lg:py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Левая часть: форма и галерея */}
        <div className="lg:w-3/4 flex flex-col gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{t("addTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleAdd}
                className="flex flex-col sm:flex-row gap-4 w-full"
              >
                <Input
                  type="text"
                  placeholder={t("urlPlaceholder")}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="text"
                  placeholder={t("descPlaceholder")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="shrink-0">
                  {loading ? t("loading") : t("addButton")}
                </Button>
              </form>

              {/* Галерея */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <Card key={idx} className="overflow-hidden relative">
                    {img.url === "" ? (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">{t("noImage")}</span>
                      </div>
                    ) : img.url.startsWith("https://drive.google.com/") ? (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Image
                          width={400}
                          height={400}
                          src="/google-drive-logo.png"
                          alt="Google Drive"
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                    ) : img.url.startsWith("https://docs.google.com/") ? (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Image
                          width={400}
                          height={400}
                          src="/google-docs-logo.png"
                          alt="Google Docs"
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                    ) : (
                      <Image
                        width={400}
                        height={300}
                        src={img.url}
                        alt={img.description || "User image"}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    )}

                    {img.description && (
                      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-sm p-2">
                        {img.description}
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => handleDelete(idx)}
                    >
                      {t("delete")}
                    </Button>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Правая часть (инструкция) */}
        <div className="lg:w-1/4 flex-shrink-0">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{t("instructionsTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                {t.raw("instructions").map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
