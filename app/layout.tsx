import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToolbarWrapper } from "@/components/ToolbarWrapper";
import { ToolbarProvider } from "@/components/toolbar-provider";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Including a range but targeting 300/400
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Proyecto Eco",
  description: "Ecosistema Digital Inteligente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${nunito.className} antialiased font-light text-[12pt]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ToolbarProvider />
          {children}
          <ToolbarWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
