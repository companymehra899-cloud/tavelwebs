import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PreferencesProvider } from "@/components/providers/PreferencesProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookiePreferences } from "@/components/CookiePreferences";
import { SITE_NAME } from "@/lib/constants";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — Travel Tools & Calculators`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Fast, free travel calculators for fuel costs, road trips, budgets, currency conversion, time zones, packing lists and more.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Travel Tools & Calculators`,
    description:
      "Fast, free travel calculators for fuel costs, road trips, budgets, currency conversion, time zones and packing.",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — Travel Tools & Calculators`,
    description: "Fast, free travel calculators and planning tools.",
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f6e6b",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PreferencesProvider>
          <a
            href="#main"
            className="no-print sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <CookiePreferences />
        </PreferencesProvider>
      </body>
    </html>
  );
}
