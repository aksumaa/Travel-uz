import type { Metadata } from 'next';
import { Providers } from '../site/Providers';
import '../index.css';

export const metadata: Metadata = {
  title: 'TravelUZ | Global Travel Platform',
  description: 'Design day-by-day trips, explore an interactive globe, and manage agency leads. Works in the browser with no API keys.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
