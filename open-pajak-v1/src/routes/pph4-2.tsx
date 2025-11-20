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
  const { t, i18n } = useTranslation()
  const [form, setForm] = useState<Pph4FormState>(sampleForm)

  const normalizedForm = useMemo(
    () => ({
      ...form,
      grossAmount: form.grossAmount ?? 0,
    }),
    [form],
  )

  const result = useMemo(
    () => calculatePph4(normalizedForm),
    [normalizedForm, i18n.language],
  )

  return (
    <TaxPageLayout
      title={t('pph4_2_calc.title')}
      description={t('pph4_2_calc.description')}
      form={
        <TaxFormSection
          title={t('pph4_2_calc.form.title')}
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
            label={t('pph4_2_calc.form.objectType')}
            htmlFor="objectType"
          >
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
              <option value="sewaTanah">
                {t('pph4_2_calc.options.objectType.sewaTanah')}
              </option>
              <option value="konstruksi">
                {t('pph4_2_calc.options.objectType.konstruksi')}
              </option>
              <option value="restoran">
                {t('pph4_2_calc.options.objectType.restoran')}
              </option>
              <option value="umkmFinal">
                {t('pph4_2_calc.options.objectType.umkmFinal')}
              </option>
            </Select>
          </FormField>

          <FormField
            label={t('pph4_2_calc.form.gross')}
            htmlFor="grossAmount"
            description={t('pph4_2_calc.form.grossDesc')}
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
          label={t('pph4_2_calc.summary.label')}
          meta={t('pph4_2_calc.summary.meta')}
        />
      }
      result={<TaxResultTable breakdown={result.breakdown} />}
      explanation={
        <FormulaExplanationCard
          title={t('pph4_2_calc.explanationTitle')}
          steps={t('pph4_2_calc.explanation', { returnObjects: true }) as string[]}
        />
      }
      info={
        <InfoAlert
          title={t('pph4_2_calc.info.title')}
          items={t('pph4_2_calc.info.items', { returnObjects: true }) as string[]}
        />
      }
    />
  )
}
