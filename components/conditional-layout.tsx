"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"

export function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"

  if (isLandingPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
