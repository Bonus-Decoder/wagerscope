import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/auth/UserMenu";
import Fingerprint from "@/components/Fingerprint";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "WagerScope - Crypto Casino Bonus Calculator",
    template: "%s | WagerScope",
  },
  description:
    "Wagering requirements calculator for crypto casino bonuses — Nigeria & Kenya. Analyze expected value and compare offers from top crypto casinos.",
  metadataBase: new URL("https://wagerscope.com"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WagerScope",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "WagerScope",
    title: "WagerScope - Crypto Casino Bonus Calculator",
    description:
      "The only tool that shows you the REAL cost of crypto casino bonuses. Calculate wagering requirements and expected value instantly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WagerScope - Crypto Casino Bonus Calculator",
    description:
      "Calculate the real cost of crypto casino bonuses. Free wagering requirements analyzer for Nigeria & Kenya.",
  },
  alternates: {
    canonical: "https://wagerscope.com",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark font-sans antialiased", inter.variable)}>
      <body className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link href="/" className="text-lg font-bold">
              WagerScope
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/calculator"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Calculator
              </Link>
              <Link
                href="/casino"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Casinos
              </Link>
              <UserMenu />
            </nav>
          </div>
        </header>
        {children}
        <Fingerprint />
      </body>
    </html>
  );
}
