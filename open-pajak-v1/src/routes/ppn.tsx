import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
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
  const { t, i18n } = useTranslation()
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

  const result = useMemo(
    () => calculatePpn(normalizedForm),
    [normalizedForm, i18n.language],
  )
  const handleCustomRateChange = (value: string) => {
    const numeric = Number(value)
    setForm((prev) => ({
      ...prev,
      customRate: Number.isFinite(numeric) ? numeric : 0,
    }))
  }

  return (
    <TaxPageLayout
      title={t('ppnCalc.title')}
      description={t('ppnCalc.description')}
      form={
        <TaxFormSection
          title={t('ppnCalc.form.title')}
          actions={
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setForm(emptyForm())}>
                {t('app.buttons.clearForm')}
              </Button>
              <Button variant="ghost" onClick={() => setForm(sampleForm())}>
                {t('app.buttons.useSample')}
              </Button>
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label={t('ppnCalc.form.taxYear')} htmlFor="taxYear">
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
              label={t('ppnCalc.form.basePrice')}
              htmlFor="basePrice"
              description={t('ppnCalc.form.basePriceDesc')}
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
            <FormField label={t('ppnCalc.form.discount')} htmlFor="discount">
              <NumberInput
                id="discount"
                value={form.discount}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, discount: value }))
                }
              />
            </FormField>
            <FormField label={t('ppnCalc.form.otherCosts')} htmlFor="otherCosts">
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
              label={t('ppnCalc.form.customRate')}
              htmlFor="customRate"
              description={t('ppnCalc.form.customRateDesc')}
            >
              <Input
                id="customRate"
                type="number"
                min={0}
                max={100}
                value={form.customRate}
                onChange={(event) =>
                  handleCustomRateChange(event.target.value)
                }
              />
            </FormField>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#0f1e3d]/15 bg-[#0f1e3d]/5 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#0f1e3d]">
                {t('ppnCalc.form.toggleTitle')}
              </p>
              <p className="text-xs text-[#0f1e3d]/70">
                {t('ppnCalc.form.toggleHint')}
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
              {form.includePpn ? t('ppnCalc.form.toggleTrue') : t('ppnCalc.form.toggleFalse')}
            </Button>
          </div>
        </TaxFormSection>
      }
      summary={
        <TaxSummaryCard
          total={result.totalTax}
          label={t('ppnCalc.summary.label')}
          meta={
            form.includePpn
              ? t('ppnCalc.summary.metaInclusive')
              : t('ppnCalc.summary.metaExclusive')
          }
        />
      }
      result={<TaxResultTable breakdown={result.breakdown} />}
      explanation={
        <FormulaExplanationCard
          title={t('ppnCalc.explanationTitle')}
          steps={t('ppnCalc.explanation', { returnObjects: true }) as string[]}
        />
      }
      info={
        <InfoAlert
          title={t('ppnCalc.info.title')}
          items={t('ppnCalc.info.items', { returnObjects: true }) as string[]}
        />
      }
    />
  )
}
