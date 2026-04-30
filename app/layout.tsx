import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";
import { Noise } from "@/components/shared/Noise";
import { Providers } from "@/components/shared/Providers";
import { RadarBackground } from "@/components/3d/RadarBackground";
import { TerminalLoader } from "@/components/shared/TerminalLoader";
import { AdminFloatingButton } from "@/components/layout/AdminFloatingButton";
import { validateEnv } from "@/lib/env-check";

// Esegui la validazione delle variabili d'ambiente in fase di boot
validateEnv();

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "IMMACULATE DATABASE | Classified Intelligence",
  description: "Global Intelligence Document Management System — Secure classified document repository",
};

import { CRTOverlay } from "@/components/effects/CRTOverlay";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased`}>
        <Providers>
          <CRTOverlay />
          <Noise />
          <TerminalLoader />
          <TopBar />
          <AdminFloatingButton />
          <main className="min-h-screen pt-16 relative z-0">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
