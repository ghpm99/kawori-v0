"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Upload,
  FileSpreadsheet,
  Check,
  X,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Link2,
  Unlink,
  Search,
  Download,
  RefreshCw,
  ArrowRight,
  FileText,
  Loader2,
} from "lucide-react"
import { useFinancial, type Payment } from "@/contexts/financial-context"
import { cn } from "@/lib/utils"

// Types
interface CSVRow {
  [key: string]: string
}

interface ParsedTransaction {
  id: string
  originalRow: CSVRow
  mappedData: Partial<Payment>
  validationErrors: string[]
  isValid: boolean
  matchedPayment?: Payment
  matchScore?: number
  selected: boolean
}

interface ColumnMapping {
  csvColumn: string
  systemField: string
}

type ImportType = "payments" | "invoices"
type ImportStep = "upload" | "mapping" | "preview" | "reconciliation" | "confirm"

const PAYMENT_FIELDS = [
  { value: "description", label: "Descrição", required: true },
  { value: "amount", label: "Valor", required: true },
  { value: "date", label: "Data", required: true },
  { value: "method", label: "Método", required: false },
  { value: "type", label: "Tipo (Receita/Despesa)", required: false },
  { value: "reference", label: "Referência", required: false },
  { value: "status", label: "Status", required: false },
  { value: "ignore", label: "Ignorar coluna", required: false },
]

const INVOICE_FIELDS = [
  { value: "clientName", label: "Nome do Cliente", required: true },
  { value: "clientEmail", label: "Email do Cliente", required: false },
  { value: "date", label: "Data", required: true },
  { value: "dueDate", label: "Data de Vencimento", required: true },
  { value: "total", label: "Valor Total", required: true },
  { value: "status", label: "Status", required: false },
  { value: "ignore", label: "Ignorar coluna", required: false },
]

interface CSVImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType?: ImportType
}

