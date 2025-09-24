"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import StepContainer from "@/components/ui/StepContainer";
import { MS_coverDesigns, Target, coverDesigns } from "@/constants/data";
import { useLocale, useTranslations } from "next-intl";

const Step2 = ({
  design,
  setDesign,
  title,
  setTitle,
  author,
  setAuthor,
}: {
  design: Target;
  setDesign: (value: Target) => void;
  title: string;
  setTitle: (value: string) => void;
  author: string;
  setAuthor: (value: string) => void;
}) => {
  const t = useTranslations("All.step.stepTwo");
  const locale = useLocale();
  const data = locale === "ms" ? MS_coverDesigns : coverDesigns;

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-10">
      {/* Карточка выбора */}
      <StepContainer>
        <h3 className="text-base font-medium mb-4">{t("header")}</h3>

        {/* Превью обложки */}
        <div
          className="w-full aspect-[3/4] rounded-xl flex flex-col items-center justify-center text-center shadow-lg mb-6 bg-cover bg-center"
          style={{ backgroundImage: `url(${design.image})` }}
        >
          <h1 className="text-xl font-bold text-black px-4 bg-white/70 rounded">
            {title || ""}
          </h1>
          <p className="text-sm text-black mt-2 bg-white/70 rounded px-2">
            {author || ""}
          </p>
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
      </StepContainer>
    </div>
  );
};

export default Step2;
