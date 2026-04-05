// Root layout — wordt overschreven door [locale]/layout.tsx
// Dit bestand moet bestaan voor Next.js maar doet alleen doorverwijzen

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
