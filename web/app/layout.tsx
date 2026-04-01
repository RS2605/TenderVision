import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TenderVision MVP",
  description: "Luxury Tech MSME Tender Analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-deepNavy text-white antialiased">
        {children}
      </body>
    </html>
  );
}
