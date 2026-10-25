import type React from "react"
import { Work_Sans, Open_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

export const metadata = {
  title: "GRADE - Grading Risk and Decision Error Disclosure | NTU",
  description: "Sophisticated grading platform for Nanyang Technological University instructors",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${workSans.variable} ${openSans.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div
            aria-hidden="true"
            className="fixed inset-0 -z-10 scale-105 bg-cover bg-center bg-no-repeat blur-[1px]"
            style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_BASE_PATH || ""}/ntu-the-hive.jpg')` }}
          />
          <div aria-hidden="true" className="fixed inset-0 -z-10 bg-background/80 dark:bg-background/88" />
          <Header />
          <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
