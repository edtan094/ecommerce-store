import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/cartContext/CartContext";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Meme Mart",
  description: "A simple ecommerce app built with Next.js, Stripe, and Prisma.",
  openGraph: {
    siteName: "Meme Mart",
    title: "Meme Mart",
    description: "Welcome to Meme Mart! The best place to buy memes.",
    type: "website",
    images: [
      {
        url: "/favicon-16x16.png",
        width: 16,
        height: 16,
        alt: "Meme Mart Logo",
        type: "image/ico",
      },
      {
        url: "/favicon-32x32.png",
        width: 32,
        height: 32,
        alt: "Meme Mart Logo",
        type: "image/ico",
      },
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
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>{children}</CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
