import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script'; // Importa el componente Script

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "8KBEATZ - Premium Beats & Sample Packs",
  description:
    "Download high-quality beats and sample packs for your music production needs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SH56N4GCK6" // Reemplaza con tu ID de seguimiento
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SH56N4GCK6'); // Reemplaza con tu ID de seguimiento
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-black text-white antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
