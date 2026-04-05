import { redirect } from "next/navigation";

// Root / redirects naar de standaard locale
export default function RootPage() {
  redirect("/nl");
}
