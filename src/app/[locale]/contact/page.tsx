"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessageCircle, Mail, Send, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { whatsappNumber } from "@/constants/data";
import { useTranslations } from "next-intl";

const ContactPage = () => {
  const t = useTranslations("Page.Contact");

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f1720] to-[#18202d] flex items-center justify-center px-6 py-16">
      <div className="max-w-3xl w-full bg-white/3 backdrop-blur-md rounded-2xl p-8">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-center text-white mb-8"
        >
          {t("title")}
        </motion.h1>

        {/* Tabs */}
        <Tabs defaultValue="whatsapp" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8 bg-white/10 rounded-lg">
            <TabsTrigger
              value="whatsapp"
              className="text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              {t("tabs.whatsapp")}
            </TabsTrigger>
            <TabsTrigger
              value="others"
              className="text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              {t("tabs.others")}
            </TabsTrigger>
          </TabsList>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center space-y-6"
            >
              <MessageCircle className="w-12 h-12 text-green-400" />
              <p className="text-gray-300 text-center">
                {t("whatsapp.description")}
              </p>

              <div className="relative w-40 h-40">
                <Image
                  src="/bg/qr-code.png"
                  alt="WhatsApp QR Code"
                  fill
                  className="object-contain"
                />
              </div>

              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md transition"
              >
                {t("whatsapp.button")}
              </a>
            </motion.div>
          </TabsContent>

          {/* Other Links Tab */}
          <TabsContent value="others">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid gap-6 sm:grid-cols-2"
            >
              <a
                href="mailto:contact@keybooks.com"
                className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 p-4 rounded-lg transition"
              >
                <Mail className="w-6 h-6 text-blue-400" />
                <span className="text-white">{t("others.email")}</span>
              </a>

              <a
                href="https://t.me/keybooks"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 p-4 rounded-lg transition"
              >
                <Send className="w-6 h-6 text-sky-400" />
                <span className="text-white">{t("others.telegram")}</span>
              </a>

              <a
                href="https://instagram.com/keybooks"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 p-4 rounded-lg transition"
              >
                <Instagram className="w-6 h-6 text-pink-400" />
                <span className="text-white">{t("others.instagram")}</span>
              </a>

              <Link
                href="/"
                className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 p-4 rounded-lg transition"
              >
                <MessageCircle className="w-6 h-6 text-green-400" />
                <span className="text-white">{t("others.livechat")}</span>
              </Link>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default ContactPage;
