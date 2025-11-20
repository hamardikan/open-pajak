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
  const { t, i18n } = useTranslation()
  const [form, setForm] = useState<Pph23FormState>(sampleForm)

  const normalizedForm = useMemo(
    () => ({
      ...form,
      grossAmount: form.grossAmount ?? 0,
    }),
    [form],
  )

  const result = useMemo(
    () => calculatePph23(normalizedForm),
    [normalizedForm, i18n.language],
  )

  return (
    <TaxPageLayout
      title={t('pph23.title')}
      description={t('pph23.description')}
      form={
        <TaxFormSection
          title={t('pph23.form.title')}
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
            <FormField
              label={t('pph23.form.incomeType')}
              htmlFor="serviceType"
            >
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
                <option value="jasaTeknik">
                  {t('pph23.options.serviceType.jasaTeknik')}
                </option>
                <option value="jasaKonsultan">
                  {t('pph23.options.serviceType.jasaKonsultan')}
                </option>
                <option value="sewaAlat">
                  {t('pph23.options.serviceType.sewaAlat')}
                </option>
                <option value="dividen">
                  {t('pph23.options.serviceType.dividen')}
                </option>
                <option value="bunga">
                  {t('pph23.options.serviceType.bunga')}
                </option>
              </Select>
            </FormField>

            <FormField
              label={t('pph23.form.isFinal')}
              htmlFor="isFinal"
              description={t('pph23.form.isFinalDesc')}
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
                <option value="tidak">{t('pph23.options.final.no')}</option>
                <option value="ya">{t('pph23.options.final.yes')}</option>
              </Select>
            </FormField>
          </div>

          <FormField
            label={t('pph23.form.gross')}
            htmlFor="grossAmount"
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
          label={t('pph23.summary.label')}
          meta={t('pph23.summary.meta')}
        />
      }
      result={<TaxResultTable breakdown={result.breakdown} />}
      explanation={
        <FormulaExplanationCard
          title={t('pph23.explanationTitle')}
          steps={t('pph23.explanation', { returnObjects: true }) as string[]}
        />
      }
      info={
        <InfoAlert
          title={t('pph23.info.title')}
          items={t('pph23.info.items', { returnObjects: true }) as string[]}
        />
      }
    />
  )
}
