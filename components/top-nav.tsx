"use client"

import Link from "next/link"
import { Menu, Bell, UserCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

/**
 * TopNav – fixed horizontal bar shown at the top of every
 * authenticated page (Dashboard, Invoices, Payments, etc.).
 *
 * Exports:
 *  • named  — `TopNav`
 *  • default— `TopNav`
 *
 * Feel free to extend the actions (notifications, profile menu, etc.)
 * or pass props such as `onSidebarToggle` for a mobile sidebar.
 */
export function TopNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile sidebar trigger (hidden on md+) */}
        <Button size="icon" variant="ghost" className="md:hidden" aria-label="Toggle navigation">
          <Menu className="size-5" />
        </Button>

        {/* App / company logo */}
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight hover:opacity-80">
          Kawori&nbsp;<span className="font-normal text-muted-foreground">Financial</span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Theme / color-scheme toggle */}
        <ModeToggle />

        {/* Notification bell */}
        <Button size="icon" variant="ghost" aria-label="Notifications" className="relative">
          <Bell className="size-5" />
          {/* Red dot for unread notifications */}
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* Profile avatar (placeholder icon for now) */}
        <Button size="icon" variant="ghost" aria-label="Account menu">
          <UserCircle className="size-6" />
        </Button>
      </div>
    </header>
  )
}

export default TopNav
