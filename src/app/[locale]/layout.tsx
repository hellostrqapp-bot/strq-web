import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import SWRegister from "@/components/sw-register";
import ErrorBoundary from "@/components/error-boundary";
import "../globals.css";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("title");
  const description = t("description");
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://strq.app/${locale}`,
      siteName: "strQ",
      images: [
        {
          url: "https://strq.app/og-image.png",
          width: 1200,
          height: 630,
          alt: "strQ — Consistentie beloond",
        },
      ],
      locale: locale === "nl" ? "nl_NL" : locale === "de" ? "de_DE" : locale === "fr" ? "fr_FR" : locale === "es" ? "es_ES" : locale === "pt" ? "pt_PT" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://strq.app/og-image.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6C3483" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="strQ" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="89652777-8e7f-4b58-9808-3a98947ace37"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <SWRegister />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
