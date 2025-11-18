export const PTKP_TABLE: Record<string, number> = {
  'TK/0': 54000000,
  'TK/1': 58500000,
  'TK/2': 63000000,
  'TK/3': 67500000,
  'K/0': 58500000,
  'K/1': 63000000,
  'K/2': 67500000,
  'K/3': 72000000,
} as const

export const PASAL17_LAYERS: Array<{ limit: number; rate: number }> = [
  { limit: 60000000, rate: 0.05 },
  { limit: 190000000, rate: 0.15 }, // up to 250 jt kumulatif
  { limit: 250000000, rate: 0.25 }, // up to 500 jt kumulatif
  { limit: 4500000000, rate: 0.3 }, // up to 5 Milyar kumulatif
  { limit: Number.POSITIVE_INFINITY, rate: 0.35 },
] as const

export const TER_BULANAN_TABLE: Record<
  string,
  Array<{ ceiling: number; rate: number }>
> = {
  A: [
    { ceiling: 5000000, rate: 0.005 },
    { ceiling: 15000000, rate: 0.05 },
    { ceiling: 40000000, rate: 0.15 },
    { ceiling: Number.POSITIVE_INFINITY, rate: 0.25 },
  ],
  B: [
    { ceiling: 5000000, rate: 0.005 },
    { ceiling: 15000000, rate: 0.05 },
    { ceiling: 40000000, rate: 0.12 },
    { ceiling: Number.POSITIVE_INFINITY, rate: 0.2 },
  ],
  C: [
    { ceiling: 5000000, rate: 0.005 },
    { ceiling: 15000000, rate: 0.04 },
    { ceiling: 40000000, rate: 0.1 },
    { ceiling: Number.POSITIVE_INFINITY, rate: 0.15 },
  ],
}

export const TER_HARIAN_TABLE: Record<
  string,
  Array<{ ceiling: number; rate: number }>
> = {
  A: [
    { ceiling: 750000, rate: 0.0025 },
    { ceiling: 2500000, rate: 0.015 },
    { ceiling: Number.POSITIVE_INFINITY, rate: 0.02 },
  ],
  B: [
    { ceiling: 750000, rate: 0.0025 },
    { ceiling: 2500000, rate: 0.0125 },
    { ceiling: Number.POSITIVE_INFINITY, rate: 0.0175 },
  ],
  C: [
    { ceiling: 750000, rate: 0.0025 },
    { ceiling: 2500000, rate: 0.01 },
    { ceiling: Number.POSITIVE_INFINITY, rate: 0.015 },
  ],
}

export const PPH22_RATES = {
  impor: 0.025,
  migas: 0.02,
  bumn: 0.015,
  lainnya: 0.015,
} as const

export const PPH23_RATES = {
  jasaTeknik: 0.02,
  jasaKonsultan: 0.04,
  sewaAlat: 0.02,
  dividen: 0.15,
  bunga: 0.15,
} as const

export const PPH4_2_RATES = {
  sewaTanah: 0.1,
  konstruksi: 0.035,
  restoran: 0.05,
  umkmFinal: 0.005,
} as const

export const PPN_RATES_PER_YEAR: Record<string, number> = {
  '2022': 0.11,
  '2023': 0.11,
  '2024': 0.11,
  '2025': 0.12,
}

export const PPNBM_RATES = {
  kendaraanMewah: 0.2,
  perhiasan: 0.3,
  kapalPesiar: 0.75,
  elektronikPremium: 0.25,
} as const
