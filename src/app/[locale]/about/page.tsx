import React from "react";
import { useTranslations } from "next-intl";

const AboutPage = () => {
  const t = useTranslations("Page.About");

  return (
    <main className="bg-gradient-to-br from-[#0f1720] to-[#18202d] min-h-[60vh]">
      <section className="max-w-3xl mx-auto px-4 py-24 lg:py-36 text-white">
        <h1 className="text-4xl font-bold mb-6 lg:text-center">{t("title")}</h1>

        <p
          className="text-lg mb-4"
          dangerouslySetInnerHTML={{ __html: t.raw("p1") }}
        />
        <p className="text-lg mb-4">{t("p2")}</p>
        <p className="text-lg mb-4">{t("p3")}</p>
        <p
          className="text-lg mb-8"
          dangerouslySetInnerHTML={{ __html: t.raw("p4") }}
        />

        <div className="text-center">
          <p
            className="text-xl font-semibold"
            dangerouslySetInnerHTML={{ __html: t.raw("tagline") }}
          />
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
