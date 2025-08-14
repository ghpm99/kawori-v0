"use client"

import { usePathname } from "next/navigation"
import DashboardLayout from "@/app/dashboard/layout"

export function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"

  if (isLandingPage) {
    return <>{children}</>
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
