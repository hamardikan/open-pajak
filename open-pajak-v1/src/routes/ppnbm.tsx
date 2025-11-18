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
import { Input } from '../components/ui/input'
import { NumberInput } from '../components/ui/number-input'
import { Select } from '../components/ui/select'
import { calculatePpnbm } from '../lib/tax/ppnbm'
import type { PpnbmGoods } from '../lib/tax/ppnbm'

type PpnbmFormState = {
  goodsType: PpnbmGoods
  dppPpn: number | null
  customRate: number
}

const sampleForm = (): PpnbmFormState => ({
  goodsType: 'kendaraanMewah',
  dppPpn: 500000000,
  customRate: 0,
})

const emptyForm = (): PpnbmFormState => ({
  goodsType: 'kendaraanMewah',
  dppPpn: null,
  customRate: 0,
})

export const Route = createFileRoute('/ppnbm')({
  component: PpnbmPage,
})

function PpnbmPage() {
  const [form, setForm] = useState<PpnbmFormState>(sampleForm)

  const normalizedForm = useMemo(
    () => ({
      ...form,
      dppPpn: form.dppPpn ?? 0,
    }),
    [form],
  )

  const result = useMemo(() => calculatePpnbm(normalizedForm), [normalizedForm])

  return (
    <TaxPageLayout
      title="Kalkulator PPNBM"
      description="Perkirakan PPNBM untuk barang mewah (kendaraan, perhiasan, kapal pesiar, elektronik premium)."
      form={
        <TaxFormSection
          title="Detil Barang Kena PPNBM"
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
          <FormField label="Jenis barang mewah" htmlFor="goodsType">
            <Select
              id="goodsType"
              value={form.goodsType}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  goodsType: event.target.value as PpnbmGoods,
                }))
              }
            >
              <option value="kendaraanMewah">Kendaraan mewah</option>
              <option value="perhiasan">Perhiasan/permata</option>
              <option value="kapalPesiar">Kapal pesiar</option>
              <option value="elektronikPremium">Elektronik premium</option>
            </Select>
          </FormField>

          <FormField label="DPP PPN (biasanya harga jual)" htmlFor="dppPpn">
            <NumberInput
              id="dppPpn"
              value={form.dppPpn}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, dppPpn: value }))
              }
            />
          </FormField>

          <FormField
            label="Tarif khusus (opsional)"
            htmlFor="customRate"
            description="Isi bila tarif berbeda dari default."
          >
            <Input
              id="customRate"
              type="number"
              min={0}
              max={100}
              value={form.customRate}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  customRate: Number(event.target.value),
                }))
              }
            />
          </FormField>

          <Button
            variant="outline"
            onClick={() =>
              setForm({
                goodsType: 'kendaraanMewah',
                dppPpn: 500000000,
                customRate: 0,
              })
            }
          >
            Gunakan contoh
          </Button>
        </TaxFormSection>
      }
      summary={
        <TaxSummaryCard
          total={result.totalTax}
          label="PPNBM terutang"
          meta="DPP mengikuti nilai PPN."
        />
      }
      result={<TaxResultTable breakdown={result.breakdown} />}
      explanation={
        <FormulaExplanationCard
          title="Langkah hitung"
          steps={[
            'DPP PPNBM umumnya sama dengan DPP PPN.',
            'Tarif berbeda untuk tiap kelompok barang (PMK 141/PMK.010/2021).',
            'PPNBM = DPP × tarif; ditambahkan pada faktur pajak.',
          ]}
        />
      }
      info={
        <InfoAlert
          title="Ingat"
          items={[
            'PPNBM tidak dapat dikreditkan.',
            'Perhatikan fasilitas pembebasan untuk ekspor atau KITE.',
            'Selalu pisahkan PPN dan PPNBM di dokumen penjualan.',
          ]}
        />
      }
    />
  )
}
