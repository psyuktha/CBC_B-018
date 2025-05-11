import type { Metadata } from 'next';
import './globals.css';
import { SidebarWrapper } from '@/components/SidebarWrapper';

export const metadata: Metadata = {
  title: 'Payzee',
  description: 'A digital payment system',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
      </head>
      <body className="flex">
        <SidebarWrapper />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
