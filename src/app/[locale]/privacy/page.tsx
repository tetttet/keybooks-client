"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Cloud, Shield, Server, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import Privacy from "@/components/Privacy";

const PrivacyPolicyPage = () => {
  const t = useTranslations("Page.Privacy");

  return (
    <>
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

          {/* Policy Tree */}
          <div className="flex flex-col items-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <Shield className="w-12 h-12 text-blue-400 mb-2" />
              <h2 className="text-xl font-semibold mb-2">
                {t("section1.title")}
              </h2>
              <p className="text-gray-400 text-center max-w-md">
                {t("section1.desc")}
              </p>
            </motion.div>

            {/* Items */}
            <div className="w-full flex flex-col items-center relative">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center space-x-4 mb-12"
              >
                <Cloud className="w-10 h-10 text-blue-300" />
                <div>
                  <h3 className="text-lg font-semibold">{t("cloud.title")}</h3>
                  <p className="text-gray-400 text-sm">{t("cloud.desc")}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center space-x-4 mb-12"
              >
                <Server className="w-10 h-10 text-green-300" />
                <div>
                  <h3 className="text-lg font-semibold">{t("aws.title")}</h3>
                  <p className="text-gray-400 text-sm">{t("aws.desc")}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center space-x-4 mb-12"
              >
                <Database className="w-10 h-10 text-yellow-300" />
                <div>
                  <h3 className="text-lg font-semibold">{t("db.title")}</h3>
                  <p className="text-gray-400 text-sm">{t("db.desc")}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex items-center space-x-4"
              >
                <FileText className="w-10 h-10 text-purple-300" />
                <div>
                  <h3 className="text-lg font-semibold">{t("policy.title")}</h3>
                  <p className="text-gray-400 text-sm">{t("policy.desc")}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <div className="bg-gradient-to-tr from-[#0f1720] to-[#18202d] py-12">
        <Privacy />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
