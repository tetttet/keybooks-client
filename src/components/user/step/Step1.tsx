import { Button } from "@/components/ui/button";
import StepContainer from "@/components/ui/StepContainer";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import React from "react";

type TargetType =
  | "mother"
  | "father"
  | "girlfriend"
  | "boyfriend"
  | "colleague"
  | "friend"
  | "husband"
  | "wife"
  | "parents";

const TARGETS: TargetType[] = [
  "mother",
  "father",
  "girlfriend",
  "boyfriend",
  "colleague",
  "friend",
  "husband",
  "wife",
  "parents",
];

const Step1 = ({
  selected,
  setSelected,
}: {
  selected: TargetType | null;
  setSelected: (value: TargetType | null) => void;
}) => {
  const t = useTranslations("User.CreateBook");

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-10">
      {/* Карточка выбора */}
      <StepContainer>
        <h3 className="text-base font-medium mb-4">{t("title")}</h3>
        <div className="flex flex-col gap-2">
          {TARGETS.map((item, idx) => (
            <Button
              key={idx}
              onClick={() => setSelected(item)}
              className={cn(
                "w-full text-sm font-normal border border-white/20 hover:bg-transparent hover:text-white",
                selected === item
                  ? "bg-white text-black transition-none"
                  : "bg-transparent text-white transition-none"
              )}
            >
              {item}
            </Button>
          ))}
        </div>
      </StepContainer>
    </div>
  );
};

export default Step1;
