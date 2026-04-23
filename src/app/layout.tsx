import type { Metadata } from "next";
import { ClientProvider } from "@/context/ClientContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rate Board",
  description: "Authentication gateway for Paras Infotech rate-board displays.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
