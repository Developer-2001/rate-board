import type { Metadata, Viewport } from "next";
import { ClientProvider } from "@/context/ClientContext";
import { ThemeProvider } from "@/context/ThemeContext";
import CapacitorBootstrap from "@/components/CapacitorBootstrap";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rate Board",
  description: "Authentication gateway for Paras Infotech rate-board displays.",
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
        <ThemeProvider>
          <ClientProvider>{children}</ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
