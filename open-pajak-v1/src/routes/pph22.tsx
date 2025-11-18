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
import { calculatePph22 } from '../lib/tax/pph22'
import type { PPh22TransactionType } from '../lib/tax/pph22'

type Pph22FormState = {
  transactionType: PPh22TransactionType
  transactionValue: number | null
  otherCosts: number | null
  deduction: number | null
}

const sampleForm = (): Pph22FormState => ({
  transactionType: 'impor',
  transactionValue: 500000000,
  otherCosts: 0,
  deduction: 0,
})

const emptyForm = (): Pph22FormState => ({
  transactionType: 'impor',
  transactionValue: null,
  otherCosts: null,
  deduction: null,
})

export const Route = createFileRoute('/pph22')({
  component: Pph22Page,
})

function Pph22Page() {
  const [form, setForm] = useState<Pph22FormState>(sampleForm)

  const normalizedForm = useMemo(
    () => ({
      ...form,
      transactionValue: form.transactionValue ?? 0,
      otherCosts: form.otherCosts ?? 0,
      deduction: form.deduction ?? 0,
    }),
    [form],
  )

  const result = useMemo(() => calculatePph22(normalizedForm), [normalizedForm])

  return (
    <TaxPageLayout
      title="Kalkulator PPh 22"
      description="Simulasikan pemungutan PPh 22 atas transaksi impor, BUMN, industri migas, dan transaksi khusus lain. Cocok untuk memperkirakan potongan pada saat pembayaran."
      form={
        <TaxFormSection
          title="Objek PPh 22"
          description="Masukkan rincian nilai DPP."
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
          <FormField label="Jenis transaksi" htmlFor="transactionType">
            <Select
              id="transactionType"
              value={form.transactionType}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  transactionType: event.target.value as PPh22TransactionType,
                }))
              }
            >
              <option value="impor">Impor umum</option>
              <option value="migas">Industri migas</option>
              <option value="bumn">Pembelian BUMN tertentu</option>
              <option value="lainnya">Transaksi lain</option>
            </Select>
          </FormField>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Nilai transaksi (CIF/FOB)" htmlFor="transactionValue">
              <NumberInput
                id="transactionValue"
                value={form.transactionValue}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, transactionValue: value }))
                }
              />
            </FormField>
            <FormField
              label="Penyesuaian biaya (+)"
              htmlFor="otherCosts"
              description="Mis. biaya asuransi, freight, atau lain-lain."
            >
              <NumberInput
                id="otherCosts"
                value={form.otherCosts}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, otherCosts: value }))
                }
              />
            </FormField>
          </div>

          <FormField
            label="Pengurang (-)"
            htmlFor="deduction"
            description="Masukkan potongan seperti diskon, nilai non-DPP, atau pembebasan PPN."
          >
            <NumberInput
              id="deduction"
              value={form.deduction}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, deduction: value }))
              }
            />
          </FormField>
        </TaxFormSection>
      }
      summary={
        <TaxSummaryCard
          total={result.totalTax}
          label="PPh 22 dipungut"
          meta="Tarif mengikuti jenis transaksi"
        />
      }
      result={<TaxResultTable breakdown={result.breakdown} />}
      explanation={
        <FormulaExplanationCard
          title="Alur perhitungan"
          steps={[
            'Dasar pungut (DPP) = Nilai transaksi + biaya lain - pengurang.',
            'Tarif mengikuti PER-38/PJ/2013 (impor 2.5%, migas 2%, BUMN 1.5%).',
            'PPh 22 = DPP × tarif.',
          ]}
        />
      }
      info={
        <InfoAlert
          title="Tips pengecekan"
          items={[
            'Pastikan barang termasuk dalam daftar objek PPh 22.',
            'Tarif dapat berbeda jika ada fasilitas kepabeanan/PPnBM.',
            'Simpan bukti potong untuk kredit di SPT Tahunan.',
          ]}
        />
      }
    />
  )
}
