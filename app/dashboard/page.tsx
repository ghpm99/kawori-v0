"use client"

import { Card, Row, Col, Statistic, Progress, Table, Tag, Space, Button } from "antd"
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  RiseOutlined,
} from "@ant-design/icons"
import { FinancialChart } from "@/components/financial-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { BusinessMetrics } from "@/components/business-metrics"
import styles from "./dashboard.module.scss"

const { Meta } = Card

export default function Dashboard() {
  const statsData = [
    {
      title: "Receita Total",
      value: 112893,
      precision: 2,
      valueStyle: { color: "#3f8600" },
      prefix: <ArrowUpOutlined />,
      suffix: "€",
    },
    {
      title: "Despesas",
      value: 48271,
      precision: 2,
      valueStyle: { color: "#cf1322" },
      prefix: <ArrowDownOutlined />,
      suffix: "€",
    },
    {
      title: "Lucro Líquido",
      value: 64622,
      precision: 2,
      valueStyle: { color: "#3f8600" },
      prefix: <RiseOutlined />,
      suffix: "€",
    },
    {
      title: "Crescimento",
      value: 12.5,
      precision: 1,
      valueStyle: { color: "#3f8600" },
      prefix: <ArrowUpOutlined />,
      suffix: "%",
    },
  ]

  const recentOrders = [
    {
      key: "1",
      id: "#12345",
      customer: "João Silva",
      product: "Consultoria Financeira",
      amount: 1250.0,
      status: "completed",
      date: "2024-01-15",
    },
    {
      key: "2",
      id: "#12346",
      customer: "Maria Santos",
      product: "Planejamento Orçamentário",
      amount: 850.0,
      status: "pending",
      date: "2024-01-14",
    },
    {
      key: "3",
      id: "#12347",
      customer: "Pedro Costa",
      product: "Análise de Investimentos",
      amount: 2100.0,
      status: "completed",
      date: "2024-01-13",
    },
    {
      key: "4",
      id: "#12348",
      customer: "Ana Oliveira",
      product: "Gestão de Dívidas",
      amount: 750.0,
      status: "cancelled",
      date: "2024-01-12",
    },
  ]

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Cliente",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Produto/Serviço",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Valor",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `€${amount.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig = {
          completed: { color: "green", text: "Concluído" },
          pending: { color: "orange", text: "Pendente" },
          cancelled: { color: "red", text: "Cancelado" },
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Ações",
      key: "actions",
      render: () => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" icon={<DeleteOutlined />} size="small" danger />
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard Financeiro</h1>
        <p>Visão geral das suas finanças e métricas importantes</p>
      </div>

      <Row gutter={[24, 24]} className={styles.statsRow}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className={styles.statCard}>
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={stat.precision}
                valueStyle={stat.valueStyle}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} className={styles.chartsRow}>
        <Col xs={24} lg={16}>
          <Card title="Evolução Financeira" className={styles.chartCard}>
            <FinancialChart />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Métricas de Negócio" className={styles.metricsCard}>
            <BusinessMetrics />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className={styles.tablesRow}>
        <Col xs={24} lg={16}>
          <Card title="Pedidos Recentes" className={styles.tableCard}>
            <Table columns={columns} dataSource={recentOrders} pagination={{ pageSize: 5 }} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Transações Recentes" className={styles.transactionsCard}>
            <RecentTransactions />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className={styles.progressRow}>
        <Col xs={24} md={8}>
          <Card title="Meta Mensal" className={styles.progressCard}>
            <Progress type="circle" percent={75} format={(percent) => `${percent}%`} strokeColor="#52c41a" />
            <div className={styles.progressInfo}>
              <p>€84,622 de €112,893</p>
              <p>Faltam €28,271 para a meta</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Economia Anual" className={styles.progressCard}>
            <Progress type="circle" percent={60} format={(percent) => `${percent}%`} strokeColor="#1890ff" />
            <div className={styles.progressInfo}>
              <p>€36,000 de €60,000</p>
              <p>Faltam €24,000 para a meta</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Investimentos" className={styles.progressCard}>
            <Progress type="circle" percent={45} format={(percent) => `${percent}%`} strokeColor="#722ed1" />
            <div className={styles.progressInfo}>
              <p>€22,500 de €50,000</p>
              <p>Faltam €27,500 para a meta</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
