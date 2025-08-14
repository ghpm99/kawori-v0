import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Shield, Smartphone, TrendingUp, Wallet, Zap } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Get deep insights into your spending patterns and financial trends with our powerful analytics engine.",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data is protected with enterprise-grade encryption and multi-factor authentication.",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Access your financial dashboard anywhere, anytime with our responsive mobile-first design.",
    },
    {
      icon: TrendingUp,
      title: "Investment Tracking",
      description: "Monitor your portfolio performance and get personalized investment recommendations.",
    },
    {
      icon: Wallet,
      title: "Expense Management",
      description: "Categorize and track your expenses automatically with smart transaction recognition.",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Stay up-to-date with instant notifications and real-time account synchronization.",
    },
  ]

  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to manage your finances</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive suite of tools helps you take control of your financial life
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
