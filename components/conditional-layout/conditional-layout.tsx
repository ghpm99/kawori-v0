"use client"
import { usePathname } from "next/navigation"
import type React from "react"

import styles from "./conditional-layout.module.scss"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"

  return (
    <div className={styles.conditionalLayout}>
      <div className={isLandingPage ? styles.landingWrapper : styles.dashboardWrapper}>{children}</div>
    </div>
  )
}
