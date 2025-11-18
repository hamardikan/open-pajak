import { formatCurrency } from '../lib/format'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

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
    <Card className="border-2 border-[#f9c74f]/60 bg-gradient-to-br from-[#fffaf2] to-[#fff4d8]">
      <CardHeader>
        <CardTitle className="text-[#5a4100]">{label}</CardTitle>
        {meta && (
          <p className="text-sm font-medium text-[#5a4100]/80">{meta}</p>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-[#0f1e3d]">
          {formatCurrency(total)}
        </p>
      </CardContent>
    </Card>
  )
}
