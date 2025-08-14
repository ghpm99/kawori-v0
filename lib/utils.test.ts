import { cn, formatCurrency, formatDate, formatTime } from "./utils"

describe("Utils", () => {
  describe("cn", () => {
    it("should merge class names", () => {
      const result = cn("class1", "class2")
      expect(result).toContain("class1")
      expect(result).toContain("class2")
    })

    it("should handle conditional classes", () => {
      const result = cn("base", true && "conditional", false && "hidden")
      expect(result).toContain("base")
      expect(result).toContain("conditional")
      expect(result).not.toContain("hidden")
    })

    it("should handle undefined and null", () => {
      const result = cn("base", undefined, null, "valid")
      expect(result).toContain("base")
      expect(result).toContain("valid")
    })
  })

  describe("formatCurrency", () => {
    it("should format currency with default options", () => {
      const result = formatCurrency(1000)
      expect(result).toBe("$1,000.00")
    })

    it("should format currency with custom currency", () => {
      const result = formatCurrency(1000, "EUR")
      expect(result).toContain("€")
      expect(result).toContain("1,000")
    })

    it("should format currency with custom locale", () => {
      const result = formatCurrency(1000, "USD", "pt-BR")
      expect(result).toContain("US$")
      expect(result).toContain("1.000")
    })

    it("should handle zero", () => {
      const result = formatCurrency(0)
      expect(result).toBe("$0.00")
    })

    it("should handle negative numbers", () => {
      const result = formatCurrency(-1000)
      expect(result).toContain("-")
      expect(result).toContain("1,000")
    })

    it("should handle decimal numbers", () => {
      const result = formatCurrency(1234.56)
      expect(result).toBe("$1,234.56")
    })
  })

  describe("formatDate", () => {
    it("should format date with default options", () => {
      const date = new Date("2024-01-15")
      const result = formatDate(date)
      expect(result).toContain("2024")
      expect(result).toContain("Jan")
      expect(result).toContain("15")
    })

    it("should format date with custom locale", () => {
      const date = new Date("2024-01-15")
      const result = formatDate(date, "pt-BR")
      expect(result).toContain("2024")
    })

    it("should format date with custom options", () => {
      const date = new Date("2024-01-15")
      const result = formatDate(date, "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      expect(result).toContain("January")
      expect(result).toContain("15")
      expect(result).toContain("2024")
    })

    it("should handle string dates", () => {
      const result = formatDate("2024-01-15")
      expect(result).toContain("2024")
      expect(result).toContain("Jan")
      expect(result).toContain("15")
    })
  })

  describe("formatTime", () => {
    it("should format time in milliseconds", () => {
      const result = formatTime(65000) // 1 minute 5 seconds
      expect(result).toBe("01:05.00")
    })

    it("should format zero time", () => {
      const result = formatTime(0)
      expect(result).toBe("00:00.00")
    })

    it("should format hours correctly", () => {
      const result = formatTime(3665000) // 1 hour 1 minute 5 seconds
      expect(result).toBe("61:05.00") // Shows as minutes
    })

    it("should format milliseconds correctly", () => {
      const result = formatTime(1500) // 1.5 seconds
      expect(result).toBe("00:01.50")
    })

    it("should pad numbers correctly", () => {
      const result = formatTime(5000) // 5 seconds
      expect(result).toBe("00:05.00")
    })
  })
})
