"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { recipients, MS_recipients } from "@/constants/data";
import { motion, AnimatePresence } from "framer-motion";
import OrderButton from "./ui/OrderButton";
import { useLocale, useTranslations } from "next-intl";

const Hero = () => {
  const [index, setIndex] = useState(0);
  const t = useTranslations("All.hero");
  const locale = useLocale();

  const data = locale === "ms" ? MS_recipients : recipients;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % data.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [data.length]);

  return (
    <section className="relative h-screen w-full flex items-start justify-center overflow-hidden">
      {/* Фон */}
      <Image
        src="/bg/bg.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* Контент */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-4 mt-40 md:mt-52">
        {/* Основной текст */}
        <h1 className="text-3xl md:text-4xl font-medium text-white">
          {t("title")}{" "}
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-pink-300"
            >
              {data[index]}
            </motion.span>
          </AnimatePresence>
        </h1>
        <p className="text-white max-w-2xl">{t("subtitle")}</p>

        {/* Кнопка */}
        <OrderButton className="py-5 px-5 text-sm -mt-3" />
      </div>
    </section>
  );
};

export default Hero;
