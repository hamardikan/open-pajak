import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TaxPageLayout } from '../components/TaxPageLayout'
import { TaxFormSection } from '../components/TaxFormSection'
import { TaxSummaryCard } from '../components/TaxSummaryCard'
import { TaxResultTable } from '../components/TaxResultTable'
import { FormulaExplanationCard } from '../components/FormulaExplanationCard'
import { InfoAlert } from '../components/InfoAlert'
import { Select } from '../components/ui/select'
import { NumberInput } from '../components/ui/number-input'
import { Input } from '../components/ui/input'
import { FormField } from '../components/FormField'
import { calculatePpn } from '../lib/tax/ppn'
import { Button } from '../components/ui/button'

type PpnFormState = {
  taxYear: string
  basePrice: number | null
  discount: number | null
  otherCosts: number | null
  customRate: number
  includePpn: boolean
}

const sampleForm = (): PpnFormState => ({
  taxYear: '2024',
  basePrice: 110000000,
  discount: 0,
  otherCosts: 0,
  customRate: 0,
  includePpn: false,
})

const emptyForm = (): PpnFormState => ({
  taxYear: '2024',
  basePrice: null,
  discount: null,
  otherCosts: null,
  customRate: 0,
  includePpn: false,
})

export const Route = createFileRoute('/ppn')({
  component: PpnPage,
})

function PpnPage() {
  const [form, setForm] = useState<PpnFormState>(sampleForm)

  const normalizedForm = useMemo(
    () => ({
      ...form,
      basePrice: form.basePrice ?? 0,
      discount: form.discount ?? 0,
      otherCosts: form.otherCosts ?? 0,
    }),
    [form],
  )

  const result = useMemo(() => calculatePpn(normalizedForm), [normalizedForm])

  return (
    <TaxPageLayout
      title="Kalkulator PPN"
      description="Hitung DPP dan PPN untuk transaksi termasuk maupun belum termasuk PPN. Cocok untuk memeriksa faktur pajak dan e-invoice."
      form={
        <TaxFormSection
          title="Data transaksi"
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
            <FormField label="Tahun pajak" htmlFor="taxYear">
              <Select
                id="taxYear"
                value={form.taxYear}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, taxYear: event.target.value }))
                }
              >
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </Select>
            </FormField>
            <FormField
              label="Harga jual"
              htmlFor="basePrice"
              description="Isi harga termasuk PPN jika mode di bawah diaktifkan."
            >
              <NumberInput
                id="basePrice"
                value={form.basePrice}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, basePrice: value }))
                }
              />
            </FormField>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Diskon (-)" htmlFor="discount">
              <NumberInput
                id="discount"
                value={form.discount}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, discount: value }))
                }
              />
            </FormField>
            <FormField label="Biaya lain (+)" htmlFor="otherCosts">
              <NumberInput
                id="otherCosts"
                value={form.otherCosts}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, otherCosts: value }))
                }
              />
            </FormField>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Tarif khusus (opsional)"
              htmlFor="customRate"
              description="Dalam persen."
            >
              <Input
                id="customRate"
                type="number"
                min={0}
                max={100}
                value={form.customRate}
                onChange={(event) =>
                  onNumberChange('customRate', event.target.value)
                }
              />
            </FormField>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#0f1e3d]/15 bg-[#0f1e3d]/5 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#0f1e3d]">
                Harga sudah termasuk PPN?
              </p>
              <p className="text-xs text-[#0f1e3d]/70">
                Aktifkan untuk memecah nilai menjadi DPP + PPN.
              </p>
            </div>
            <Button
              variant={form.includePpn ? 'accent' : 'outline'}
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  includePpn: !prev.includePpn,
                }))
              }
            >
              {form.includePpn ? 'Ya, termasuk' : 'Belum termasuk'}
            </Button>
          </div>
        </TaxFormSection>
      }
      summary={
        <TaxSummaryCard
          total={result.totalTax}
          label="PPN terutang"
          meta={form.includePpn ? 'Harga sudah termasuk PPN' : 'Harga belum termasuk PPN'}
        />
      }
      result={<TaxResultTable breakdown={result.breakdown} />}
      explanation={
        <FormulaExplanationCard
          title="Formula DPP"
          steps={[
            'Jika harga belum termasuk PPN: DPP = Harga jual - diskon + biaya lain.',
            'Jika harga sudah termasuk PPN: DPP = Harga / (1 + tarif).',
            'PPN = DPP × tarif; total tagihan = DPP + PPN.',
          ]}
        />
      }
      info={
        <InfoAlert
          title="Praktik baik"
          items={[
            'Pastikan diskon sudah dikurangi dari DPP.',
            'Gunakan tarif khusus bila mendapat fasilitas PMK terkait.',
            'Simpan nomor faktur pajak untuk audit trail.',
          ]}
        />
      }
    />
  )
}
