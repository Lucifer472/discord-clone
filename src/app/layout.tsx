import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { ThemeProvider } from "@/components/provider/theme-provider";
import { Providers } from "@/components/provider/query-provider";
import { cn } from "@/lib/utils";

import "./globals.css";

const fonts = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord Clone",
  description: "Discord Next Js Clone by Hardik Sadhu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "antialiased bg-white dark:bg-[#313338]",
          fonts.className
        )}
      >
        <Toaster />
        <ThemeProvider
          attribute={"class"}
          defaultTheme="dark"
          storageKey="discord-theme"
          enableSystem
        >
          <Providers>
            <NuqsAdapter>{children}</NuqsAdapter>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
