export function Stats() {
  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "$2B+", label: "Managed Assets" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ]

  return (
    <section className="py-12 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
