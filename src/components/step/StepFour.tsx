"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useTranslations } from "next-intl";

const StepFour = () => {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const t = useTranslations("All.step.stepFour");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-10">
      {/* Заголовок */}
      <div>
        <h2 className="text-3xl font-serif font-medium max-w-xs lg:max-w-lg mx-auto">
          {t("title")}
        </h2>
        <p className="text-gray-600 text-sm mt-2 max-w-xs lg:max-w-lg mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* Карточка */}
      <div className="bg-gradient-to-b from-[#e0ebff] to-[#f4f7ff] p-6 rounded-2xl w-full max-w-lg">
        <div className="bg-gradient-to-r from-[#2a344c] to-[#222630] text-white rounded-xl p-6">
          <h3 className="text-base font-medium mb-4">{t("header")}</h3>

          {/* Превью фото */}
          <div className="relative w-full aspect-[4/3] bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden mb-6">
            {image ? (
              <Image
                fill
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">{t("notChoosen")}</span>
            )}

            {/* Наложение текста */}
            {(date || description) && image && (
              <div className="absolute inset-0 bg-black/20 flex flex-col justify-between p-4 text-white">
                <p className="text-sm">{date}</p>
                <p className="text-lg font-medium text-center">{description}</p>
              </div>
            )}
          </div>

          {/* Форма */}
          <div className="space-y-4 text-left">
            <div>
              <Label className="mb-2">{t("data")}</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="mb-2">{t("description")}</Label>
              <Input
                type="text"
                placeholder={t("descriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="mb-2">{t("addPhoto")}</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepFour;
