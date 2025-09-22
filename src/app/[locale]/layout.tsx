import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { generateMetadata } from "@/lib/metadata";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = generateMetadata({});

type Params = Promise<{ locale: string }>;

export default async function LocalLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Params;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/messages/${locale}`)).default;
  } catch {
    notFound();
  }
  return (
    <>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </NextIntlClientProvider>
    </>
  );
}
