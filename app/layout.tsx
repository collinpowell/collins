import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Collin Powell (Collins Krubu) — Senior Blockchain & Full-Stack Engineer",
  description:
    "Collin Powell (aka Collins Krubu) is a Senior Blockchain & Full-Stack Engineer specializing in Solana, Rust, Solidity, Next.js, and Go. Building DeFi infrastructure, DEX aggregators, and production web apps.",
  keywords: [
    "Collin Powell",
    "Collins Krubu",
    "blockchain developer",
    "solana developer",
    "rust developer",
    "full-stack engineer",
    "defi",
    "dex aggregator",
    "smart contracts",
    "solidity",
    "next.js",
    "golang",
    "web3",
  ],
  authors: [{ name: "Collin Powell (Collins Krubu)" }],
  openGraph: {
    title: "Collin Powell (Collins Krubu) — Senior Web3 & Full-Stack Engineer",
    description:
      "Building DeFi infrastructure, DEX aggregators, and production web apps. 6+ years shipping across Solana, Rust, Solidity, Next.js, and Go.",
    type: "website",
    locale: "en_US",
    siteName: "Collin Powell Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Collin Powell (Collins Krubu) — Senior Blockchain Engineer",
    description:
      "Building DeFi infrastructure, DEX aggregators, and production web apps.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Collin Powell",
  alternateName: "Collins Krubu",
  jobTitle: "Senior Blockchain & Full-Stack Engineer",
  url: "https://github.com/collinpowell",
  sameAs: [
    "https://github.com/collinpowell",
    "https://www.linkedin.com/in/collins-krubu-a0a90a216",
  ],
  knowsAbout: [
    "Blockchain",
    "Solana",
    "Rust",
    "Solidity",
    "Next.js",
    "Web3",
    "DeFi",
    "Smart Contracts",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${inter.variable} ${firaCode.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
