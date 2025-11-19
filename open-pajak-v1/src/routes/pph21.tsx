import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
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
import { calculatePph21 } from '../lib/tax/pph21'
import type { PPh21SubjectType } from '../lib/tax/pph21'

export const Route = createFileRoute('/pph21')({
  component: Pph21Page,
})

const subjects: Array<{ value: PPh21SubjectType; label: string }> = [
  { value: 'pegawai_tetap', label: 'Pegawai Tetap' },
  { value: 'pensiunan', label: 'Pensiunan' },
  { value: 'pegawai_tidak_tetap', label: 'Pegawai Tidak Tetap' },
  { value: 'bukan_pegawai', label: 'Bukan Pegawai' },
  { value: 'peserta_kegiatan', label: 'Peserta Kegiatan' },
  { value: 'program_pensiun', label: 'Penarikan Program Pensiun' },
  { value: 'mantan_pegawai', label: 'Mantan Pegawai' },
  { value: 'wpln', label: 'PPh 26 (WPLN)' },
]

const ptkpOptions: Array<string> = [
  'TK/0',
  'TK/1',
  'TK/2',
  'TK/3',
  'K/0',
  'K/1',
  'K/2',
  'K/3',
]

const PTKP_TER_MAPPING: Partial<Record<string, 'A' | 'B' | 'C'>> = {
  'TK/0': 'A',
  'TK/1': 'A',
  'K/0': 'A',
  'TK/2': 'B',
  'TK/3': 'B',
  'K/1': 'B',
  'K/2': 'B',
  'K/3': 'C',
}

const TER_DEFAULTS: Partial<Record<PPh21SubjectType, 'A' | 'B' | 'C'>> = {
  pegawai_tetap: 'A',
  pensiunan: 'A',
  program_pensiun: 'A',
  mantan_pegawai: 'A',
  pegawai_tidak_tetap: 'B',
  peserta_kegiatan: 'B',
  bukan_pegawai: 'C',
}

type Pph21FormState = {
  subjectType: PPh21SubjectType
  brutoMonthly: number | null
  monthsPaid: number
  pensionContribution: number | null
  zakatOrDonation: number | null
  ptkpStatus: string
  scheme: 'lama' | 'ter'
  terCategory: 'A' | 'B' | 'C'
  bonusAnnual: number | null
  foreignTaxRate: number
  isDailyWorker: boolean
}

const createSampleForm = (): Pph21FormState => ({
  subjectType: 'pegawai_tetap',
  brutoMonthly: 15000000,
  monthsPaid: 12,
  pensionContribution: 200000,
  zakatOrDonation: 0,
  ptkpStatus: 'K/0',
  scheme: 'ter',
  terCategory: 'A',
  bonusAnnual: 20000000,
  foreignTaxRate: 20,
  isDailyWorker: false,
})

const createEmptyForm = (): Pph21FormState => ({
  subjectType: 'pegawai_tetap',
  brutoMonthly: null,
  monthsPaid: 1,
  pensionContribution: null,
  zakatOrDonation: null,
  ptkpStatus: 'TK/0',
  scheme: 'ter',
  terCategory: 'A',
  bonusAnnual: null,
  foreignTaxRate: 20,
  isDailyWorker: false,
})

