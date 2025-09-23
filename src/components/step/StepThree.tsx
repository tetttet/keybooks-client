"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import Header from "../ui/Header";
import Container from "../ui/Container";

const StepThree = () => {
  const [answer, setAnswer] = useState("");
  const t = useTranslations("All.step.stepThree");

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-10">
      {/* Заголовок */}
      <Header title={t("title")} subtitle={t("subtitle")} />

      {/* Карточка */}
      <Container>
        <h3 className="text-base font-medium mb-2 text-left">
          {t("header")}
          </h3>

        {/* Превью страницы */}
        <div className="px-28 py-10 bg-[#131927] h-[350px] flex items-center justify-center">
          <div className="bg-white h-[300px] shadow-md max-w-md w-full flex flex-col justify-between p-6">
            <p className="text-gray-800 font-medium text-[6px]">
              {t("questions")}
            </p>
            <p className="text-gray-700 text-[8px] whitespace-pre-wrap text-left mt-4 flex-1">
              {answer || t("answer")}
            </p>
            <div className="flex justify-between text-[6px] text-gray-500 mt-4">
              <span>
                {new Date().toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </span>
              <span>{t("page")}</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-white text-left mt-2">
          <p className="mb-2">{t("question")}</p>
          <p>{t("questions")}</p>
        </div>
      </Container>
      {/* Поле ввода */}
      <div className="flex justify-center w-full px-4 -mt-10">
        <div className="px-6 rounded-2xl w-full max-w-lg bg-gradient-to-t from-[#eef2fb] to-[#f4f7ff]">
          <div className="bg-white rounded-xl py-6 px-6 shadow-lg">
            <div className="text-left">
              <label className="block text-sm font-medium mb-1">
                {t("anw")}
              </label>
              <Textarea
                placeholder={t("answerPlaceholder")}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="h-24 border-white focus:border-white focus:ring-0 -ml-3 -mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepThree;
