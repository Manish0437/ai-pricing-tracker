import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import { DM_Serif_Display } from 'next/font/google'
import { ThemeProvider } from "next-themes";

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
})
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  // Basic
  title: {
    default: "AI Model Pricing Tracker — Compare LLM Costs in Real Time",
    template: "%s | AI Pricing Tracker",
  },
  description:
    "Compare AI model pricing across OpenAI, Anthropic, Google Gemini, Groq, DeepSeek and more. Updated daily. Find the cheapest LLM for your use case.",
  keywords: [
    "AI model pricing",
    "LLM cost comparison",
    "OpenAI pricing",
    "Anthropic Claude pricing",
    "Gemini pricing",
    "Groq pricing",
    "DeepSeek pricing",
    "cheapest AI API",
    "GPT-4 cost",
    "AI API comparison",
  ],
  authors: [{ name: "AI Pricing Tracker" }],
  creator: "AI Pricing Tracker",

  // Canonical URL — replace with your actual Railway domain
  metadataBase: new URL("https://ai-pricing-tracker-production.up.railway.app"),
  alternates: {
    canonical: "/",
  },

  // Open Graph — controls how your link looks when shared on WhatsApp, LinkedIn etc.
  openGraph: {
    type: "website",
    url: "https://ai-pricing-tracker-production.up.railway.app",
    title: "AI Model Pricing Tracker — Compare LLM Costs in Real Time",
    description:
      "Compare AI model pricing across OpenAI, Anthropic, Google Gemini, Groq and more. Updated daily.",
    siteName: "AI Pricing Tracker",
    images: [
      {
        url: "/og-image.png", // create this — 1200x630px screenshot of your dashboard
        width: 1200,
        height: 630,
        alt: "AI Model Pricing Tracker Dashboard",
      },
    ],
  },

  // Twitter card
  twitter: {
    card: "summary_large_image",
    title: "AI Model Pricing Tracker",
    description: "Compare AI model pricing updated daily across all major providers.",
    images: ["/og-image.png"],
  },

  // Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "DfjWRbH2XpYZTOPPjWXrJIomVmoJjfYZ3P45Un9W578",
  },

}





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}