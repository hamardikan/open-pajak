export type TaxBreakdownRow = {
  label: string
  value?: number | string
  valueType?: 'currency' | 'percent' | 'text'
  note?: string
  variant?: 'section' | 'subtotal' | 'total' | 'group' | 'spacer'
}

export type TaxResult = {
  totalTax: number
  breakdown: Array<TaxBreakdownRow>
}
