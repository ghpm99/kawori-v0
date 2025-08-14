import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider } from "antd"
import { ThemeProvider } from "@/components/theme-provider"
import { BudgetProvider } from "@/contexts/budget-context"
import { DiaryProvider } from "@/contexts/diary-context"
import { FinancialProvider } from "@/contexts/financial-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { I18nProvider } from "@/contexts/i18n-context"
import { QueryProvider } from "@/contexts/query-provider"

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
        <QueryProvider>
          <I18nProvider>
            <SettingsProvider>
              <BudgetProvider>
                <DiaryProvider>
                  <FinancialProvider>
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
                  </FinancialProvider>
                </DiaryProvider>
              </BudgetProvider>
            </SettingsProvider>
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
