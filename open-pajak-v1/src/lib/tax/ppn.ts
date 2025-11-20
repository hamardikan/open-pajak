import { PPN_RATES_PER_YEAR } from './constants'
import type { TaxResult } from './types'
import i18n from '../../i18n/config'

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
  const t = (key: string, fallback: string, options?: Record<string, unknown>) =>
    i18n.t(key, { defaultValue: fallback, ...options })
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
      { label: t('ppnCalc.breakdown.baseSection', 'Dasar Pengenaan'), variant: 'section' },
      {
        label: t('ppnCalc.breakdown.dpp', 'DPP'),
        value: dpp,
        note: includePpn
          ? t('ppnCalc.notes.dppInclusive', 'harga termasuk PPN')
          : t('ppnCalc.notes.dppExclusive', 'harga sebelum PPN'),
        variant: 'subtotal',
      },
      { label: t('ppnCalc.breakdown.taxSection', 'Perhitungan PPN'), variant: 'section' },
      { label: t('ppnCalc.breakdown.rate', 'Tarif PPN'), value: rate, valueType: 'percent' },
      { label: t('ppnCalc.breakdown.tax', 'PPN terutang'), value: ppn },
      { label: t('ppnCalc.breakdown.total', 'Total tagihan'), value: dpp + ppn, variant: 'total' },
    ],
  }
}