export function CSVImportModal({ open, onOpenChange, defaultType = "payments" }: CSVImportModalProps) {
  const { payments, createPayment, formatCurrency, formatDate } = useFinancial()

  // State
  const [step, setStep] = useState<ImportStep>("upload")
  const [importType, setImportType] = useState<ImportType>(defaultType)
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<CSVRow[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([])
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [showOnlyMatches, setShowOnlyMatches] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  // Reset state when modal closes
  const resetState = useCallback(() => {
    setStep("upload")
    setFile(null)
    setCsvData([])
    setHeaders([])
    setColumnMappings([])
    setParsedTransactions([])
    setIsProcessing(false)
    setImportProgress(0)
    setSearchTerm("")
    setShowOnlyMatches(false)
  }, [])

  const handleOpenChange = (open: boolean) => {
    if (!open) resetState()
    onOpenChange(open)
  }

  // File handling
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const parseCSV = useCallback((text: string): { headers: string[]; data: CSVRow[] } => {
    const lines = text.split("\n").filter((line) => line.trim())
    if (lines.length === 0) return { headers: [], data: [] }

    const parseCSVLine = (line: string): string[] => {
      const result: string[] = []
      let current = ""
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if ((char === "," || char === ";") && !inQuotes) {
          result.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      result.push(current.trim())
      return result
    }

    const headers = parseCSVLine(lines[0])
    const data = lines.slice(1).map((line) => {
      const values = parseCSVLine(line)
      const row: CSVRow = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ""
      })
      return row
    })

    return { headers, data }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files?.[0]) {
      processFile(files[0])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files?.[0]) {
      processFile(files[0])
    }
  }, [])

  const processFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".csv")) {
        alert("Por favor, selecione um arquivo CSV")
        return
      }

      setFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const { headers, data } = parseCSV(text)
        setHeaders(headers)
        setCsvData(data)

        // Auto-map columns based on header names
        const autoMappings: ColumnMapping[] = headers.map((header) => {
          const lowerHeader = header.toLowerCase()
          let systemField = "ignore"

          if (lowerHeader.includes("descri") || lowerHeader.includes("desc")) {
            systemField = "description"
          } else if (lowerHeader.includes("valor") || lowerHeader.includes("amount") || lowerHeader.includes("value")) {
            systemField = "amount"
          } else if (lowerHeader.includes("data") || lowerHeader.includes("date")) {
            systemField = "date"
          } else if (
            lowerHeader.includes("método") ||
            lowerHeader.includes("method") ||
            lowerHeader.includes("forma")
          ) {
            systemField = "method"
          } else if (lowerHeader.includes("tipo") || lowerHeader.includes("type")) {
            systemField = "type"
          } else if (
            lowerHeader.includes("referência") ||
            lowerHeader.includes("reference") ||
            lowerHeader.includes("ref")
          ) {
            systemField = "reference"
          } else if (lowerHeader.includes("status")) {
            systemField = "status"
          } else if (lowerHeader.includes("cliente") || lowerHeader.includes("client")) {
            systemField = "clientName"
          } else if (lowerHeader.includes("email")) {
            systemField = "clientEmail"
          } else if (lowerHeader.includes("vencimento") || lowerHeader.includes("due")) {
            systemField = "dueDate"
          } else if (lowerHeader.includes("total")) {
            systemField = "total"
          }

          return { csvColumn: header, systemField }
        })

        setColumnMappings(autoMappings)
        setStep("mapping")
      }
      reader.readAsText(file)
    },
    [parseCSV],
  )

  // Column mapping
  const updateMapping = useCallback((csvColumn: string, systemField: string) => {
    setColumnMappings((prev) => prev.map((m) => (m.csvColumn === csvColumn ? { ...m, systemField } : m)))
  }, [])

  const fields = importType === "payments" ? PAYMENT_FIELDS : INVOICE_FIELDS

  // Parse and validate transactions
  const processTransactions = useCallback(() => {
    setIsProcessing(true)

    const transactions: ParsedTransaction[] = csvData.map((row, index) => {
      const mappedData: Partial<Payment> = {}
      const validationErrors: string[] = []

      columnMappings.forEach((mapping) => {
        if (mapping.systemField === "ignore") return

        const value = row[mapping.csvColumn]

        if (mapping.systemField === "amount") {
          const numValue = Number.parseFloat(value.replace(/[^\d.,-]/g, "").replace(",", "."))
          if (isNaN(numValue)) {
            validationErrors.push(`Valor inválido: ${value}`)
          } else {
            mappedData.amount = Math.abs(numValue)
            // Auto-detect type based on negative/positive
            if (numValue < 0) {
              mappedData.type = "expense"
            }
          }
        } else if (mapping.systemField === "date") {
          // Try to parse date
          const dateValue = parseDate(value)
          if (!dateValue) {
            validationErrors.push(`Data inválida: ${value}`)
          } else {
            mappedData.date = dateValue
          }
        } else if (mapping.systemField === "type") {
          const lowerValue = value.toLowerCase()
          if (
            lowerValue.includes("recei") ||
            lowerValue.includes("créd") ||
            lowerValue.includes("entrada") ||
            lowerValue.includes("income")
          ) {
            mappedData.type = "income"
          } else if (
            lowerValue.includes("despe") ||
            lowerValue.includes("déb") ||
            lowerValue.includes("saída") ||
            lowerValue.includes("expense")
          ) {
            mappedData.type = "expense"
          }
        } else if (mapping.systemField === "method") {
          const lowerValue = value.toLowerCase()
          if (lowerValue.includes("pix")) {
            mappedData.method = "pix"
          } else if (lowerValue.includes("cartão") || lowerValue.includes("card") || lowerValue.includes("crédito")) {
            mappedData.method = "credit_card"
          } else if (lowerValue.includes("transfer") || lowerValue.includes("ted") || lowerValue.includes("doc")) {
            mappedData.method = "bank_transfer"
          } else if (lowerValue.includes("dinheiro") || lowerValue.includes("cash")) {
            mappedData.method = "cash"
          }
        } else if (mapping.systemField === "status") {
          const lowerValue = value.toLowerCase()
          if (lowerValue.includes("pago") || lowerValue.includes("complet") || lowerValue.includes("paid")) {
            mappedData.status = "completed"
          } else if (lowerValue.includes("pend") || lowerValue.includes("aguard")) {
            mappedData.status = "pending"
          } else if (lowerValue.includes("cancel")) {
            mappedData.status = "cancelled"
          } else if (lowerValue.includes("falh") || lowerValue.includes("fail")) {
            mappedData.status = "failed"
          }
        } else {
          ;(mappedData as any)[mapping.systemField] = value
        }
      })

      // Check required fields
      if (!mappedData.description) validationErrors.push("Descrição é obrigatória")
      if (!mappedData.amount) validationErrors.push("Valor é obrigatório")
      if (!mappedData.date) validationErrors.push("Data é obrigatória")

      // Set defaults
      if (!mappedData.type) mappedData.type = "expense"
      if (!mappedData.method) mappedData.method = "bank_transfer"
      if (!mappedData.status) mappedData.status = "completed"

      // Find potential matches with existing payments
      const { matchedPayment, matchScore } = findBestMatch(mappedData, payments)

      return {
        id: `import-${index}`,
        originalRow: row,
        mappedData,
        validationErrors,
        isValid: validationErrors.length === 0,
        matchedPayment,
        matchScore,
        selected: validationErrors.length === 0,
      }
    })

    setParsedTransactions(transactions)
    setIsProcessing(false)
    setStep("preview")
  }, [csvData, columnMappings, payments])

  // Date parsing helper
  const parseDate = (value: string): string | null => {
    if (!value) return null

    // Try common formats
    const formats = [
      /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
      /^(\d{2})\/(\d{2})\/(\d{4})$/, // DD/MM/YYYY
      /^(\d{2})-(\d{2})-(\d{4})$/, // DD-MM-YYYY
    ]

    for (const format of formats) {
      const match = value.match(format)
      if (match) {
        if (format === formats[0]) {
          return value
        } else {
          return `${match[3]}-${match[2]}-${match[1]}`
        }
      }
    }

    // Try native Date parsing
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0]
    }

    return null
  }

  // Find best matching payment
  const findBestMatch = (
    mappedData: Partial<Payment>,
    existingPayments: Payment[],
  ): { matchedPayment?: Payment; matchScore?: number } => {
    if (!mappedData.amount || !mappedData.date) {
      return {}
    }

    let bestMatch: Payment | undefined
    let bestScore = 0

    for (const payment of existingPayments) {
      let score = 0

      // Amount match (exact or close)
      const amountDiff = Math.abs(payment.amount - (mappedData.amount || 0))
      if (amountDiff === 0) {
        score += 50
      } else if (amountDiff < 1) {
        score += 40
      } else if (amountDiff / payment.amount < 0.01) {
        score += 30
      }

      // Date match
      if (payment.date === mappedData.date) {
        score += 30
      } else {
        const dateDiff = Math.abs(new Date(payment.date).getTime() - new Date(mappedData.date || "").getTime())
        const daysDiff = dateDiff / (1000 * 60 * 60 * 24)
        if (daysDiff <= 1) score += 20
        else if (daysDiff <= 3) score += 10
      }

      // Description similarity
      if (mappedData.description && payment.description) {
        const desc1 = mappedData.description.toLowerCase()
        const desc2 = payment.description.toLowerCase()
        if (desc1.includes(desc2) || desc2.includes(desc1)) {
          score += 20
        }
      }

      // Reference match
      if (mappedData.reference && payment.reference) {
        if (mappedData.reference === payment.reference) {
          score += 30
        }
      }

      if (score > bestScore && score >= 50) {
        bestScore = score
        bestMatch = payment
      }
    }

    return { matchedPayment: bestMatch, matchScore: bestScore }
  }

  // Toggle selection
  const toggleSelection = useCallback((id: string) => {
    setParsedTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t)))
  }, [])

  const toggleAllSelection = useCallback((selected: boolean) => {
    setParsedTransactions((prev) => prev.map((t) => ({ ...t, selected: t.isValid ? selected : false })))
  }, [])

  // Link/unlink payment
  const linkPayment = useCallback((transactionId: string, payment: Payment | undefined) => {
    setParsedTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              matchedPayment: payment,
              matchScore: payment ? 100 : undefined,
            }
          : t,
      ),
    )
  }, [])

  // Import transactions
  const handleImport = useCallback(async () => {
    setIsProcessing(true)
    setStep("confirm")

    const selectedTransactions = parsedTransactions.filter((t) => t.selected && t.isValid && !t.matchedPayment)
    const total = selectedTransactions.length

    for (let i = 0; i < selectedTransactions.length; i++) {
      const transaction = selectedTransactions[i]

      try {
        createPayment({
          amount: transaction.mappedData.amount!,
          date: transaction.mappedData.date!,
          description: transaction.mappedData.description || "Imported transaction",
          method: transaction.mappedData.method || "bank_transfer",
          status: transaction.mappedData.status || "completed",
          type: transaction.mappedData.type || "expense",
          reference: transaction.mappedData.reference,
        })
      } catch (error) {
        console.error("Error importing transaction:", error)
      }

      setImportProgress(((i + 1) / total) * 100)
      // Small delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    setIsProcessing(false)
  }, [parsedTransactions, createPayment])

  // Filtered transactions for display
  const filteredTransactions = useMemo(() => {
    return parsedTransactions.filter((t) => {
      if (showOnlyMatches && !t.matchedPayment) return false
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          t.mappedData.description?.toLowerCase().includes(search) ||
          t.mappedData.reference?.toLowerCase().includes(search) ||
          String(t.mappedData.amount).includes(search)
        )
      }
      return true
    })
  }, [parsedTransactions, searchTerm, showOnlyMatches])

  // Stats
  const stats = useMemo(() => {
    const valid = parsedTransactions.filter((t) => t.isValid)
    const selected = parsedTransactions.filter((t) => t.selected)
    const matched = parsedTransactions.filter((t) => t.matchedPayment)
    const toImport = parsedTransactions.filter((t) => t.selected && t.isValid && !t.matchedPayment)

    return {
      total: parsedTransactions.length,
      valid: valid.length,
      invalid: parsedTransactions.length - valid.length,
      selected: selected.length,
      matched: matched.length,
      toImport: toImport.length,
    }
  }, [parsedTransactions])

  // Steps configuration
  const steps: { key: ImportStep; label: string; icon: React.ReactNode }[] = [
    { key: "upload", label: "Upload", icon: <Upload className="h-4 w-4" /> },
    { key: "mapping", label: "Mapeamento", icon: <Link2 className="h-4 w-4" /> },
    { key: "preview", label: "Preview", icon: <FileText className="h-4 w-4" /> },
    { key: "reconciliation", label: "Reconciliação", icon: <RefreshCw className="h-4 w-4" /> },
    { key: "confirm", label: "Confirmar", icon: <Check className="h-4 w-4" /> },
  ]

  const currentStepIndex = steps.findIndex((s) => s.key === step)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Transações via CSV
          </DialogTitle>
          <DialogDescription>
            Importe faturas ou movimentações bancárias de um arquivo CSV e vincule com pagamentos existentes.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between py-4 border-b">
          {steps.map((s, index) => (
            <div key={s.key} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                  index === currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : index < currentStepIndex
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {index < currentStepIndex ? <Check className="h-4 w-4" /> : s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {index < steps.length - 1 && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Step 1: Upload */}
          {step === "upload" && (
            <div className="p-6 space-y-6">
              {/* Import Type Selection */}
              <div className="space-y-2">
                <Label>Tipo de importação</Label>
                <Tabs value={importType} onValueChange={(v) => setImportType(v as ImportType)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="payments">Pagamentos / Movimentações</TabsTrigger>
                    <TabsTrigger value="invoices">Faturas</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Upload Area */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer",
                  dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("csv-upload")?.click()}
              >
                <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Arraste e solte seu arquivo CSV aqui</h3>
                <p className="text-sm text-muted-foreground mb-4">ou clique para selecionar um arquivo</p>
                <Button variant="outline" type="button">
                  Selecionar arquivo
                </Button>
              </div>

              {/* Instructions */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Dicas para importação</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>O arquivo deve estar no formato CSV (separado por vírgula ou ponto-e-vírgula)</li>
                    <li>A primeira linha deve conter os cabeçalhos das colunas</li>
                    <li>Datas devem estar no formato DD/MM/AAAA ou AAAA-MM-DD</li>
                    <li>Valores podem ter vírgula ou ponto como separador decimal</li>
                    <li>Valores negativos serão automaticamente marcados como despesas</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Sample Download */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Precisa de um modelo?</p>
                  <p className="text-sm text-muted-foreground">Baixe nosso template CSV para facilitar a importação</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar template
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Column Mapping */}
          {step === "mapping" && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Mapeamento de Colunas</h3>
                  <p className="text-sm text-muted-foreground">Associe as colunas do seu CSV aos campos do sistema</p>
                </div>
                <Badge variant="outline">{csvData.length} registros encontrados</Badge>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Coluna do CSV</TableHead>
                        <TableHead>Amostra</TableHead>
                        <TableHead>Campo do Sistema</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {columnMappings.map((mapping) => (
                        <TableRow key={mapping.csvColumn}>
                          <TableCell className="font-medium">{mapping.csvColumn}</TableCell>
                          <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                            {csvData[0]?.[mapping.csvColumn] || "-"}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={mapping.systemField}
                              onValueChange={(value) => updateMapping(mapping.csvColumn, value)}
                            >
                              <SelectTrigger className="w-[200px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {fields.map((field) => (
                                  <SelectItem key={field.value} value={field.value}>
                                    {field.label}
                                    {field.required && " *"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Preview */}
              <div className="space-y-2">
                <h4 className="font-medium">Prévia dos dados (primeiras 3 linhas)</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {headers.map((header) => (
                          <TableHead key={header} className="whitespace-nowrap">
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.slice(0, 3).map((row, index) => (
                        <TableRow key={index}>
                          {headers.map((header) => (
                            <TableCell key={header} className="whitespace-nowrap">
                              {row[header]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === "preview" && (
            <div className="flex flex-col h-full">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 p-4 border-b">
                <Card>
                  <CardContent className="p-3">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="text-2xl font-bold text-green-600">{stats.valid}</div>
                    <div className="text-xs text-muted-foreground">Válidos</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="text-2xl font-bold text-red-600">{stats.invalid}</div>
                    <div className="text-xs text-muted-foreground">Com erros</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="text-2xl font-bold text-blue-600">{stats.selected}</div>
                    <div className="text-xs text-muted-foreground">Selecionados</div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 p-4 border-b">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar transações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={stats.selected === stats.valid}
                    onCheckedChange={(checked) => toggleAllSelection(checked as boolean)}
                  />
                  <Label htmlFor="select-all" className="text-sm cursor-pointer">
                    Selecionar todos
                  </Label>
                </div>
              </div>

              {/* Transactions Table */}
              <ScrollArea className="flex-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className={cn(!transaction.isValid && "bg-red-50 dark:bg-red-950/20")}
                      >
                        <TableCell>
                          <Checkbox
                            checked={transaction.selected}
                            disabled={!transaction.isValid}
                            onCheckedChange={() => toggleSelection(transaction.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">{transaction.mappedData.description || "-"}</span>
                            {transaction.validationErrors.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {transaction.validationErrors.map((error, i) => (
                                  <Badge key={i} variant="destructive" className="text-xs">
                                    {error}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {transaction.mappedData.date ? formatDate(transaction.mappedData.date) : "-"}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "font-medium",
                            transaction.mappedData.type === "income" ? "text-green-600" : "text-red-600",
                          )}
                        >
                          {transaction.mappedData.type === "income" ? "+" : "-"}
                          {transaction.mappedData.amount ? formatCurrency(transaction.mappedData.amount) : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.mappedData.type === "income" ? "default" : "secondary"}>
                            {transaction.mappedData.type === "income" ? "Receita" : "Despesa"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.isValid ? (
                            <Badge variant="outline" className="text-green-600">
                              <Check className="h-3 w-3 mr-1" />
                              Válido
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <X className="h-3 w-3 mr-1" />
                              Erro
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}

          {/* Step 4: Reconciliation */}
          {step === "reconciliation" && (
            <div className="flex flex-col h-full">
              {/* Info */}
              <Alert className="m-4">
                <Link2 className="h-4 w-4" />
                <AlertTitle>Reconciliação de Pagamentos</AlertTitle>
                <AlertDescription>
                  Encontramos {stats.matched} possíveis correspondências com pagamentos já existentes. Revise e confirme
                  as vinculações antes de importar.
                </AlertDescription>
              </Alert>

              {/* Filter */}
              <div className="flex items-center gap-4 px-4 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="show-matches"
                    checked={showOnlyMatches}
                    onCheckedChange={(checked) => setShowOnlyMatches(checked as boolean)}
                  />
                  <Label htmlFor="show-matches" className="text-sm cursor-pointer">
                    Mostrar apenas correspondências
                  </Label>
                </div>
                <Badge variant="outline">{stats.matched} correspondências encontradas</Badge>
              </div>

              {/* Reconciliation Table */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {filteredTransactions
                    .filter((t) => t.isValid)
                    .map((transaction) => (
                      <Card
                        key={transaction.id}
                        className={cn(
                          transaction.matchedPayment &&
                            "border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20",
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {/* Imported Transaction */}
                            <div className="flex-1">
                              <div className="text-xs text-muted-foreground mb-1">Transação importada</div>
                              <div className="font-medium">{transaction.mappedData.description}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(transaction.mappedData.date || "")} •{" "}
                                <span
                                  className={
                                    transaction.mappedData.type === "income" ? "text-green-600" : "text-red-600"
                                  }
                                >
                                  {formatCurrency(transaction.mappedData.amount || 0)}
                                </span>
                              </div>
                            </div>

                            {/* Arrow / Link Status */}
                            <div className="flex items-center justify-center w-16">
                              {transaction.matchedPayment ? (
                                <div className="flex flex-col items-center">
                                  <Link2 className="h-5 w-5 text-blue-600" />
                                  <span className="text-xs text-blue-600 mt-1">{transaction.matchScore}%</span>
                                </div>
                              ) : (
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>

                            {/* Matched Payment or New */}
                            <div className="flex-1">
                              {transaction.matchedPayment ? (
                                <>
                                  <div className="text-xs text-muted-foreground mb-1">Pagamento existente</div>
                                  <div className="font-medium">{transaction.matchedPayment.description}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {formatDate(transaction.matchedPayment.date)} •{" "}
                                    <span
                                      className={
                                        transaction.matchedPayment.type === "income" ? "text-green-600" : "text-red-600"
                                      }
                                    >
                                      {formatCurrency(transaction.matchedPayment.amount)}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <div className="text-muted-foreground text-sm">Será criado como novo pagamento</div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              {transaction.matchedPayment ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => linkPayment(transaction.id, undefined)}
                                >
                                  <Unlink className="h-4 w-4 mr-1" />
                                  Desvincular
                                </Button>
                              ) : (
                                <Select
                                  onValueChange={(paymentId) => {
                                    const payment = payments.find((p) => p.id === paymentId)
                                    linkPayment(transaction.id, payment)
                                  }}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Vincular a..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {payments.map((payment) => (
                                      <SelectItem key={payment.id} value={payment.id}>
                                        {payment.description} - {formatCurrency(payment.amount)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Step 5: Confirm */}
          {step === "confirm" && (
            <div className="p-6 space-y-6">
              {isProcessing ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Importando transações...</h3>
                  <Progress value={importProgress} className="w-64 mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">{Math.round(importProgress)}% concluído</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Importação concluída!</h3>
                  <p className="text-muted-foreground mb-6">
                    {stats.toImport} transações foram importadas com sucesso.
                    {stats.matched > 0 && <> {stats.matched} transações foram vinculadas a pagamentos existentes.</>}
                  </p>
                  <Button onClick={() => handleOpenChange(false)}>Fechar</Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step !== "confirm" && (
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                if (step === "upload") {
                  handleOpenChange(false)
                } else {
                  const prevIndex = currentStepIndex - 1
                  if (prevIndex >= 0) {
                    setStep(steps[prevIndex].key)
                  }
                }
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {step === "upload" ? "Cancelar" : "Voltar"}
            </Button>

            <div className="flex items-center gap-2">
              {step === "preview" && (
                <div className="text-sm text-muted-foreground mr-4">{stats.toImport} transações serão importadas</div>
              )}

              {step === "mapping" && (
                <Button onClick={processTransactions} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Processar dados
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}

              {step === "preview" && (
                <Button onClick={() => setStep("reconciliation")}>
                  Reconciliar
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}

              {step === "reconciliation" && (
                <Button onClick={handleImport} disabled={stats.toImport === 0}>
                  Importar {stats.toImport} transações
                  <Check className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
