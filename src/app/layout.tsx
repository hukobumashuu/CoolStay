import type { Metadata } from "next";
import { Geist, Geist_Mono, Goblin_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Load Goblin One
const goblinOne = Goblin_One({
  weight: "400",
  variable: "--font-goblin",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoolStay",
  description: "Bulacan Great Escape",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 2. Add the variable to the body class list */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${goblinOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
