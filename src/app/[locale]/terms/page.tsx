"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, CheckCircle, Clock, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

const TermsOfServicePage = () => {
  const t = useTranslations("Page.Terms");

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f1720] to-[#18202d] flex items-center justify-center px-6 py-24 lg:py-16">
      <div className="max-w-4xl w-full text-white">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-10"
        >
          {t("title")}
        </motion.h1>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-300 text-center max-w-2xl mx-auto mb-12"
          dangerouslySetInnerHTML={{ __html: t.raw("intro") }}
        />

        {/* Terms blocks */}
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-start space-x-4"
          >
            <Scale className="w-10 h-10 text-blue-400 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-1">{t("fairUse.title")}</h2>
              <p className="text-gray-400 text-sm">{t("fairUse.desc")}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-start space-x-4"
          >
            <CheckCircle className="w-10 h-10 text-green-400 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-1">{t("responsibility.title")}</h2>
              <p className="text-gray-400 text-sm">{t("responsibility.desc")}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-start space-x-4"
          >
            <Clock className="w-10 h-10 text-yellow-400 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-1">{t("availability.title")}</h2>
              <p className="text-gray-400 text-sm">{t("availability.desc")}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-start space-x-4"
          >
            <Shield className="w-10 h-10 text-purple-400 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-1">{t("privacy.title")}</h2>
              <p
                className="text-gray-400 text-sm"
                dangerouslySetInnerHTML={{ __html: t.raw("privacy.desc") }}
              />
            </div>
          </motion.div>
        </div>

        {/* Conclusion */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-gray-400 text-center max-w-2xl mx-auto mt-12 text-sm"
        >
          {t("conclusion")}
        </motion.p>
      </div>
    </main>
  );
};

export default TermsOfServicePage;
