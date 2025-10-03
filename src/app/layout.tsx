import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { AppLayout } from '@/components/layout/app-layout';

export const metadata: Metadata = {
  title: 'LinkedSpark | AI LinkedIn Growth Assistant',
  description:
    'Elevate your LinkedIn presence with AI-powered post generation, profile optimization, and growth insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-background text-foreground antialiased">
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
