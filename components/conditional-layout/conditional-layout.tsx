"use client"
import { usePathname } from "next/navigation"
import type React from "react"
import { Suspense } from "react"
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Input, Breadcrumb } from "antd"
import {
  DashboardOutlined,
  WalletOutlined,
  PieChartOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
  TagsOutlined,
  BarChartOutlined,
} from "@ant-design/icons"
import { useState } from "react"
import Link from "next/link"
import styles from "./conditional-layout.module.scss"

const { Header, Sider, Content } = Layout
const { Search } = Input

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: "/budget",
      icon: <PieChartOutlined />,
      label: <Link href="/budget">Orçamento</Link>,
    },
    {
      key: "/diary",
      icon: <FileTextOutlined />,
      label: <Link href="/diary">Diário</Link>,
    },
    {
      key: "/invoices",
      icon: <WalletOutlined />,
      label: <Link href="/invoices">Faturas</Link>,
    },
    {
      key: "/payments",
      icon: <WalletOutlined />,
      label: <Link href="/payments">Pagamentos</Link>,
    },
    {
      key: "/tags",
      icon: <TagsOutlined />,
      label: <Link href="/tags">Tags</Link>,
    },
    {
      key: "/reports",
      icon: <BarChartOutlined />,
      label: <Link href="/reports">Relatórios</Link>,
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: <Link href="/settings">Configurações</Link>,
    },
  ]

  const userMenuItems = [
    {
      key: "profile",
      icon: <ProfileOutlined />,
      label: "Perfil",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Configurações",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sair",
      danger: true,
    },
  ]

  const getBreadcrumbItems = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const items = [
      {
        title: <Link href="/dashboard">Dashboard</Link>,
      },
    ]

    if (pathSegments.length > 0) {
      const currentPage = pathSegments[pathSegments.length - 1]
      const pageNames: Record<string, string> = {
        dashboard: "Dashboard",
        budget: "Orçamento",
        diary: "Diário",
        invoices: "Faturas",
        payments: "Pagamentos",
        tags: "Tags",
        reports: "Relatórios",
        settings: "Configurações",
      }

      if (currentPage !== "dashboard") {
        items.push({
          title: pageNames[currentPage] || currentPage,
        })
      }
    }

    return items
  }

  if (isLandingPage) {
    return <div className={styles.landingWrapper}>{children}</div>
  }

  return (
    <div className={styles.dashboardWrapper}>
      <Suspense fallback={<div>Loading...</div>}>
        <Layout className={styles.layout}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className={styles.sider}
            width={280}
            collapsedWidth={80}
          >
            <div className={styles.logo}>
              <WalletOutlined className={styles.logoIcon} />
              {!collapsed && <span className={styles.logoText}>Kawori Financial</span>}
            </div>
            <Menu theme="light" mode="inline" selectedKeys={[pathname]} items={menuItems} className={styles.menu} />
          </Sider>

          <Layout className={styles.mainLayout}>
            <Header className={styles.header}>
              <div className={styles.headerLeft}>
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  className={styles.collapseButton}
                />
                <Breadcrumb items={getBreadcrumbItems()} className={styles.breadcrumb} />
              </div>

              <div className={styles.headerRight}>
                <Search placeholder="Buscar..." allowClear className={styles.search} style={{ width: 250 }} />

                <Badge count={3} size="small">
                  <Button type="text" icon={<BellOutlined />} className={styles.notificationButton} />
                </Badge>

                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
                  <div className={styles.userProfile}>
                    <Avatar size="small" icon={<UserOutlined />} className={styles.avatar} />
                    <span className={styles.userName}>João Silva</span>
                  </div>
                </Dropdown>
              </div>
            </Header>

            <Content className={styles.content}>{children}</Content>
          </Layout>
        </Layout>
      </Suspense>
    </div>
  )
}
