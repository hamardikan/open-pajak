import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t, i18n } = useTranslation()
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

  const result = useMemo(
    () => calculatePph22(normalizedForm),
    [normalizedForm, i18n.language],
  )

  return (
    <TaxPageLayout
      title={t('pph22.title')}
      description={t('pph22.description')}
      form={
        <TaxFormSection
          title={t('pph22.form.title')}
          description={t('pph22.form.description')}
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
          <FormField
            label={t('pph22.form.transactionType')}
            htmlFor="transactionType"
          >
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
              <option value="impor">
                {t('pph22.form.transactionTypeOptions.impor')}
              </option>
              <option value="migas">
                {t('pph22.form.transactionTypeOptions.migas')}
              </option>
              <option value="bumn">
                {t('pph22.form.transactionTypeOptions.bumn')}
              </option>
              <option value="lainnya">
                {t('pph22.form.transactionTypeOptions.lainnya')}
              </option>
            </Select>
          </FormField>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label={t('pph22.form.transactionValue')}
              htmlFor="transactionValue"
            >
              <NumberInput
                id="transactionValue"
                value={form.transactionValue}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, transactionValue: value }))
                }
              />
            </FormField>
            <FormField
              label={t('pph22.form.otherCosts')}
              htmlFor="otherCosts"
              description={t('pph22.form.otherCostsNote')}
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
            label={t('pph22.form.deduction')}
            htmlFor="deduction"
            description={t('pph22.form.deductionNote')}
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
          label={t('pph22.summary.label')}
          meta={t('pph22.summary.meta')}
        />
      }
      result={<TaxResultTable breakdown={result.breakdown} />}
      explanation={
        <FormulaExplanationCard
          title={t('pph22.explanationTitle')}
          steps={t('pph22.explanation', { returnObjects: true }) as string[]}
        />
      }
      info={
        <InfoAlert
          title={t('pph22.info.title')}
          items={t('pph22.info.items', { returnObjects: true }) as string[]}
        />
      }
    />
  )
}
