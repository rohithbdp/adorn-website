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
  title: "aDorn Photography & Event Rentals LLC | Professional Photography in Gilbert, AZ",
  description: "Professional photography and event rental services in Gilbert, Arizona. Specializing in weddings, maternity, newborn, family portraits, and special events. Capturing life's precious moments through creative lens work.",
  keywords: "photography, event rentals, Gilbert Arizona, wedding photography, maternity photos, newborn photography, family portraits, photo booth rental, event photography",
  authors: [{ name: "David - aDorn Photography" }],
  openGraph: {
    title: "aDorn Photography & Event Rentals LLC",
    description: "Professional photography and event rental services in Gilbert, Arizona. Capturing your special moments with artistic vision.",
    url: "https://adornphotography.com",
    siteName: "aDorn Photography",
    images: [
      {
        url: "/adorn-logo.png",
        width: 800,
        height: 600,
        alt: "aDorn Photography Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "aDorn Photography & Event Rentals LLC",
    description: "Professional photography services in Gilbert, AZ. Weddings, maternity, newborn, family portraits & events.",
    images: ["/adorn-logo.png"],
  },
  icons: {
    icon: '/adorn-logo.png',
    apple: '/adorn-logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'aDorn Photography & Event Rentals LLC',
    image: '/adorn-logo.png',
    '@id': 'https://adornphotography.com',
    url: 'https://adornphotography.com',
    telephone: '(480) 669-0200',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gilbert',
      addressRegion: 'AZ',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.3528,
      longitude: -111.7890
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '10:00',
        closes: '19:00'
      }
    ],
    sameAs: [
      'https://www.instagram.com/adorn_david',
      'https://www.facebook.com/adornfotography'
    ],
    description: 'Professional photography and event rental services in Gilbert, Arizona. Specializing in weddings, maternity, newborn, family portraits, and special events.',
    priceRange: '$$',
    servicesOffered: [
      'Wedding Photography',
      'Maternity Photography',
      'Newborn Photography',
      'Family Portrait Photography',
      'Event Photography',
      'Photo Booth Rental',
      'Event Equipment Rental'
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfairDisplay.variable} ${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
