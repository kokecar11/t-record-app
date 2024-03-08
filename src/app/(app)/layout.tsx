import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";
import { NavbarApp } from "~/components/layout/navbar-app";
import { Footer } from "~/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "T-Record",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} bg-background`}>
        <TRPCReactProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
            <NavbarApp />
            {children}
            <Footer />
          </ThemeProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
