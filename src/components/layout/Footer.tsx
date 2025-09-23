"use client";
import React from "react";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("Footer.footer");
  return (
    <footer className="w-full bg-[#0e121c] text-white py-10 px-6 border-t border-gray-700">
      {/* Нижняя часть */}
      <div className="text-center text-gray-500 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="text-white">KAN | KeyBooks Publishing House</span>
      </div>
    </footer>
  );
};

export default Footer;
