'use client'
import { ThemeProvider } from "styled-components";
import { Inter } from "next/font/google";
import GlobalStyles from "./global"
import { darkTheme } from "@/src/styles/themes/dark";
import AppTemplate from "@/src/components/AppTemplate";
import AuthProvider from "@/providers/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider theme={darkTheme}>
            <GlobalStyles />
            <AppTemplate>
              {children}
            </AppTemplate> 
            <ToastContainer theme="dark"/> 
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
