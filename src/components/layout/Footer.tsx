"use client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Book } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Footer = () => {
  const t = useTranslations("Footer.footer");
  return (
    <footer className="w-full bg-[#0e121c] text-white py-10 px-6 border-t border-gray-700">
      <div className="px-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Лого + Описание */}
        <div className="text-center md:text-left space-y-3 max-w-sm">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Book className="w-7 h-7 text-white" />
            <h2 className="text-2xl font-bold text-white">KeyBooks</h2>
          </div>
          <p className="text-gray-400 text-sm">
            {t("description")}
          </p>
        </div>

        {/* Навигация */}
        <div className="flex flex-row flex-wrap justify-center md:justify-start gap-12 text-center md:text-left">
          <div>
            <h3 className="font-semibold mb-3 text-white">
              {t("menu_title")}
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-white cursor-pointer">
                <Link href="/about">{t("menu_items.0")}</Link>
              </li>
              <li className="hover:text-white cursor-pointer">
                <Link href="/faq">{t("menu_items.1")}</Link>
              </li>
              <li className="hover:text-white cursor-pointer">
                <Link href="/privacy">{t("menu_items.2")}</Link>
              </li>
              <li className="hover:text-white cursor-pointer">
                <Link href="/contact">{t("menu_items.3")}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-white">
              {t("social_title")}
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-white cursor-pointer">{t("social_items.0")}</li>
              <li className="hover:text-white cursor-pointer">{t("social_items.1")}</li>
              <li className="hover:text-white cursor-pointer">{t("social_items.2")}</li>
            </ul>
          </div>
        </div>
      </div>

      <Separator className="my-8 bg-gray-400" />

      {/* Нижняя часть */}
      <div className="text-center text-gray-500 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="text-white">KeyBooks</span>. {t("copyright")}
      </div>
    </footer>
  );
};

export default Footer;
