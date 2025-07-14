import type { Metadata } from "next";
import "./globals.css";

// Use system fonts as fallback to avoid Google Fonts loading issues
const inter = {
  variable: "--font-inter",
  className: "font-sans"
};

const jetbrainsMono = {
  variable: "--font-jetbrains-mono",
  className: "font-mono"
};

export const metadata: Metadata = {
  title: "HengshuiFont English Generator",
  description: "Professional English vocabulary practice template generator with Hengshui-style 4-line grids for primary and junior high school students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
