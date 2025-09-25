"use client";

import React from "react";
import { motion } from "framer-motion";
import { Separator } from "./ui/separator";
import { Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

const Privacy = () => {
  const t = useTranslations("Page.Privat");

  return (
    <div className="max-w-4xl mx-auto px-6 -mt-20 text-white leading-relaxed">
      <Separator className="my-8 border-gray-700" />
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("title")}
      </motion.h1>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-semibold mb-3">{t("introTitle")}</h2>
          <p>{t("introText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            {t("dataCollectionTitle")}
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>{t("dataCollection1")}</li>
            <li>{t("dataCollection2")}</li>
            <li>{t("dataCollection3")}</li>
            <li>{t("dataCollection4")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{t("dataUsageTitle")}</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>{t("dataUsage1")}</li>
            <li>{t("dataUsage2")}</li>
            <li>{t("dataUsage3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            {t("confidentialityTitle")}
          </h2>
          <p>{t("confidentialityText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{t("disclaimerTitle")}</h2>
          <p>{t("disclaimerText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{t("rightsTitle")}</h2>
          <p>{t("rightsText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{t("changesTitle")}</h2>
          <p>{t("changesText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{t("contactTitle")}</h2>
          <p>{t("contactText")}</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Phone className="w-5 h-5 inline-block text-green-400 mr-2" />
              {t("phone")}
            </li>
            <li>
              <Mail className="w-5 h-5 inline-block text-blue-400 mr-2" />
              {t("email")}
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
