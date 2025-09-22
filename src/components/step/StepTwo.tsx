"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { coverDesigns, MS_coverDesigns } from "@/constants/data";
import { useLocale, useTranslations } from "next-intl";

const StepTwo = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const t = useTranslations("All.step.stepTwo");
  const locale = useLocale();
  const data = locale === "ms" ? MS_coverDesigns : coverDesigns;

  const [design, setDesign] = useState(data[0]);

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

      {/* Карточка выбора */}
      <div className="bg-gradient-to-b from-[#e0ebff] to-[#f4f7ff] p-6 rounded-2xl w-full max-w-lg">
        <div className="bg-gradient-to-r from-[#2a344c] to-[#222630] text-white rounded-xl p-6">
          <h3 className="text-base font-medium mb-4">{t("header")}</h3>

          {/* Превью обложки */}
          <div
            className={`w-full aspect-[3/4] rounded-xl flex flex-col items-center justify-center text-center shadow-lg mb-6 bg-gradient-to-b ${design.gradient}`}
          >
            <h1 className="text-xl font-bold text-black px-4">
              {title || t("bookName")}
            </h1>
            <p className="text-sm text-black mt-2">{author || t("author")}</p>
          </div>

          {/* Форма */}
          <div className="space-y-4 text-left">
            <div>
              <Label className="mb-2">{t("bookName")}</Label>
              <Input
                type="text"
                placeholder={t("bookPlaceholder")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="mb-2">{t("author")}</Label>
              <Input
                type="text"
                placeholder={t("authorPlaceholder")}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="mb-2">{t("designs")}</Label>
              <Select
                onValueChange={(val) =>
                  setDesign(
                    coverDesigns.find((d) => d.name === val) || coverDesigns[0]
                  )
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t("designAlt")} />
                </SelectTrigger>
                <SelectContent>
                  {data.map((d, idx) => (
                    <SelectItem key={idx} value={d.name}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
