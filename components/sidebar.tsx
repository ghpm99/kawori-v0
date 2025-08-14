"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, FileText, CreditCard, Tags, BarChart3, Settings, PiggyBank, BookOpen } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

const sidebarItems = [
  {
    title: "dashboard.title",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "invoices.title",
    href: "/invoices",
    icon: FileText,
  },
  {
    title: "payments.title",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "tags.title",
    href: "/tags",
    icon: Tags,
  },
  {
    title: "budget.title",
    href: "/budget",
    icon: PiggyBank,
  },
  {
    title: "diary.title",
    href: "/diary",
    icon: BookOpen,
  },
  {
    title: "reports.title",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "settings.title",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Kawori Financial</h2>
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              {sidebarItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", pathname === item.href && "bg-muted font-medium")}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {t(item.title)}
                  </Link>
                </Button>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
