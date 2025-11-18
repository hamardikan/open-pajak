import { PPH22_RATES } from './constants'
import type { TaxResult } from './types'

export type PPh22TransactionType =
  | 'impor'
  | 'migas'
  | 'bumn'
  | 'lainnya'

export interface PPh22Input {
  transactionType: PPh22TransactionType
  transactionValue: number
  otherCosts: number
  deduction: number
}

export function calculatePph22({
  transactionType,
  transactionValue,
  otherCosts,
  deduction,
}: PPh22Input): TaxResult {
  const dpp = Math.max(0, transactionValue + otherCosts - deduction)
  const rate = PPH22_RATES[transactionType]
  const totalTax = dpp * rate

  return {
    totalTax,
    breakdown: [
      { label: 'Dasar Pengenaan', variant: 'section' },
      { label: 'Nilai transaksi', value: transactionValue },
      { label: 'Penyesuaian biaya', value: otherCosts, note: '+ biaya lain' },
      { label: 'Pengurang', value: deduction, note: '- potongan' },
      { label: 'Dasar pungut (DPP)', value: dpp, variant: 'subtotal' },
      { label: 'Pajak Terutang', variant: 'section' },
      { label: 'Tarif PPh 22', value: rate, valueType: 'percent' },
      { label: 'PPh 22 dipungut', value: totalTax, variant: 'total' },
    ],
  }
}
