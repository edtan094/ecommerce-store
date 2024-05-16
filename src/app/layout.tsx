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
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    siteName: "Meme Mart",
    title: "Meme mart",
    description: "Welcome to Meme Mart! The best place to buy memes.",
    type: "website",
    images: ["/market-icon.png"],
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
