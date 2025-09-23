"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Header from "../ui/Header";
import Container from "../ui/Container";

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
      <Header title={t("title")} subtitle={t("subtitle")} />

      {/* Карточка */}
      <Container>
        <h3 className="text-base font-medium mb-4">{t("header")}</h3>

        {/* Превью фото */}
        <div className="relative w-full aspect-[4/3] bg-[#131927] rounded-xl shadow-md flex items-center justify-center overflow-hidden mb-6">
          {image ? (
            <Image
              width={300}
              height={200}
              src={image}
              alt="Preview"
              className="w-56 h-[60vh] object-contain"
            />
          ) : (
            <Image
              width={300}
              height={200}
              src={"/bg/bgbg.png"}
              alt="Preview"
              className="w-56 h-[60vh] object-contain"
            />
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
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder={t("datePlaceholder")}
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
          <div className="">
            <Label className="mb-2">{t("addPhoto")}</Label>
            <div className="mt-1">
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer bg-[#4b5464] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#404856] w-full text-center block"
              >
                {t("chooseFile")}
              </label>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default StepFour;
