import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { FormField } from '../components/FormField'
import { FormulaExplanationCard } from '../components/FormulaExplanationCard'
import { InfoAlert } from '../components/InfoAlert'
import { TaxFormSection } from '../components/TaxFormSection'
import { TaxPageLayout } from '../components/TaxPageLayout'
import { TaxResultTable } from '../components/TaxResultTable'
import { TaxSummaryCard } from '../components/TaxSummaryCard'
import { Button } from '../components/ui/button'
import { NumberInput } from '../components/ui/number-input'
import { Select } from '../components/ui/select'
import { calculatePph4 } from '../lib/tax/pph4_2'
import type { PPh4Objek } from '../lib/tax/pph4_2'

export const Route = createFileRoute('/pph4-2')({
  component: Pph4Page,
})

type Pph4FormState = {
  objectType: PPh4Objek
  grossAmount: number | null
}

const sampleForm = (): Pph4FormState => ({
  objectType: 'sewaTanah',
  grossAmount: 100000000,
})

const emptyForm = (): Pph4FormState => ({
  objectType: 'sewaTanah',
  grossAmount: null,
})

function Pph4Page() {
  const [form, setForm] = useState<Pph4FormState>(sampleForm)

  const normalizedForm = useMemo(
    () => ({
      ...form,
      grossAmount: form.grossAmount ?? 0,
    }),
    [form],
  )

  const result = useMemo(() => calculatePph4(normalizedForm), [normalizedForm])

  return (
    <TaxPageLayout
      title="Kalkulator PPh Final Pasal 4 ayat (2)"
      description="Simulasi pemotongan final untuk sewa tanah/bangunan, jasa konstruksi, usaha restoran, dan UMKM final per PP 55/2022."
      form={
        <TaxFormSection
          title="Data objek final"
          actions={
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setForm(emptyForm())}>
                Kosongkan Form
              </Button>
              <Button variant="ghost" onClick={() => setForm(sampleForm())}>
                Gunakan Contoh
              </Button>
            </div>
          }
        >
          <FormField label="Jenis objek" htmlFor="objectType">
            <Select
              id="objectType"
              value={form.objectType}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  objectType: event.target.value as PPh4Objek,
                }))
              }
            >
              <option value="sewaTanah">Sewa tanah/bangunan (10%)</option>
              <option value="konstruksi">Jasa konstruksi (3.5%)</option>
              <option value="restoran">Usaha restoran (5%)</option>
              <option value="umkmFinal">UMKM PP 55/2022 (0.5%)</option>
            </Select>
          </FormField>

          <FormField
            label="Nilai bruto"
            htmlFor="grossAmount"
            description="Isi sesuai nilai kontrak/omzet."
          >
            <NumberInput
              id="grossAmount"
              value={form.grossAmount}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, grossAmount: value }))
              }
            />
          </FormField>
        </TaxFormSection>
      }
      summary={
        <TaxSummaryCard
          total={result.totalTax}
          label="PPh Final dipotong"
          meta="Tarif otomatis mengikuti jenis objek."
        />
      }
      result={<TaxResultTable breakdown={result.breakdown} />}
      explanation={
        <FormulaExplanationCard
          title="Langkah hitung"
          steps={[
            'Dasar Pengenaan Pajak (DPP) = Nilai bruto sesuai objek.',
            'Tarif final mengikuti pasal khusus (PP 34/2017 & PP 55/2022).',
            'PPh Final = DPP × tarif.',
          ]}
        />
      }
      info={
        <InfoAlert
          title="Catatan"
          items={[
            'Penarikan bersifat final, tidak dapat dikreditkan di SPT Tahunan.',
            'Jasa konstruksi memiliki tarif berbeda jika kualifikasi perusahaan berubah.',
            'UMKM final mengikuti batas omzet Rp 500 juta/tahun.',
          ]}
        />
      }
    />
  )
}
