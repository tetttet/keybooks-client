"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { MS_recipients, recipients } from "@/constants/data";
import { useLocale, useTranslations } from "next-intl";

const UserChooseTarget: React.FC<{
  target: string | null;
  setTarget: (t: string | null) => void;
  onNext?: () => void;
}> = ({ target, setTarget, onNext }) => {
  const locale = useLocale();
  const t = useTranslations("All.createBook");
  const data = locale === "ms" ? MS_recipients : recipients;

  return (
    <div className="flex justify-center w-full px-0 lg:px-4">
      <div className="bg-gradient-to-b from-[#e0ebff] to-[#f4f7ff] p-0 lg:p-0 rounded-2xl w-full max-w-2xl">
        <div className="text-white rounded-xl p-6">
          <Card className="border-none mb-6 bg-gradient-to-r from-[#2a344c] to-[#222630] text-white shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                {t("chooseRecipient")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {data.map((item) => {
                  const active = target === item;
                  return (
                    <button
                      key={item}
                      onClick={() => setTarget(item)}
                      className={`w-full rounded-lg px-4 py-2 text-center font-medium transition border
                    ${
                      active
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-white border-slate-600 hover:bg-slate-700"
                    }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  onClick={onNext}
                  disabled={!target}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6"
                >
                  Далее
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserChooseTarget;
