import '@/app/globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'COCOMO Calculator | Clerk Next.js Auth',
  description: 'Estimate software development effort using the Constructive Cost Model with Clerk Auth',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="flex justify-end items-center p-4 gap-4 h-16">
              <SignedOut>
                <div className="flex gap-4">
                  <SignInButton mode="modal">
                    <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-lg focus:outline-none">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-gradient-to-r from-green-700 to-teal-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-lg focus:outline-none">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="flex gap-4">
                  <UserButton />
                </div>
              </SignedIn>

            </header>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
