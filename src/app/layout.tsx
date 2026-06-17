import type { Metadata, Viewport } from "next";
import { ClientProvider } from "@/context/ClientContext";
import { ThemeProvider } from "@/context/ThemeContext";
import CapacitorBootstrap from "@/components/CapacitorBootstrap";
import PwaBootstrap from "@/components/PwaBootstrap";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rate Board",
  description: "Authentication gateway for Paras Infotech rate-board displays.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/rateboard-192.png", sizes: "192x192", type: "image/png" },
      { url: "/rateboard-512.png", sizes: "512x512", type: "image/png" },
      { url: "/need.svg", type: "image/svg+xml" },
    ],
    apple: "/rateboard-192.png",
  },
  appleWebApp: {
    capable: true,
    title: "Rate Board",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <CapacitorBootstrap />
        <PwaBootstrap />
        <ThemeProvider>
          <ClientProvider>{children}</ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
