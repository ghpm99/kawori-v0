"use client"

import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotification } from "@/contexts/notification-context"

const iconMap = {
  Info: () => <div className="w-5 h-5 bg-blue-500 rounded-full" />,
  AlertTriangle: () => <div className="w-5 h-5 bg-yellow-500 rounded-full" />,
  CreditCard: () => <div className="w-5 h-5 bg-red-500 rounded-full" />,
  TrendingUp: () => <div className="w-5 h-5 bg-green-500 rounded-full" />,
  Gift: () => <div className="w-5 h-5 bg-purple-500 rounded-full" />,
}

export function Notifications() {
  const { notifications, unreadCount, isOpen, setIsOpen, markAsRead } = useNotification()

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />}
      </Button>
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-96 z-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close notifications">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {notifications.map((notification) => {
                const IconComponent = iconMap[notification.icon as keyof typeof iconMap] || iconMap.Info
                return (
                  <Card
                    key={notification.id}
                    className={`mb-4 last:mb-0 border shadow-sm cursor-pointer ${!notification.read ? "bg-blue-50 dark:bg-blue-950" : ""}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className={`${notification.color} p-2 rounded-full bg-opacity-10`}>
                          <IconComponent />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
