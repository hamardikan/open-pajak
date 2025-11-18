import { PPH23_RATES } from './constants'
import type { TaxResult } from './types'

export type PPh23ServiceType =
  | 'jasaTeknik'
  | 'jasaKonsultan'
  | 'sewaAlat'
  | 'dividen'
  | 'bunga'

export interface PPh23Input {
  serviceType: PPh23ServiceType
  grossAmount: number
  isFinal: boolean
}

export function calculatePph23({
  serviceType,
  grossAmount,
  isFinal,
}: PPh23Input): TaxResult {
  const dpp = Math.max(0, grossAmount)
  const rate = PPH23_RATES[serviceType]
  const totalTax = dpp * rate
  return {
    totalTax,
    breakdown: [
      { label: 'Penghasilan Bruto', variant: 'section' },
      { label: 'Jumlah bruto', value: dpp },
      { label: 'Tarif PPh 23', value: rate, valueType: 'percent' },
      {
        label: 'PPh 23 dipotong',
        value: totalTax,
        note: isFinal ? 'Final (selesai di pemotong)' : 'Dapat dikreditkan',
        variant: 'total',
      },
    ],
  }
}
