import { PPNBM_RATES } from './constants'
import type { TaxResult } from './types'
import i18n from '../../i18n/config'

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
  const t = (key: string, fallback: string) =>
    i18n.t(key, { defaultValue: fallback })
  const rate =
    customRate && customRate > 0
      ? customRate / 100
      : PPNBM_RATES[goodsType]
  const tax = dppPpn * rate

  return {
    totalTax: tax,
    breakdown: [
      { label: t('ppnbmCalc.breakdown.section', 'Dasar Pengenaan'), variant: 'section' },
      { label: t('ppnbmCalc.breakdown.dpp', 'DPP PPNBM'), value: dppPpn },
      { label: t('ppnbmCalc.breakdown.rate', 'Tarif PPNBM'), value: rate, valueType: 'percent' },
      { label: t('ppnbmCalc.breakdown.tax', 'PPNBM terutang'), value: tax, variant: 'total' },
    ],
  }
}
