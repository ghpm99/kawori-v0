"use client"
import { ArrowRightOutlined, DashboardOutlined, TrophyOutlined, RiseOutlined } from "@ant-design/icons"
import { useRouter } from "next/navigation"
import styles from "./landing.module.scss"

export default function LandingPage() {
  const router = useRouter()

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  const features = [
    {
      icon: <DashboardOutlined />,
      title: "Dashboard Analytics",
      description: "Comprehensive financial overview with real-time data visualization and insights.",
    },
    {
      icon: <TrophyOutlined />,
      title: "Budget Management",
      description: "Smart budgeting tools to help you track expenses and achieve your financial goals.",
    },
    {
      icon: <RiseOutlined />,
      title: "Growth Tracking",
      description: "Monitor your financial growth with detailed reports and performance metrics.",
    },
  ]

  const stats = [
    { number: "11,280", label: "Active Users" },
    { number: "1,128,000", label: "Transactions" },
    { number: "99.9%", label: "Success Rate" },
    { number: "99.99%", label: "Uptime" },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Kawori Financial</h1>
        <p className={styles.subtitle}>
          Take control of your finances with our modern, intuitive dashboard. Track expenses, manage budgets, and
          achieve your financial goals with ease.
        </p>
        <div className={styles.buttons}>
          <button className={styles.primaryButton} onClick={handleGoToDashboard}>
            <DashboardOutlined />
            Go to Dashboard
            <ArrowRightOutlined />
          </button>
          <button className={styles.secondaryButton}>Learn More</button>
        </div>
      </div>

      <div className={styles.features}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.featureIcon}>{feature.icon}</div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDescription}>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className={styles.stats}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statNumber}>{stat.number}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
