import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "PawShelter | Every Paw Deserves a Home",
  description:
    "Decentralized pet adoption listing platform on Botchain Testnet. Find rescue pets, express interest, and verify adoptions on-chain.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream-50 text-forest-900 min-h-screen flex flex-col selection:bg-terracotta-200 selection:text-forest-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
