import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";
import { CartProvider } from "@/contexts/CartContext";
import CartSidebar from "@/components/CartSidebar";

export const metadata: Metadata = {
  title: "HomeBite - Food Delivery App",
  description: "Daily homestyle meals, delivered by trusted neighborhood cooks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased flex flex-col">
        <SessionProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <CartSidebar />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
