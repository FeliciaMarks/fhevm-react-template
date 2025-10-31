import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Private Restaurant Rating System',
  description: 'Confidential dining experience reviews using homomorphic encryption',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27><text y=%27.9em%27 font-size=%2790%27>🍽️</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script src="https://unpkg.com/fhevmjs@0.5.8/lib/web/fhevm.min.js" async />
        {children}
      </body>
    </html>
  );
}
