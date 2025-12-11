"use client"

import type React from "react"
import { Layout, Input } from "antd"
import {
  DashboardOutlined,
  WalletOutlined,
  PieChartOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons"
import Link from "next/link"

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
  return <>{children}</>
}
