"use client"

import { useState } from "react"
import { Card, Select, DatePicker, Table, Tag, Button, Space } from "antd"
import {
  DollarOutlined,
  TrendingUpOutlined,
  TrendingDownOutlined,
  PercentageOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { formatCurrency, formatDate, formatPercentage } from "@/lib/utils"
import styles from "./dashboard.module.scss"

const { RangePicker } = DatePicker

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Mock data
  const metrics = [
    {
      key: "revenue",
      title: "Revenue",
      value: 24500,
      change: 12.5,
      icon: <DollarOutlined />,
      trend: "up",
    },
    {
      key: "expenses",
      title: "Expenses",
      value: 8200,
      change: -3.2,
      icon: <TrendingDownOutlined />,
      trend: "down",
    },
    {
      key: "profit",
      title: "Profit",
      value: 16300,
      change: 18.7,
      icon: <TrendingUpOutlined />,
      trend: "up",
    },
    {
      key: "growth",
      title: "Growth",
      value: 25,
      change: 5.3,
      icon: <PercentageOutlined />,
      trend: "up",
      isPercentage: true,
    },
  ]

  const chartData = [
    { month: "Jan", revenue: 12000, expenses: 8000 },
    { month: "Feb", revenue: 15000, expenses: 9000 },
    { month: "Mar", revenue: 18000, expenses: 7500 },
    { month: "Apr", revenue: 22000, expenses: 8500 },
    { month: "May", revenue: 20000, expenses: 9200 },
    { month: "Jun", revenue: 24500, expenses: 8200 },
  ]

  const barChartData = [
    { category: "Food", amount: 2500 },
    { category: "Transport", amount: 1800 },
    { category: "Entertainment", amount: 1200 },
    { category: "Utilities", amount: 800 },
    { category: "Shopping", amount: 2200 },
  ]

  const transactions = [
    {
      key: "1",
      id: "TXN001",
      description: "Salary Payment",
      amount: 5000,
      date: new Date("2024-01-15"),
      status: "completed",
    },
    {
      key: "2",
      id: "TXN002",
      description: "Grocery Shopping",
      amount: -150,
      date: new Date("2024-01-14"),
      status: "completed",
    },
    {
      key: "3",
      id: "TXN003",
      description: "Utility Bill",
      amount: -80,
      date: new Date("2024-01-13"),
      status: "pending",
    },
    {
      key: "4",
      id: "TXN004",
      description: "Investment Return",
      amount: 1200,
      date: new Date("2024-01-12"),
      status: "completed",
    },
    {
      key: "5",
      id: "TXN005",
      description: "Online Purchase",
      amount: -299,
      date: new Date("2024-01-11"),
      status: "failed",
    },
  ]

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => (
        <span style={{ color: amount > 0 ? "#52c41a" : "#ff4d4f", fontWeight: 600 }}>
          {formatCurrency(Math.abs(amount))}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: Date) => formatDate(date),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag className={`${styles.statusTag} ${styles[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: () => (
        <Space className={styles.actionButtons}>
          <Button type="text" size="small" icon={<EditOutlined />} />
          <Button type="text" size="small" icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ]

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedStatus === "all") return true
    return transaction.status === selectedStatus
  })

  return (
    <div className={styles.dashboard}>
      {/* Metrics Grid */}
      <div className={styles.metricsGrid}>
        {metrics.map((metric) => (
          <Card key={metric.key} className={`${styles.metricCard} ${styles[metric.key]}`}>
            <div className={styles.metricContent}>
              <div className={styles.metricHeader}>
                <div className={`${styles.metricIcon} ${styles[metric.key]}`}>{metric.icon}</div>
                <div className={`${styles.metricChange} ${metric.trend === "up" ? styles.positive : styles.negative}`}>
                  {metric.trend === "up" ? "+" : ""}
                  {formatPercentage(metric.change)}
                </div>
              </div>
              <div className={styles.metricBody}>
                <h3 className={styles.metricValue}>
                  {metric.isPercentage ? formatPercentage(metric.value, 0) : formatCurrency(metric.value)}
                </h3>
                <p className={styles.metricLabel}>{metric.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className={styles.chartsSection}>
        <Card
          className={styles.chartCard}
          title="Revenue vs Expenses"
          extra={
            <div className={styles.chartControls}>
              <Select
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                options={[
                  { label: "7 Days", value: "7d" },
                  { label: "30 Days", value: "30d" },
                  { label: "90 Days", value: "90d" },
                  { label: "1 Year", value: "1y" },
                ]}
              />
            </div>
          }
        >
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#8c8c8c" />
                <YAxis stroke="#8c8c8c" />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), ""]}
                  labelStyle={{ color: "#262626" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #d9d9d9",
                    borderRadius: "6px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1890ff"
                  strokeWidth={3}
                  dot={{ fill: "#1890ff", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#1890ff", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ff4d4f"
                  strokeWidth={3}
                  dot={{ fill: "#ff4d4f", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#ff4d4f", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={styles.chartCard} title="Expenses by Category">
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" stroke="#8c8c8c" />
                <YAxis stroke="#8c8c8c" />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Amount"]}
                  labelStyle={{ color: "#262626" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #d9d9d9",
                    borderRadius: "6px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="amount" fill="#1890ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Transactions Section */}
      <div className={styles.transactionsSection}>
        <Card className={styles.transactionsCard} title="Recent Transactions">
          <div className={styles.transactionsHeader}>
            <div className={styles.transactionsFilters}>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: 120 }}
                options={[
                  { label: "All Status", value: "all" },
                  { label: "Completed", value: "completed" },
                  { label: "Pending", value: "pending" },
                  { label: "Failed", value: "failed" },
                ]}
              />
              <RangePicker />
            </div>
          </div>
          <div className={styles.transactionsTable}>
            <Table
              columns={columns}
              dataSource={filteredTransactions}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} transactions`,
              }}
              scroll={{ x: 800 }}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
