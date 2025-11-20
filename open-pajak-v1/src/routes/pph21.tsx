import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

const SUBJECT_OPTIONS: Array<{ value: PPh21SubjectType; labelKey: string }> = [
  { value: 'pegawai_tetap', labelKey: 'pph21.subjectOptions.pegawai_tetap' },
  { value: 'pensiunan', labelKey: 'pph21.subjectOptions.pensiunan' },
  { value: 'pegawai_tidak_tetap', labelKey: 'pph21.subjectOptions.pegawai_tidak_tetap' },
  { value: 'bukan_pegawai', labelKey: 'pph21.subjectOptions.bukan_pegawai' },
  { value: 'peserta_kegiatan', labelKey: 'pph21.subjectOptions.peserta_kegiatan' },
  { value: 'program_pensiun', labelKey: 'pph21.subjectOptions.program_pensiun' },
  { value: 'mantan_pegawai', labelKey: 'pph21.subjectOptions.mantan_pegawai' },
  { value: 'wpln', labelKey: 'pph21.subjectOptions.wpln' },
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
  const { t } = useTranslation()
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

  const subjectOptions = useMemo(
    () =>
      SUBJECT_OPTIONS.map((option) => ({
        value: option.value,
        label: t(option.labelKey),
      })),
    [t],
  )

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
  const takeHomeAnnualRow = result.breakdown.find(
    (row) => row.label === 'Take-home setahun',
  )
  const takeHomePerPeriodRow = result.breakdown.find(
    (row) => row.label === 'Take-home per masa',
  )
  const takeHomeAnnual =
    typeof takeHomeAnnualRow?.value === 'number' ? takeHomeAnnualRow.value : undefined
  const takeHomePerPeriod =
    typeof takeHomePerPeriodRow?.value === 'number'
      ? takeHomePerPeriodRow.value
      : undefined
  const terPerPeriodRow = result.breakdown.find(
    (row) => row.label === 'PPh 21 TER per masa',
  )
  const decemberAdjustmentRow = result.breakdown.find(
    (row) => row.label === 'Penyesuaian Desember',
  )
  const terPerPeriod =
    typeof terPerPeriodRow?.value === 'number' ? terPerPeriodRow.value : undefined
  const decemberAdjustment =
    typeof decemberAdjustmentRow?.value === 'number'
      ? decemberAdjustmentRow.value
      : undefined
  const totalNegatives = Object.entries(form).filter(
    ([, value]) => typeof value === 'number' && value < 0,
  )
  const hasError = totalNegatives.length > 0

  const infoItems = t('pph21.info.points', {
    returnObjects: true,
  }) as string[]

  return (
    <TaxPageLayout
      title={t('pph21.title')}
      description={t('pph21.description')}
      form={
        <TaxFormSection
          title={t('pph21.form.title')}
          description={t('pph21.form.description')}
          actions={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setForm(createEmptyForm())}
              >
                {t('app.buttons.clearForm')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setForm(createSampleForm())}
              >
                {t('app.buttons.useSample')}
              </Button>
            </>
          }
        >
          <FormField label={t('pph21.form.fields.subjectType')} htmlFor="subjectType">
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
              {subjectOptions.map((subject) => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label={t('pph21.form.fields.brutoMonthly')}
              htmlFor="brutoMonthly"
            >
              <NumberInput
                id="brutoMonthly"
                value={form.brutoMonthly}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, brutoMonthly: value }))
                }
              />
            </FormField>

            <FormField
              label={t('pph21.form.fields.monthsPaid')}
              htmlFor="monthsPaid"
              description={t('pph21.form.descriptions.monthsPaid')}
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
              label={t('pph21.form.fields.pensionContribution')}
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
            <FormField
              label={t('pph21.form.fields.bonusAnnual')}
              htmlFor="bonusAnnual"
            >
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
          <FormField label={t('pph21.form.fields.ptkpStatus')} htmlFor="ptkpStatus">
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
                label={t('pph21.form.fields.zakat')}
                htmlFor="zakat"
                description={t('pph21.form.descriptions.zakat')}
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
                <FormField label={t('pph21.form.fields.scheme')} htmlFor="scheme">
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
                    <option value="lama">{t('pph21.schemeOptions.lama')}</option>
                    <option value="ter">{t('pph21.schemeOptions.ter')}</option>
                  </Select>
                </FormField>

                <FormField
                  label={t('pph21.form.fields.terCategory')}
                  htmlFor="terCategory"
                  description={t('pph21.form.descriptions.terCategory')}
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
                    <option value="A">{t('pph21.terOptions.A')}</option>
                    <option value="B">{t('pph21.terOptions.B')}</option>
                    <option value="C">{t('pph21.terOptions.C')}</option>
                  </Select>
                </FormField>
              </div>
            </>
          )}

          {form.subjectType === 'pegawai_tidak_tetap' && (
            <div className="flex items-center justify-between rounded-2xl border border-[#0f1e3d]/15 bg-[#0f1e3d]/5 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#0f1e3d]">
                  {t('pph21.toggleDaily.title')}
                </p>
                <p className="text-xs text-[#0f1e3d]/70">
                  {t('pph21.toggleDaily.description')}
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
                {form.isDailyWorker
                  ? t('pph21.toggleDaily.daily')
                  : t('pph21.toggleDaily.monthly')}
              </Button>
            </div>
          )}

          {form.subjectType === 'wpln' && (
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label={t('pph21.wplnField.label')}
                htmlFor="foreignTaxRate"
                description={t('pph21.wplnField.description')}
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
              {t('errors.positiveOnly', { defaultValue: 'Gunakan angka positif.' })}
            </p>
          )}
        </TaxFormSection>
      }
      summary={
        <TaxSummaryCard
          total={result.totalTax}
          meta={t('pph21.summary.meta')}
          terPerPeriod={terPerPeriod}
          decemberAdjustment={decemberAdjustment}
          takeHomeAnnual={takeHomeAnnual}
          takeHomePerPeriod={takeHomePerPeriod}
        />
      }
      result={<TaxResultTable breakdown={result.breakdown} />}
      explanation={
        <FormulaExplanationCard
          title={t('pph21.explanationTitle')}
          steps={t('pph21.explanation', { returnObjects: true }) as string[]}
        />
      }
      info={
        <InfoAlert
          title={t('pph21.info.goodPractice')}
          items={infoItems}
          extra={
            <p className="text-xs text-[#5a4100]/80">
              {t('pph21.info.disclaimer')}
            </p>
          }
        />
      }
    />
  )
}
