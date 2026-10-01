import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { BroadcastProvider } from '@/lib/videoStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SİNYAL TV — 24 Saat Kesintisiz Bağımsız Dijital Yayın Kanalı',
  description:
    'SİNYAL TV, algoritmik hareketli görüntüler ve bağımsız sinematografinin günün 24 saati kesintisiz yayınlandığı dijital televizyon ve video arşiv platformudur.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0B0D] text-[#F4F4F5] selection:bg-red-900 selection:text-white">
        <BroadcastProvider>
          <Header />
          <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 md:py-8">
            {children}
          </main>
          <Footer />
          <SearchModal />
        </BroadcastProvider>
      </body>
    </html>
  );
}
