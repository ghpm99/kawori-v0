"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Users, CreditCard, TrendingUp, Briefcase, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDashboard } from "@/contexts/dashboard-context"

const iconMap = {
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
  Briefcase,
  ShieldCheck,
}

export function MetricsCarousel() {
  const { metrics, carouselState, nextSlide, prevSlide } = useDashboard()

  const renderMetrics = () => {
    const items = [...metrics, ...metrics, ...metrics]
    return items.map((metric, index) => {
      const IconComponent = iconMap[metric.icon as keyof typeof iconMap] || DollarSign

      return (
        <div key={index} className="flex-shrink-0" style={{ width: `${carouselState.cardWidth}%` }}>
          <Card className="h-full mx-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <IconComponent className="h-8 w-8 text-primary" />
                <span
                  className={`text-sm font-semibold ${metric.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                >
                  {metric.change}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">{metric.title}</h3>
              <p className="text-2xl font-extrabold mb-4">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        </div>
      )
    })
  }

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="icon" onClick={prevSlide} className="z-10 bg-transparent">
          &lt;
        </Button>
        <div className="flex-grow overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${carouselState.currentIndex * carouselState.cardWidth}%)`,
              width: `${metrics.length * 3 * carouselState.cardWidth}%`,
            }}
          >
            {renderMetrics()}
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={nextSlide} className="z-10 bg-transparent">
          &gt;
        </Button>
      </div>
    </div>
  )
}
