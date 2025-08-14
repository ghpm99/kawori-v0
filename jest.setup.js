"use client"

import "@testing-library/jest-dom"
import jest from "jest"
import { beforeAll, afterAll } from "@jest/globals"

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  usePathname() {
    return "/dashboard"
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Ant Design components that might cause issues in tests
jest.mock("antd", () => {
  const antd = jest.requireActual("antd")
  return {
    ...antd,
    ConfigProvider: ({ children }) => children,
    Layout: {
      ...antd.Layout,
      Sider: ({ children, ...props }) => (
        <div data-testid="sider" {...props}>
          {children}
        </div>
      ),
      Header: ({ children, ...props }) => (
        <div data-testid="header" {...props}>
          {children}
        </div>
      ),
      Content: ({ children, ...props }) => (
        <div data-testid="content" {...props}>
          {children}
        </div>
      ),
    },
  }
})

// Mock Recharts
jest.mock("recharts", () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
}))

// Mock SCSS modules
jest.mock("*.module.scss", () => ({}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Suppress console warnings during tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("Warning: ReactDOM.render is no longer supported")) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
