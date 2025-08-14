"use client"
import { useState } from "react"
import { Layout, Menu, Avatar, Dropdown } from "antd"
import {
  DashboardOutlined,
  WalletOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  TagsOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons"
import { usePathname, useRouter } from "next/navigation"
import styles from "./sidebar.module.scss"

const { Sider } = Layout

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

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
      key: "/diary",
      icon: <FileTextOutlined />,
      label: "Diary",
    },
    {
      key: "/invoices",
      icon: <FileTextOutlined />,
      label: "Invoices",
    },
    {
      key: "/payments",
      icon: <CreditCardOutlined />,
      label: "Payments",
    },
    {
      key: "/tags",
      icon: <TagsOutlined />,
      label: "Tags",
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
      icon: <ProfileOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key)
  }

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      // Handle logout
      console.log("Logout clicked")
    } else if (key === "profile") {
      router.push("/profile")
    } else if (key === "settings") {
      router.push("/settings")
    }
  }

  return (
    <div className={styles.sidebar}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={240} collapsedWidth={80}>
        <div className={styles.logo}>
          <div className={styles.logoText}>{collapsed ? "KF" : "Kawori Financial"}</div>
        </div>

        <div className={styles.menu}>
          <Menu mode="inline" selectedKeys={[pathname]} items={menuItems} onClick={handleMenuClick} />
        </div>

        <div className={styles.userSection}>
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="topLeft"
            trigger={["click"]}
          >
            <div className={styles.userInfo}>
              <Avatar className={styles.avatar} icon={<UserOutlined />} size={collapsed ? "small" : "default"} />
              {!collapsed && (
                <div className={styles.userDetails}>
                  <div className={styles.userName}>John Doe</div>
                  <div className={styles.userRole}>Administrator</div>
                </div>
              )}
            </div>
          </Dropdown>
        </div>
      </Sider>
    </div>
  )
}
