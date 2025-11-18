import { PPN_RATES_PER_YEAR } from './constants'
import type { TaxResult } from './types'

export interface PpnInput {
  taxYear: string
  basePrice: number
  discount: number
  otherCosts: number
  customRate?: number
  includePpn: boolean
}

export function calculatePpn({
  taxYear,
  basePrice,
  discount,
  otherCosts,
  customRate,
  includePpn,
}: PpnInput): TaxResult {
  const rate =
    customRate && customRate > 0
      ? customRate / 100
      : PPN_RATES_PER_YEAR[taxYear] ?? 0.11

  let dpp: number
  let ppn: number
  if (includePpn) {
    dpp = (basePrice - discount + otherCosts) / (1 + rate)
    ppn = basePrice - discount + otherCosts - dpp
  } else {
    dpp = Math.max(0, basePrice - discount + otherCosts)
    ppn = dpp * rate
  }

  return {
    totalTax: ppn,
    breakdown: [
      { label: 'Dasar Pengenaan', variant: 'section' },
      {
        label: 'DPP',
        value: dpp,
        note: includePpn ? 'harga termasuk PPN' : 'harga sebelum PPN',
        variant: 'subtotal',
      },
      { label: 'Perhitungan PPN', variant: 'section' },
      { label: 'Tarif PPN', value: rate, valueType: 'percent' },
      { label: 'PPN terutang', value: ppn },
      { label: 'Total tagihan', value: dpp + ppn, variant: 'total' },
    ],
  }
}
