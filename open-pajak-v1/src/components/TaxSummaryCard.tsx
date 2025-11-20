import { formatCurrency } from '../lib/format'
import { Card, CardTitle } from './ui/card'
import { useTranslation } from 'react-i18next'

interface TaxSummaryCardProps {
  total: number
  label?: string
  meta?: string
  terPerPeriod?: number
  decemberAdjustment?: number
  takeHomeAnnual?: number
  takeHomePerPeriod?: number
}

export function TaxSummaryCard({
  total,
  label,
  meta,
  terPerPeriod,
  decemberAdjustment,
  takeHomeAnnual,
  takeHomePerPeriod,
}: TaxSummaryCardProps) {
  const { t } = useTranslation()
  const taxLabel = label ?? t('summary.taxOverview')

  return (
    <Card className="border border-[#f6ce7d]/60 bg-gradient-to-br from-[#fffaf2] to-[#fff4d8] px-6 py-4 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <CardTitle className="text-xs font-semibold uppercase tracking-[0.3em] text-[#967000]">
            {taxLabel}
          </CardTitle>
          <div className="space-y-2 text-sm text-[#0f1e3d]">
            <SummaryMetric label={t('summary.totalTax')} value={total} />
            {typeof terPerPeriod === 'number' && (
              <SummaryMetric label={t('summary.terMonthly')} value={terPerPeriod} />
            )}
            {typeof decemberAdjustment === 'number' && (
              <SummaryMetric
                label={t('summary.decAdjustment')}
                value={decemberAdjustment}
              />
            )}
          </div>
          {meta && (
            <p className="text-xs font-medium text-[#5a4100]/80">{meta}</p>
          )}
        </div>

        <div className="space-y-3">
          <CardTitle className="text-xs font-semibold uppercase tracking-[0.3em] text-[#967000]">
            {t('summary.takeHome')}
          </CardTitle>
          <div className="space-y-2 text-sm text-[#0f1e3d]">
            {typeof takeHomeAnnual === 'number' && (
              <SummaryMetric label={t('summary.thpAnnual')} value={takeHomeAnnual} />
            )}
            {typeof takeHomePerPeriod === 'number' && (
              <SummaryMetric label={t('summary.thpPeriod')} value={takeHomePerPeriod} />
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

function SummaryMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between border-t border-[#f6ce7d]/60 pt-1">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5f4400]">
        {label}
      </span>
      <span className="text-lg font-semibold text-[#0f1e3d]">
        {formatCurrency(value)}
      </span>
    </div>
  )
}
