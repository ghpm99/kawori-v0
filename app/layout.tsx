import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider } from "antd"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kawori Financial",
  description: "Modern financial dashboard for managing your finances",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#1890ff",
                colorSuccess: "#52c41a",
                colorWarning: "#faad14",
                colorError: "#ff4d4f",
                borderRadius: 6,
                fontFamily: inter.style.fontFamily,
              },
              components: {
                Layout: {
                  siderBg: "#ffffff",
                  headerBg: "#ffffff",
                  bodyBg: "#f5f5f5",
                },
                Menu: {
                  itemBg: "transparent",
                  itemSelectedBg: "#e6f7ff",
                  itemHoverBg: "#f0f0f0",
                },
                Card: {
                  borderRadiusLG: 8,
                },
                Button: {
                  borderRadius: 6,
                },
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
