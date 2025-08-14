"use client"

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
} from "@ant-design/icons"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./layout.module.scss"

const { Header, Sider, Content } = Layout
const { Search } = Input

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
    key: "/reports",
    icon: <FileTextOutlined />,
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const getBreadcrumbItems = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const items = [
      {
        title: <Link href="/dashboard">Dashboard</Link>,
      },
    ]

    if (pathSegments.length > 1) {
      const currentPage = pathSegments[pathSegments.length - 1]
      const pageNames: Record<string, string> = {
        budget: "Orçamento",
        diary: "Diário",
        invoices: "Faturas",
        payments: "Pagamentos",
        reports: "Relatórios",
        settings: "Configurações",
      }

      items.push({
        title: pageNames[currentPage] || currentPage,
      })
    }

    return items
  }

  return (
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
  )
}
