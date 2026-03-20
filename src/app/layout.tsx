import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mind Palace",
  description: "A constellation-based journaling insight system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-palace-dark text-white antialiased">
        {children}
      </body>
    </html>
  );
}
