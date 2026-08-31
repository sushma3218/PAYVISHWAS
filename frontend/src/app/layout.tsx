import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PAYVISHWAS - AI Risk Manager",
  description: "Autonomous AI Risk Manager for Intelligent Payment Recovery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground flex h-screen overflow-hidden`}>
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto bg-background">
          {children}
        </main>
      </body>
    </html>
  );
}
