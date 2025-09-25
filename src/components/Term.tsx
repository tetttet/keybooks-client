"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

const Term = () => {
  const t = useTranslations("Page.TermsOfUse");

  return (
    <div className="max-w-4xl mx-auto px-6 -mt-16 pb-10 text-white leading-relaxed">
      <Separator className="mb-20" />
      <h1 className="text-3xl font-bold mb-6 text-center">{t("title")}</h1>

      {/* Introduction */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">{t("introTitle")}</h2>
        <Separator className="mb-4" />
        <p dangerouslySetInnerHTML={{ __html: t.raw("introText") }} />
      </section>

      {/* Copyright */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">
          {t("copyrightTitle")}
        </h2>
        <Separator className="mb-4" />
        <p dangerouslySetInnerHTML={{ __html: t.raw("copyright") }} />
      </section>

      {/* License of Use */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">{t("licenseTitle")}</h2>
        <Separator className="mb-4" />
        <p>{t("licenseText")}</p>
        <ul className="list-disc pl-6 mt-3 space-y-1">
          {t.raw("licenseList").map((item: string, idx: number) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Account */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">{t("accountTitle")}</h2>
        <Separator className="mb-4" />
        <p>{t("accountText")}</p>
      </section>

      {/* Refund Policy */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">{t("refundTitle")}</h2>
        <Separator className="mb-4" />
        <p>{t("refundIntro")}</p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          {t.raw("refundList").map((item: string, idx: number) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      </section>

      {/* Refund Request Procedure */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">{t("refundProcTitle")}</h2>
        <Separator className="mb-4" />
        <p>{t("refundProcText")}</p>
        <p className="mt-3">{t("refundProcStepsIntro")}</p>
        <ul className="list-disc pl-6 mt-3 space-y-1">
          {t.raw("refundProcSteps").map((item: string, idx: number) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Changes */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">{t("changesTitle")}</h2>
        <Separator className="mb-4" />
        <p>{t("changesText")}</p>
      </section>

      {/* Contact Info */}
      <section>
        <h2 className="text-xl font-semibold mb-2">{t("contactTitle")}</h2>
        <Separator className="mb-4" />
        <p>{t("contactText")}</p>
        <ul className="mt-3 space-y-1">
          <li className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-400" />
            {t("phone")}
          </li>
          <li className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            {t("email")}
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Term;
