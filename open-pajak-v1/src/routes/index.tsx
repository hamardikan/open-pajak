import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRightIcon, Calculator, ShieldCheck, Sparkles } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { FormulaSourceNote } from '../components/FormulaSourceNote'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const calculators: Array<{
  to: string
  title: string
  description: string
}> = [
  {
    to: '/pph21',
    title: 'PPh 21/26',
    description: 'Pegawai tetap, tidak tetap, bukan pegawai, hingga WPLN.',
  },
  {
    to: '/pph22',
    title: 'PPh 22',
    description: 'Impor, migas, BUMN, dan transaksi tertentu.',
  },
  {
    to: '/pph23',
    title: 'PPh 23',
    description: 'Jasa teknik, konsultan, sewa alat, dividen, bunga.',
  },
  {
    to: '/pph4-2',
    title: 'PPh Final 4(2)',
    description: 'Sewa tanah, konstruksi, restoran, UMKM final.',
  },
  {
    to: '/ppn',
    title: 'PPN',
    description: 'DPP otomatis untuk harga termasuk/di luar PPN.',
  },
  {
    to: '/ppnbm',
    title: 'PPNBM',
    description: 'Barang mewah kendaraan, perhiasan, elektronik.',
  },
]

function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-[32px] bg-white/80 p-8 shadow-xl shadow-[#0f1e3d]/5 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f5a524]">
            Open Pajak
          </p>
          <h1 className="text-4xl font-bold text-[#0f1e3d]">
            Kalkulator pajak Indonesia serba ada.
          </h1>
          <p className="text-[#0f1e3d]/70 text-lg">
            Semua perhitungan berjalan sepenuhnya di browser Anda. Tidak ada data
            pribadi, tidak ada backend. Cocok untuk simulasi cepat maupun review
            kewajiban pajak sebelum lapor.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="accent">
              <Link to="/pph21">
                Mulai hitung <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/ppn">PPN Cepat</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <Highlight
            icon={<Calculator className="size-6" />}
            title="6 kalkulator utama"
            description="PPh 21/26, 22, 23, Final 4(2), PPN, dan PPNBM mengikuti desain dan formula DJP terbaru."
          />
          <Highlight
            icon={<ShieldCheck className="size-6" />}
            title="Privasi terjaga"
            description="Tidak ada input NIK, nama, atau alamat. Hanya angka dan jenis transaksi."
          />
          <Highlight
            icon={<Sparkles className="size-6" />}
            title="Formula transparan"
            description="Setiap hasil disertai tabel langkah hitung dan referensi rumus."
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#0f1e3d]">
              Pilih kalkulator
            </h2>
            <p className="text-sm text-[#0f1e3d]/70">
              Setiap halaman memiliki form input, tabel hasil, dan catatan rumus.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {calculators.map((calc) => (
            <Card key={calc.to} className="p-0">
              <CardContent className="p-6 space-y-3">
                <p className="text-sm font-semibold text-[#f5a524]">
                  Kalkulator Pajak
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#0f1e3d]">
                      {calc.title}
                    </h3>
                    <p className="text-sm text-[#0f1e3d]/70">
                      {calc.description}
                    </p>
                  </div>
                  <Button asChild variant="accent" size="icon">
                    <Link to={calc.to}>
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <FormulaSourceNote />
    </div>
  )
}

function Highlight({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4 rounded-3xl border border-[#0f1e3d]/10 bg-[#0f1e3d]/5 p-4 text-[#0f1e3d]">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-[#0f1e3d] shadow-lg">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold">{title}</p>
        <p className="text-sm text-[#0f1e3d]/80">{description}</p>
      </div>
    </div>
  )
}
