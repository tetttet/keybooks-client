"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const FAQPage = () => {
  const t = useTranslations("Page.FAQ");

  const questions = [
    { key: "q1" },
    { key: "q2" },
    { key: "q3" },
    { key: "q4" },
    { key: "q5" },
    { key: "q6" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f1720] to-[#18202d] flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center py-12 lg:py-0">
        {/* Left Side - Image */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full flex justify-center items-center"
        >
          <div className="relative w-full aspect-square sm:aspect-[4/3] md:h-full rounded-2xl overflow-hidden">
            <Image
              src="/bg/faq.jpg"
              alt="FAQ Illustration"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Right Side - FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 sm:p-8 rounded-2xl h-full flex flex-col justify-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
            {t("title")}
          </h2>

          <Accordion type="single" collapsible className="space-y-3">
            {questions.map(({ key }) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className="text-white text-base sm:text-lg hover:text-blue-400 transition-colors">
                  {t(`questions.${key}.question`)}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 text-sm sm:text-base">
                  {t(`questions.${key}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </main>
  );
};

export default FAQPage;
