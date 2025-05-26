import type { Metadata } from "next";
import { Playfair_Display, Roboto } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "aDorn Photography & Event Rentals LLC",
  description: "Professional photography and event rental services - Capturing life's precious moments through creative lens work",
  icons: {
    icon: '/adorn-logo.png',
    apple: '/adorn-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
