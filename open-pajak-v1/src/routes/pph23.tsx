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
import { calculatePph23 } from '../lib/tax/pph23'
import type { PPh23ServiceType } from '../lib/tax/pph23'

export const Route = createFileRoute('/pph23')({
  component: Pph23Page,
})

type Pph23FormState = {
  serviceType: PPh23ServiceType
  grossAmount: number | null
  isFinal: boolean
}

const sampleForm = (): Pph23FormState => ({
  serviceType: 'jasaTeknik',
  grossAmount: 250000000,
  isFinal: false,
})

const emptyForm = (): Pph23FormState => ({
  serviceType: 'jasaTeknik',
  grossAmount: null,
  isFinal: false,
})

function Pph23Page() {
  const [form, setForm] = useState<Pph23FormState>(sampleForm)

  const normalizedForm = useMemo(
    () => ({
      ...form,
      grossAmount: form.grossAmount ?? 0,
    }),
    [form],
  )

  const result = useMemo(() => calculatePph23(normalizedForm), [normalizedForm])

  return (
    <TaxPageLayout
      title="Kalkulator PPh 23"
      description="Hitung PPh 23 untuk jasa, sewa, dividen, dan bunga dengan tarif 2–15%. Gunakan untuk memastikan potongan faktur atau bukti potong."
      form={
        <TaxFormSection
          title="Detil Transaksi"
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
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Jenis penghasilan" htmlFor="serviceType">
              <Select
                id="serviceType"
                value={form.serviceType}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    serviceType: event.target.value as PPh23ServiceType,
                  }))
                }
              >
                <option value="jasaTeknik">Jasa teknik</option>
                <option value="jasaKonsultan">Jasa konsultan</option>
                <option value="sewaAlat">Sewa alat</option>
                <option value="dividen">Dividen</option>
                <option value="bunga">Bunga</option>
              </Select>
            </FormField>

            <FormField
              label="Final?"
              htmlFor="isFinal"
              description="Beberapa objek (dividen, bunga) bersifat final."
            >
              <Select
                id="isFinal"
                value={form.isFinal ? 'ya' : 'tidak'}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    isFinal: event.target.value === 'ya',
                  }))
                }
              >
                <option value="tidak">Tidak</option>
                <option value="ya">Ya</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Nilai bruto (tanpa PPN)" htmlFor="grossAmount">
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
          label="PPh 23 dipotong"
          meta="Gunakan sebagai kredit pajak penghasilan."
        />
      }
      result={<TaxResultTable breakdown={result.breakdown} />}
      explanation={
        <FormulaExplanationCard
          title="Formula"
          steps={[
            'DPP untuk PPh 23 = jumlah bruto tanpa PPN.',
            'Tarif mengikuti Pasal 23 (2% jasa, 4% konsultan, 15% dividen/bunga).',
            'PPh 23 dipotong = DPP × tarif.',
          ]}
        />
      }
      info={
        <InfoAlert
          title="Dokumen pendukung"
          items={[
            'Faktur/invoice jasa atau sewa.',
            'Bukti potong resmi untuk kredit pajak.',
            'Kontrak kerja sama atau SPK.',
          ]}
        />
      }
    />
  )
}
