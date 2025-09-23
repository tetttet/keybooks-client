"use client";

import { recipients, MS_recipients } from "@/constants/data";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import Header from "../ui/Header";
import Container from "../ui/Container";

const StepOne = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const t = useTranslations("All.step.stepOne");
  const locale = useLocale();

  const data = locale === "ms" ? MS_recipients : recipients;

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-10">
      {/* Заголовок */}
      <Header title={t("title")} subtitle={t("subtitle")} />

      {/* Карточка выбора */}
      <Container>
        <h3 className="text-base font-medium mb-4">{t("header")}</h3>
        <div className="flex flex-col gap-2">
          {data.map((item, idx) => (
            <Button
              key={idx}
              onClick={() => setSelected(item)}
              className={cn(
                "w-full text-sm font-normal border border-white/20 transition-colors hover:bg-transparent hover:text-white",
                selected === item
                  ? "bg-white text-black"
                  : "bg-transparent text-white hover:bg-transparent"
              )}
            >
              {item}
            </Button>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default StepOne;
