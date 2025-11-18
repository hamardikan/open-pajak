const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
})

export function formatCurrency(value: number) {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 'Rp0'
  return currency.format(Math.round(value))
}
