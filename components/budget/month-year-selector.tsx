"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBudget } from "@/contexts/budget-context"
import { useTranslation } from "@/hooks/use-translation"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function MonthYearSelector() {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } = useBudget()
  const { t } = useTranslation()

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  // Ensure we have valid values
  const safeSelectedMonth = selectedMonth ?? new Date().getMonth()
  const safeSelectedYear = selectedYear ?? new Date().getFullYear()

  return (
    <div className="flex gap-2">
      <Select value={safeSelectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder={t("budget.selectMonth") || "Select Month"} />
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem key={index} value={index.toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={safeSelectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder={t("budget.selectYear") || "Select Year"} />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
