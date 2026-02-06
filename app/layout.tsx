import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chess App",
  description: "Multiplayer chess with Next.js and Socket.io",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
