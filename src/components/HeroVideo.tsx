"use client";
import React from "react";
import OrderButton from "./ui/OrderButton";
import { useTranslations } from "next-intl";

const HeroVideo = () => {
  const t = useTranslations("All.heroVideo");
  return (
    <div className="w-full min-h-[80vh] bg-white flex flex-col items-center justify-center px-4 text-center">
      {/* Видео */}
      <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[400px] lg:h-[400px] mb-8 overflow-hidden rounded-lg shadow-lg">
        <video
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
      </div>

      {/* Заголовок */}
      <h1 className="text-2xl md:text-3xl  mb-2">{t("title")}</h1>

      {/* Подзаголовок */}
      <p className="text-gray-600 max-w-[260px] lg:max-w-full text-[14px] lg:text-[14px] mb-2">
        {t("subtitle")}
      </p>

      {/* Кнопка */}
      <OrderButton className="bg-[#141a27] text-white py-5 px-4" />
    </div>
  );
};

export default HeroVideo;
