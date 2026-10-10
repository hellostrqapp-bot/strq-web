import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";

// Root / redirects naar de standaard locale
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
