import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider } from "antd"
import { QueryProvider } from "@/contexts/query-provider"
import { I18nProvider } from "@/contexts/i18n-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { BudgetProvider } from "@/contexts/budget-context"
import { DiaryProvider } from "@/contexts/diary-context"
import { FinancialProvider } from "@/contexts/financial-context"
import { ConditionalLayout } from "@/components/conditional-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kawori Financial",
  description: "Sistema de gestão financeira pessoal",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
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
                            },
                          }}
                        >
                          <ConditionalLayout>{children}</ConditionalLayout>
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
