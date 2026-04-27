"use client";

import { useRouter, usePathname } from "@/i18n/routing";
import { locales, localeNames, type Locale } from "@/i18n/config";

const localeFlags: Record<string, string> = {
  nl: "\u{1F1F3}\u{1F1F1}",
  en: "\u{1F1EC}\u{1F1E7}",
  fr: "\u{1F1EB}\u{1F1F7}",
  de: "\u{1F1E9}\u{1F1EA}",
  es: "\u{1F1EA}\u{1F1F8}",
  pt: "\u{1F1E7}\u{1F1F7}",
  qu: "\u{1F1F5}\u{1F1EA}",
};

const P = "#6C3483";
const PL = "#A569BD";

export default function LocaleSwitcher({
  currentLocale,
}: {
  currentLocale: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 12,
      }}
    >
      {locales.map((l: Locale) => (
        <button
          key={l}
          onClick={() => router.replace(pathname, { locale: l })}
          aria-label={localeNames[l]}
          style={{
            padding: "5px 10px",
            borderRadius: 8,
            border:
              l === currentLocale
                ? `1.5px solid ${P}`
                : "1.5px solid rgba(255,255,255,0.08)",
            background:
              l === currentLocale ? `${P}22` : "rgba(255,255,255,0.03)",
            color:
              l === currentLocale ? PL : "rgba(255,255,255,0.4)",
            fontSize: 12,
            fontWeight: l === currentLocale ? 700 : 400,
            cursor: "pointer",
            fontFamily: "inherit",
            textTransform: "uppercase",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }}>{localeFlags[l]}</span>
          {l}
        </button>
      ))}
    </div>
  );
}
