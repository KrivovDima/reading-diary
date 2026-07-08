// app/layout.tsx
import { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/widgets/navbar";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Дневник чтения",
  description: "Ваш персональный трекер книг",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen pt-16 pb-20">{children}</main>
        <Toaster position="top-right" />;
      </body>
    </html>
  );
}
