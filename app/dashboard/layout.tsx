"use client"

import type React from "react"

import { useState } from "react"
import { Layout, Menu, Avatar, Dropdown, Breadcrumb, Input, Badge, Button, Suspense } from "antd"
import {
  DashboardOutlined,
  WalletOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
} from "@ant-design/icons"
import { useRouter, usePathname } from "next/navigation"
import styles from "./layout.module.scss"

const { Sider, Header, Content } = Layout

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/budget",
      icon: <WalletOutlined />,
      label: "Budget",
    },
    {
      key: "/reports",
      icon: <BarChartOutlined />,
      label: "Reports",
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ]

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key)
    setMobileMenuVisible(false)
  }

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      router.push("/")
    } else if (key === "settings") {
      router.push("/settings")
    }
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
    if (window.innerWidth <= 768) {
      setMobileMenuVisible(!mobileMenuVisible)
    }
  }

  const getBreadcrumbItems = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const items = [
      {
        title: "Home",
      },
    ]

    pathSegments.forEach((segment, index) => {
      const path = "/" + pathSegments.slice(0, index + 1).join("/")
      const title = segment.charAt(0).toUpperCase() + segment.slice(1)
      items.push({
        title,
        href: path,
      })
    })

    return items
  }

  return (
    <Suspense fallback={null}>
      <Layout className={styles.layout}>
        {/* Mobile Overlay */}
        <div
          className={`${styles.mobileOverlay} ${mobileMenuVisible ? styles.visible : ""}`}
          onClick={() => setMobileMenuVisible(false)}
        />

        {/* Sidebar */}
        <Sider
          className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
          collapsed={collapsed}
          collapsedWidth={window?.innerWidth <= 768 ? 0 : 80}
          width={200}
          style={{
            transform: mobileMenuVisible
              ? "translateX(0)"
              : window?.innerWidth <= 768
                ? "translateX(-100%)"
                : "translateX(0)",
          }}
        >
          <div className={styles.sidebarContent}>
            {/* Logo */}
            <div className={styles.logo}>
              <h2 className={collapsed ? styles.logoCollapsed : ""}>{collapsed ? "KF" : "Kawori Financial"}</h2>
            </div>

            {/* Menu */}
            <Menu
              className={styles.menu}
              mode="inline"
              selectedKeys={[pathname]}
              items={menuItems}
              onClick={handleMenuClick}
            />

            {/* User Section */}
            <div className={styles.userSection}>
              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: handleUserMenuClick,
                }}
                placement="topRight"
                trigger={["click"]}
              >
                <div className={styles.userInfo}>
                  <Avatar className={styles.userAvatar} size="small">
                    JD
                  </Avatar>
                  {!collapsed && (
                    <div className={styles.userDetails}>
                      <p className={styles.userName}>John Doe</p>
                      <p className={styles.userRole}>Administrator</p>
                    </div>
                  )}
                </div>
              </Dropdown>
            </div>
          </div>
        </Sider>

        {/* Main Content */}
        <Layout className={`${styles.mainContent} ${collapsed ? styles.collapsed : ""}`}>
          {/* Header */}
          <Header className={styles.header}>
            <div className={styles.headerLeft}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleSidebar}
                className={styles.menuButton}
              />
              <Breadcrumb className={styles.breadcrumb} items={getBreadcrumbItems()} />
            </div>

            <div className={styles.headerRight}>
              <Input className={styles.searchInput} placeholder="Search..." prefix={<SearchOutlined />} />
              <Badge count={5} size="small">
                <Button type="text" icon={<BellOutlined />} className={styles.notificationButton} />
              </Badge>
              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: handleUserMenuClick,
                }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Avatar className={styles.userAvatar} style={{ cursor: "pointer" }}>
                  JD
                </Avatar>
              </Dropdown>
            </div>
          </Header>

          {/* Content */}
          <Content className={styles.content}>{children}</Content>
        </Layout>
      </Layout>
    </Suspense>
  )
}
