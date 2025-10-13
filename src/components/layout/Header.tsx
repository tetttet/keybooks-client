"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import OrderButton from "../ui/OrderButton";
import { whatsappNumber } from "@/constants/data";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("Header.header");
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "ms" : "en";
    const segments = pathname.split("/").filter(Boolean);

    // заменяем первый сегмент [locale]
    segments[0] = newLocale;
    const newPath = "/" + segments.join("/");

    router.push(newPath);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        menuOpen ? "bg-black/20 backdrop-blur-md" : "bg-transparent text-black"
      }`}
    >
      <div className="flex justify-between items-center px-6 py-3">
        <div className="text-md text-white font-serif mt-2">
          <Link href={`/${locale}`}>keybooks</Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLocale}
            aria-label="Switch Language"
            className="px-2 py-2 rounded-md bg-white text-black text-[12px] border"
          >
            {t("switch_language")}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
            className="px-2 py-2 rounded-md bg-white text-black border"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <OrderButton className="border shadow-none" />
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <ul className="flex text-white flex-col items-start gap-1 mb-5 mt-3 px-6 text-xl">
              <li
                onClick={() => setMenuOpen(false)}
                className="hover:underline cursor-pointer"
              >
                <Link href={`/${locale}/dashboard`}>{t("dashboard")}</Link>
              </li>
              <li
                onClick={() => setMenuOpen(false)}
                className="hover:underline cursor-pointer"
              >
                <Link href={`/${locale}/about`}>{t("about")}</Link>
              </li>
              <li
                onClick={() => setMenuOpen(false)}
                className="hover:underline cursor-pointer"
              >
                <Link href={`/${locale}/faq`}>{t("faq")}</Link>
              </li>
              {/* <li
                onClick={() => setMenuOpen(false)}
                className="hover:underline cursor-pointer"
              >
                <Link href={`/${locale}/privacy`}>{t("privacy")}</Link>
              </li> */}
              <li
                onClick={() => setMenuOpen(false)}
                className="hover:underline cursor-pointer"
              >
                <Link href={`/${locale}/terms`}>{t("terms")}</Link>
              </li>
              {/* <li
                onClick={() => setMenuOpen(false)}
                className="hover:underline cursor-pointer"
              >
                <Link href={`/${locale}/contact`}>{t("contact")}</Link>
              </li> */}
              <li
                onClick={() => setMenuOpen(false)}
                className="hover:underline cursor-pointer"
              >
                <a
                  href={"https://wa.me/" + whatsappNumber}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Order Now
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
