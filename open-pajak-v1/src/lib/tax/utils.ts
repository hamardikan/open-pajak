import {
  PASAL17_LAYERS,
  PTKP_TABLE,
  TER_BULANAN_TABLE,
  TER_HARIAN_TABLE,
} from './constants'

export function getPTKP(status: string) {
  return PTKP_TABLE[status] ?? PTKP_TABLE['TK/0']
}

export function roundDown(value: number) {
  return Math.max(0, Math.floor(value))
}

export function roundDownToThousand(value: number) {
  return Math.max(0, Math.floor(value / 1000) * 1000)
}

export function hitungPajakPasal17(pkp: number) {
  let remaining = pkp
  let tax = 0
  for (const layer of PASAL17_LAYERS) {
    if (remaining <= 0) break
    const taxable = Math.min(remaining, layer.limit)
    tax += taxable * layer.rate
    remaining -= taxable
  }
  return tax
}

export function getTerBulananRate(
  kategori: string,
  brutoBulanan: number,
) {
  const table = TER_BULANAN_TABLE[kategori] ?? TER_BULANAN_TABLE.A
  const fallbackRate = table.at(-1)?.rate ?? 0.05
  const found = table.find((row) => brutoBulanan <= row.ceiling)
  return found ? found.rate : fallbackRate
}

export function getTerHarianRate(kategori: string, bruto: number) {
  const table = TER_HARIAN_TABLE[kategori] ?? TER_HARIAN_TABLE.A
  const fallbackRate = table.at(-1)?.rate ?? 0.02
  const found = table.find((row) => bruto <= row.ceiling)
  return found ? found.rate : fallbackRate
}
