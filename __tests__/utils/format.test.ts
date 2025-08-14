import { formatCurrency, formatDate, formatPercentage } from "@/lib/utils"

describe("Format Utils", () => {
  describe("formatCurrency", () => {
    it("should format positive numbers correctly", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56")
      expect(formatCurrency(0)).toBe("$0.00")
      expect(formatCurrency(999999.99)).toBe("$999,999.99")
    })

    it("should format negative numbers correctly", () => {
      expect(formatCurrency(-1234.56)).toBe("-$1,234.56")
      expect(formatCurrency(-0.01)).toBe("-$0.01")
    })

    it("should handle decimal places correctly", () => {
      expect(formatCurrency(10)).toBe("$10.00")
      expect(formatCurrency(10.5)).toBe("$10.50")
      expect(formatCurrency(10.123)).toBe("$10.12")
    })
  })

  describe("formatDate", () => {
    it("should format dates correctly", () => {
      expect(formatDate("2024-01-15")).toBe("Jan 15, 2024")
      expect(formatDate("2024-12-31")).toBe("Dec 31, 2024")
    })

    it("should handle different date formats", () => {
      expect(formatDate("2024-01-15T10:30:00Z")).toBe("Jan 15, 2024")
      expect(formatDate(new Date("2024-01-15").toISOString())).toBe("Jan 15, 2024")
    })
  })

  describe("formatPercentage", () => {
    it("should format percentages correctly", () => {
      expect(formatPercentage(0.5)).toBe("50%")
      expect(formatPercentage(0.1234)).toBe("12%")
      expect(formatPercentage(1)).toBe("100%")
      expect(formatPercentage(0)).toBe("0%")
    })

    it("should handle decimal places", () => {
      expect(formatPercentage(0.1234, 1)).toBe("12.3%")
      expect(formatPercentage(0.1234, 2)).toBe("12.34%")
    })
  })
})
