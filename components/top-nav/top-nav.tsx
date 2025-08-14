"use client"
import { Layout, Breadcrumb, Input, Badge, Avatar, Dropdown } from "antd"
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons"
import { usePathname, useRouter } from "next/navigation"
import styles from "./top-nav.module.scss"

const { Header } = Layout
const { Search } = Input

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()

  const getBreadcrumbItems = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const items = [
      {
        title: "Home",
        href: "/dashboard",
      },
    ]

    pathSegments.forEach((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/")
      const title = segment.charAt(0).toUpperCase() + segment.slice(1)
      items.push({
        title,
        href,
      })
    })

    return items
  }

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

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      console.log("Logout clicked")
    } else if (key === "profile") {
      router.push("/profile")
    } else if (key === "settings") {
      router.push("/settings")
    }
  }

  const handleSearch = (value: string) => {
    console.log("Search:", value)
  }

  const handleNotificationClick = () => {
    console.log("Notifications clicked")
  }

  return (
    <div className={styles.topNav}>
      <Header>
        <div className={styles.leftSection}>
          <div className={styles.breadcrumb}>
            <Breadcrumb items={getBreadcrumbItems()} />
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.searchBox}>
            <Search placeholder="Search..." allowClear enterButton={<SearchOutlined />} onSearch={handleSearch} />
          </div>

          <div className={styles.notifications} onClick={handleNotificationClick}>
            <Badge count={5} size="small" className={styles.badge}>
              <BellOutlined className={styles.notificationIcon} />
            </Badge>
          </div>

          <div className={styles.userMenu}>
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <div className={styles.userInfo}>
                <Avatar className={styles.avatar} icon={<UserOutlined />} size="small" />
                <span className={styles.userName}>John Doe</span>
              </div>
            </Dropdown>
          </div>
        </div>
      </Header>
    </div>
  )
}
