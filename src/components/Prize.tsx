"use client";
import React from "react";
import Image from "next/image";
import OrderButton from "./ui/OrderButton";
import { useTranslations } from "next-intl";

const Prize = () => {
  const t = useTranslations("All.button");
  return (
    <div className="w-full h-screen bg-[#141a27] flex flex-col items-center justify-center space-y-6">
      {/* Фото по центру */}
      <Image
        width={256}
        height={256}
        src="/pr/prize.png"
        alt="Prize"
        className="w-80 h-80 object-contain"
      />

      {/* Текст */}
      <h1 className="text-center mt-4 text-2xl md:text-4xl font-medium text-white">
        {t("prize")}
      </h1>

      {/* Кнопка */}
      <OrderButton className="py-5 px-5 text-sm" />
    </div>
  );
};

export default Prize;
