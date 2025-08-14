import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Your Financial Future, <span className="text-primary">Simplified</span>
          </h1>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join thousands of users who have already transformed their financial lives with Kawori Financial
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          <div className="mt-12">
            <div className="relative mx-auto max-w-5xl">
              <div className="rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 p-2">
                <div className="rounded-lg bg-background shadow-2xl">
                  <img
                    src="/placeholder.svg?height=600&width=1000"
                    alt="Financial Dashboard Preview"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
