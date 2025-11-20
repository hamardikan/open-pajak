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
  const { t, i18n } = useTranslation()
  const [form, setForm] = useState<PpnbmFormState>(sampleForm)

  const normalizedForm = useMemo(
    () => ({
      ...form,
      dppPpn: form.dppPpn ?? 0,
    }),
    [form],
  )

  const result = useMemo(
    () => calculatePpnbm(normalizedForm),
    [normalizedForm, i18n.language],
  )

  return (
    <TaxPageLayout
      title={t('ppnbmCalc.title')}
      description={t('ppnbmCalc.description')}
      form={
        <TaxFormSection
          title={t('ppnbmCalc.form.title')}
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
            label={t('ppnbmCalc.form.goodsType')}
            htmlFor="goodsType"
          >
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
              <option value="kendaraanMewah">
                {t('ppnbmCalc.options.goodsType.kendaraanMewah')}
              </option>
              <option value="perhiasan">
                {t('ppnbmCalc.options.goodsType.perhiasan')}
              </option>
              <option value="kapalPesiar">
                {t('ppnbmCalc.options.goodsType.kapalPesiar')}
              </option>
              <option value="elektronikPremium">
                {t('ppnbmCalc.options.goodsType.elektronikPremium')}
              </option>
            </Select>
          </FormField>

          <FormField label={t('ppnbmCalc.form.dpp')} htmlFor="dppPpn">
            <NumberInput
              id="dppPpn"
              value={form.dppPpn}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, dppPpn: value }))
              }
            />
          </FormField>

          <FormField
            label={t('ppnbmCalc.form.customRate')}
            htmlFor="customRate"
            description={t('ppnbmCalc.form.customRateDesc')}
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
            {t('app.buttons.useSample')}
          </Button>
        </TaxFormSection>
      }
      summary={
        <TaxSummaryCard
          total={result.totalTax}
          label={t('ppnbmCalc.summary.label')}
          meta={t('ppnbmCalc.summary.meta')}
        />
      }
      result={<TaxResultTable breakdown={result.breakdown} />}
      explanation={
        <FormulaExplanationCard
          title={t('ppnbmCalc.explanationTitle')}
          steps={t('ppnbmCalc.explanation', { returnObjects: true }) as string[]}
        />
      }
      info={
        <InfoAlert
          title={t('ppnbmCalc.info.title')}
          items={t('ppnbmCalc.info.items', { returnObjects: true }) as string[]}
        />
      }
    />
  )
}
