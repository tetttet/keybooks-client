"use client";

import { recipients, MS_recipients } from "@/constants/data";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";

const StepOne = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const t = useTranslations("All.step.stepOne");
  const locale = useLocale();

  const data = locale === "ms" ? MS_recipients : recipients;

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
          <div className="flex flex-col gap-2">
            {data.map((item, idx) => (
              <Button
                key={idx}
                variant={selected === item ? "default" : "ghost"}
                onClick={() => setSelected(item)}
                className={cn(
                  "w-full text-sm font-normal border border-white/20"
                )}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