function Pph21Page() {
  const [form, setForm] = useState<Pph21FormState>(createSampleForm)

  useEffect(() => {
    const terFromStatus = PTKP_TER_MAPPING[form.ptkpStatus]
    const terFromSubject = TER_DEFAULTS[form.subjectType]
    const nextTer = terFromStatus ?? terFromSubject
    if (nextTer && nextTer !== form.terCategory) {
      setForm((prev) => ({ ...prev, terCategory: nextTer }))
    }
  }, [form.ptkpStatus, form.subjectType, form.terCategory])

  const handleNumberChange = (
    field: keyof typeof form,
    value: string,
  ) => {
    const numeric = Number(value)
    setForm((prev) => ({
      ...prev,
      [field]: Number.isFinite(numeric) ? numeric : 0,
    }))
  }

  const normalizedForm = useMemo(
    () => ({
      ...form,
      brutoMonthly: form.brutoMonthly ?? 0,
      pensionContribution: form.pensionContribution ?? 0,
      zakatOrDonation: form.zakatOrDonation ?? 0,
      bonusAnnual: form.bonusAnnual ?? 0,
    }),
    [form],
  )

  const result = useMemo(() => calculatePph21(normalizedForm), [normalizedForm])
  const totalNegatives = Object.entries(form).filter(
    ([, value]) => typeof value === 'number' && value < 0,
  )
  const hasError = totalNegatives.length > 0

  return (
    <TaxPageLayout
      title="Kalkulator PPh 21/26"
      description="Hitung potongan pajak penghasilan atas pegawai, bukan pegawai, hingga Wajib Pajak luar negeri. Sesuaikan skema lama maupun Tarif Efektif (TER)."
      form={
        <TaxFormSection
          title="Data Penghasilan"
          description="Masukkan nilai bruto dan parameter masa pajak."
          actions={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setForm(createEmptyForm())}
              >
                Kosongkan Form
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setForm(createSampleForm())}
              >
                Gunakan Contoh
              </Button>
            </>
          }
        >
          <FormField label="Jenis subjek" htmlFor="subjectType">
            <Select
              id="subjectType"
              value={form.subjectType}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  subjectType: event.target.value as PPh21SubjectType,
                }))
              }
            >
              {subjects.map((subject) => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Penghasilan bruto per masa" htmlFor="brutoMonthly">
              <NumberInput
                id="brutoMonthly"
                value={form.brutoMonthly}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, brutoMonthly: value }))
                }
              />
            </FormField>

            <FormField
              label="Jumlah masa (bulan/hari)"
              htmlFor="monthsPaid"
              description="Maksimal 12."
            >
              <Input
                id="monthsPaid"
                type="number"
                min={1}
                max={12}
                value={form.monthsPaid}
                onChange={(event) =>
                  handleNumberChange('monthsPaid', event.target.value)
                }
              />
            </FormField>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Iuran pensiun per masa"
              htmlFor="pensionContribution"
            >
              <NumberInput
                id="pensionContribution"
                value={form.pensionContribution}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, pensionContribution: value }))
                }
              />
            </FormField>
            <FormField label="Bonus/tantiem tahunan" htmlFor="bonusAnnual">
              <NumberInput
                id="bonusAnnual"
                value={form.bonusAnnual}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, bonusAnnual: value }))
                }
              />
            </FormField>
          </div>

          {form.subjectType !== 'wpln' && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Status PTKP" htmlFor="ptkpStatus">
            <Select
              id="ptkpStatus"
              value={form.ptkpStatus}
              onChange={(event) =>
                setForm((prev) => {
                  const nextStatus = event.target.value
                  const nextTer = PTKP_TER_MAPPING[nextStatus]
                  return {
                    ...prev,
                    ptkpStatus: nextStatus,
                    terCategory: nextTer ?? prev.terCategory,
                  }
                })
              }
            >
              {ptkpOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>

              <FormField
                label="Zakat/Sumbangan (setahun)"
                htmlFor="zakat"
                description="Lewat pemberi kerja, opsional"
              >
                <NumberInput
                  id="zakat"
                  value={form.zakatOrDonation}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, zakatOrDonation: value }))
                  }
                />
              </FormField>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Skema" htmlFor="scheme">
                  <Select
                    id="scheme"
                    value={form.scheme}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        scheme: event.target.value as 'lama' | 'ter',
                      }))
                    }
                  >
                    <option value="lama">Skema lama (Pasal 17)</option>
                    <option value="ter">TER (Tarif Efektif)</option>
                  </Select>
                </FormField>

                <FormField
                  label="Kategori TER"
                  htmlFor="terCategory"
                  description="Disesuaikan otomatis berdasarkan subjek, bisa diubah manual."
                >
                  <Select
                    id="terCategory"
                    value={form.terCategory}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        terCategory: event.target.value as 'A' | 'B' | 'C',
                      }))
                    }
                  >
                    <option value="A">Kategori A</option>
                    <option value="B">Kategori B</option>
                    <option value="C">Kategori C</option>
                  </Select>
                </FormField>
              </div>
            </>
          )}

          {form.subjectType === 'pegawai_tidak_tetap' && (
            <div className="flex items-center justify-between rounded-2xl border border-[#0f1e3d]/15 bg-[#0f1e3d]/5 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#0f1e3d]">
                  Hitung harian?
                </p>
                <p className="text-xs text-[#0f1e3d]/70">
                  Gunakan TER harian jika pekerja dibayar per hari.
                </p>
              </div>
              <Button
                variant={form.isDailyWorker ? 'accent' : 'outline'}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    isDailyWorker: !prev.isDailyWorker,
                  }))
                }
              >
                {form.isDailyWorker ? 'Harian' : 'Bulanan'}
              </Button>
            </div>
          )}

          {form.subjectType === 'wpln' && (
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Tarif PPh 26"
                htmlFor="foreignTaxRate"
                description="Dalam persen"
              >
                <Input
                  id="foreignTaxRate"
                  type="number"
                  min={0}
                  max={100}
                  value={form.foreignTaxRate}
                  onChange={(event) =>
                    handleNumberChange('foreignTaxRate', event.target.value)
                  }
                />
              </FormField>
            </div>
          )}

          {hasError && (
            <p className="text-sm text-red-600">
              Pastikan semua nilai numerik bernilai positif.
            </p>
          )}
        </TaxFormSection>
      }
      summary={
        <TaxSummaryCard
          total={result.totalTax}
          label="Estimasi PPh 21/26"
          meta="TER Jan–Nov, selisih Pasal 17 dibayar di Desember"
        />
      }
      result={<TaxResultTable breakdown={result.breakdown} />}
      explanation={
        <FormulaExplanationCard
          title="Formula ringkas"
          steps={[
            'DPP dihitung sesuai jenis subjek (50% bruto, TER, atau penuh).',
            'PTKP digunakan untuk pegawai tetap/pensiunan dengan skema lama.',
            'PKP dibulatkan ke bawah per Rp1.000 sebelum Pasal 17 diterapkan.',
            'Skema TER mengikuti kategori A/B/C per PER-2/PJ/2024.',
          ]}
        />
      }
      info={
        <InfoAlert
          title="Catatan penting"
          items={[
            'Tidak ada penyimpanan data, semua perhitungan terjadi di browser.',
            'PKP dibulatkan ke bawah sesuai ketentuan.',
            'Pegawai tetap memakai TER Januari–November, lalu Desember menyesuaikan Pasal 17 setahun.',
            'Tarif TER menggunakan tabel ringkas, sesuaikan dengan ketentuan DJP bila diperlukan.',
          ]}
          extra={
            <p className="text-xs text-[#5a4100]/80">
              Hasil bersifat indikatif, konfirmasi sebelum pelaporan SPT Masa/ Tahunan.
            </p>
          }
        />
      }
    />
  )
}
