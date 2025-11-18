import { PPNBM_RATES } from './constants'
import type { TaxResult } from './types'

export type PpnbmGoods =
  | 'kendaraanMewah'
  | 'perhiasan'
  | 'kapalPesiar'
  | 'elektronikPremium'

export interface PpnbmInput {
  goodsType: PpnbmGoods
  dppPpn: number
  customRate?: number
}

export function calculatePpnbm({
  goodsType,
  dppPpn,
  customRate,
}: PpnbmInput): TaxResult {
  const rate =
    customRate && customRate > 0
      ? customRate / 100
      : PPNBM_RATES[goodsType]
  const tax = dppPpn * rate

  return {
    totalTax: tax,
    breakdown: [
      { label: 'Dasar Pengenaan', variant: 'section' },
      { label: 'DPP PPNBM', value: dppPpn },
      { label: 'Tarif PPNBM', value: rate, valueType: 'percent' },
      { label: 'PPNBM terutang', value: tax, variant: 'total' },
    ],
  }
}
