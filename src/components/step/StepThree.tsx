"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

const StepThree = () => {
  const [answer, setAnswer] = useState("");
  const t = useTranslations("All.step.stepThree");

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

          {/* Превью страницы */}
          <div className="bg-white rounded-xl shadow-md w-full aspect-[3/4] flex flex-col justify-between p-6 mb-6">
            <p className="text-gray-800 font-medium text-center">
              {t("questions")}
            </p>
            <p className="text-gray-700 text-sm whitespace-pre-wrap text-left mt-4 flex-1">
              {answer || t("answer")}
            </p>
            <div className="flex justify-between text-xs text-gray-500 mt-4">
              <span>
                {new Date().toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </span>
              <span>
                {t("page")}
              </span>
            </div>
          </div>

          {/* Поле ввода */}
          <div className="text-left">
            <label className="block text-sm font-medium mb-1">
              {t("answer")}
            </label>
            <Textarea
              placeholder={t("answerPlaceholder")}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="h-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepThree;
