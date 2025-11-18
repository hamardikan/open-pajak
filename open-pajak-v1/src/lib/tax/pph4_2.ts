import { PPH4_2_RATES } from './constants'
import type { TaxResult } from './types'

export type PPh4Objek =
  | 'sewaTanah'
  | 'konstruksi'
  | 'restoran'
  | 'umkmFinal'

export interface PPh4Input {
  objectType: PPh4Objek
  grossAmount: number
}

export function calculatePph4({
  objectType,
  grossAmount,
}: PPh4Input): TaxResult {
  const dpp = Math.max(0, grossAmount)
  const rate = PPH4_2_RATES[objectType]
  const totalTax = dpp * rate

  return {
    totalTax,
    breakdown: [
      { label: 'Dasar Pengenaan', variant: 'section' },
      { label: 'Nilai objek', value: dpp },
      { label: 'Tarif final', value: rate, valueType: 'percent' },
      { label: 'PPh Final 4(2)', value: totalTax, variant: 'total' },
    ],
  }
}
