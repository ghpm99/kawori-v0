import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider } from "antd"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kawori Financial - Personal Finance Management",
  description: "Manage your finances with ease using Kawori Financial dashboard",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AntdRegistry>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#1890ff",
                  colorSuccess: "#52c41a",
                  colorWarning: "#faad14",
                  colorError: "#ff4d4f",
                  borderRadius: 6,
                },
                components: {
                  Layout: {
                    siderBg: "#ffffff",
                    headerBg: "#ffffff",
                  },
                  Menu: {
                    itemBg: "transparent",
                    itemSelectedBg: "#e6f7ff",
                  },
                },
              }}
            >
              {children}
            </ConfigProvider>
          </AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  )
}
