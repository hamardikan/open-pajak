import { formatCurrency } from '../lib/format'
import { Card, CardTitle } from './ui/card'

interface TaxSummaryCardProps {
  total: number
  label?: string
  meta?: string
}

export function TaxSummaryCard({
  total,
  label = 'Total Pajak',
  meta,
}: TaxSummaryCardProps) {
  return (
    <Card className="border border-[#f9c74f]/60 bg-gradient-to-br from-[#fffaf2] to-[#fff4d8] px-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-3xl font-bold text-[#0f1e3d]">
          {formatCurrency(total)}
        </p>
        <div className="space-y-1 text-right sm:text-left">
          <CardTitle className="text-sm font-semibold text-[#5a4100] uppercase tracking-wide">
            {label}
          </CardTitle>
          {meta && (
            <p className="text-xs font-medium text-[#5a4100]/80">{meta}</p>
          )}
        </div>
      </div>
    </Card>
  )
}
