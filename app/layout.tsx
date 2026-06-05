import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MedTools Guardia | Herramientas médicas online",
    template: "%s | MedTools Guardia",
  },
  description:
    "Calculadoras clínicas en español: IMC, clearance de creatinina y orientación sobre ajuste de antibióticos según función renal. Diseño mobile-first.",
  keywords: [
    "herramientas médicas",
    "calculadora IMC",
    "clearance creatinina",
    "ajuste renal antibióticos",
    "medicina",
    "español",
  ],
  verification: {
    google: "bf7h36NClgZLgPoBQGFVeTR3vJHx2ctiZBnUO-NtIe4",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
    shortcut: "/icon.png",
  },
  other: {
    "google-adsense-account": "ca-pub-7070621016074264",
  },
  openGraph: {
    title: "MedTools Guardia",
    description:
      "Herramientas médicas online en español: IMC, creatinina y ajustes renales.",
    locale: "es_ES",
    type: "website",
    images: [{ url: "/icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7070621016074264"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-dvh flex flex-col`}
      >
        <SiteHeader />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 sm:py-10">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
