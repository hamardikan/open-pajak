import i18n from '../i18n/config'

export function formatCurrency(value: number) {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 'Rp0'
  const locale = i18n.language || 'id'
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  })
  return formatter.format(Math.round(value))
}

export function formatPercent(value: number) {
  const locale = i18n.language || 'id'
  const formatter = new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return formatter.format(value)
}
