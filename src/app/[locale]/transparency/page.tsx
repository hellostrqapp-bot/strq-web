import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import LocaleSwitcher from "../privacy/LocaleSwitcher";

// ═══════════════════════════════════════════════════════════
// strQ.app — Algorithmic transparency (DSA art. 24+)
// Same shape as /privacy: server-rendered markdown from
// content/transparency/{locale}.md, dark prose styling.
// ═══════════════════════════════════════════════════════════

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "transparency_page" });
  return {
    title: `${t("title")} — strQ.app`,
    description: t("description"),
    robots: { index: true, follow: true },
  };
}

async function loadDoc(locale: string): Promise<string | null> {
  const filePath = path.join(
    process.cwd(),
    "content",
    "transparency",
    `${locale}.md`
  );
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

export default async function TransparencyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const markdown = await loadDoc(locale);
  if (!markdown) notFound();

  const t = await getTranslations({ locale, namespace: "transparency_page" });

  const html = marked.parse(markdown, { async: false, gfm: true }) as string;
  const homeHref = locale === routing.defaultLocale ? "/" : `/${locale}`;

  return (
    <div className="privacy-shell">
      <style>{`
        .privacy-shell {
          min-height: 100vh;
          background: #1A1A2E;
          color: rgba(255,255,255,0.82);
          font-family: 'Inter', -apple-system, sans-serif;
          padding: 48px 24px 96px;
        }
        .privacy-container {
          max-width: 720px;
          margin: 0 auto;
          position: relative;
        }
        .privacy-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: rgba(165,105,189,0.7);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 32px;
          transition: color 0.2s;
        }
        .privacy-back:hover { color: #A569BD; }
        .privacy-rainbow {
          display: flex;
          gap: 3px;
          margin: 12px 0 28px;
          width: 108px;
        }
        .privacy-rainbow > span {
          width: 16px;
          height: 3px;
          border-radius: 2px;
        }
        .privacy-prose h1 {
          font-size: 32px;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: -0.01em;
          margin: 0 0 8px;
        }
        .privacy-prose h2 {
          font-size: 22px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 40px 0 12px;
          letter-spacing: -0.01em;
        }
        .privacy-prose h3 {
          font-size: 17px;
          font-weight: 700;
          color: rgba(255,255,255,0.92);
          margin: 28px 0 8px;
        }
        .privacy-prose p {
          font-size: 16px;
          line-height: 1.75;
          color: rgba(255,255,255,0.78);
          margin: 0 0 16px;
        }
        .privacy-prose blockquote {
          border-left: 3px solid #6C3483;
          background: rgba(108,52,131,0.08);
          padding: 14px 18px;
          margin: 0 0 24px;
          border-radius: 0 8px 8px 0;
          color: rgba(255,255,255,0.7);
          font-style: italic;
        }
        .privacy-prose blockquote p { margin: 0; }
        .privacy-prose ul, .privacy-prose ol {
          margin: 0 0 20px;
          padding-left: 22px;
        }
        .privacy-prose li {
          font-size: 16px;
          line-height: 1.75;
          color: rgba(255,255,255,0.78);
          margin: 0 0 6px;
        }
        .privacy-prose li::marker { color: #A569BD; }
        .privacy-prose strong {
          color: #FFFFFF;
          font-weight: 700;
        }
        .privacy-prose em {
          color: rgba(255,255,255,0.6);
          font-style: italic;
        }
        .privacy-prose a {
          color: #A569BD;
          text-decoration: underline;
          text-decoration-color: rgba(165,105,189,0.4);
          text-underline-offset: 3px;
        }
        .privacy-prose a:hover {
          text-decoration-color: #A569BD;
        }
        .privacy-prose code {
          background: rgba(255,255,255,0.06);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 14px;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          color: #A569BD;
        }
        .privacy-prose hr {
          border: none;
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 40px 0;
        }
        .privacy-prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 0 0 24px;
          font-size: 14.5px;
        }
        .privacy-prose th {
          background: rgba(108,52,131,0.18);
          color: #FFFFFF;
          font-weight: 700;
          text-align: left;
          padding: 10px 12px;
          border-bottom: 1.5px solid rgba(165,105,189,0.4);
        }
        .privacy-prose td {
          padding: 10px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.78);
          vertical-align: top;
        }
        .privacy-prose tr:last-child td {
          border-bottom: none;
        }
        .privacy-footer {
          margin-top: 56px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
          text-align: center;
          color: rgba(255,255,255,0.3);
          font-size: 12px;
        }
        .privacy-footer a {
          color: rgba(165,105,189,0.6);
          text-decoration: none;
        }
        .privacy-footer a:hover { color: #A569BD; }
        @media (max-width: 600px) {
          .privacy-prose h1 { font-size: 26px; }
          .privacy-prose h2 { font-size: 19px; margin-top: 32px; }
          .privacy-prose table { font-size: 13px; }
          .privacy-prose th, .privacy-prose td { padding: 8px 8px; }
        }
      `}</style>
      <div className="privacy-container">
        <a href={homeHref} className="privacy-back" aria-label={t("back")}>
          <span aria-hidden="true">←</span> {t("back")}
        </a>

        <LocaleSwitcher currentLocale={locale} />

        <div className="privacy-rainbow" aria-hidden="true">
          <span style={{ background: "#E74C3C" }} />
          <span style={{ background: "#E67E22" }} />
          <span style={{ background: "#F1C40F" }} />
          <span style={{ background: "#27AE60" }} />
          <span style={{ background: "#2980B9" }} />
          <span style={{ background: "#8E44AD" }} />
        </div>

        <article
          className="privacy-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="privacy-footer">
          <a href={homeHref}>strQ.app</a>
          <span> · </span>
          <a href={`/${locale}/privacy`}>{t("privacy_link")}</a>
          <span> · </span>
          <a href="mailto:hello@strq.app">hello@strq.app</a>
        </div>
      </div>
    </div>
  );
}
