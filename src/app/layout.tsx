import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";

const inter = localFont({
  src: '../font/font.ttf',
	weight: '700',
	style: 'normal',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "ATK поиск",
  description: "Быстрый поиск грузовиков и манипуляторов в вашем городе",
	icons: '/favicon.png'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
