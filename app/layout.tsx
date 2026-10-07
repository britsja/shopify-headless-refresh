import "./globals.css"; 
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopify Headless Refresh",
  description: "Refresher on Shopify GraphQL Storefront API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
