import { formatCurrency, formatPercent } from '../lib/format'
import { cn } from '../lib/cn'
import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import type { TaxBreakdownRow } from '../lib/tax/types'

interface TaxResultTableProps {
  breakdown: Array<TaxBreakdownRow>
}

function renderValue(row: TaxBreakdownRow) {
  if (row.value === undefined) {
    return ''
  }
  if (typeof row.value === 'string' || row.valueType === 'text') {
    return row.value
  }
  if (row.valueType === 'percent') {
    return formatPercent(row.value)
  }
  return formatCurrency(row.value)
}

export function TaxResultTable({ breakdown }: TaxResultTableProps) {
  const { t } = useTranslation()
  return (
    <div className="overflow-x-auto lg:max-h-[620px]">
      <Table className="text-sm">
        <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
          <TableRow>
            <TableHead>{t('table.component')}</TableHead>
            <TableHead>{t('table.value')}</TableHead>
            <TableHead>{t('table.note')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {breakdown.map((row, index) => {
            if (row.variant === 'spacer') {
              return (
                <TableRow key={`spacer-${index}`}>
                  <TableCell colSpan={3} className="py-2" />
                </TableRow>
              )
            }
            if (row.variant === 'group') {
              return (
                <TableRow key={`group-${row.label}-${index}`}>
                  <TableCell
                    colSpan={3}
                    className="bg-[#fff7e6] text-xs font-semibold uppercase tracking-[0.3em] text-[#886200]"
                  >
                    {row.label}
                  </TableCell>
                </TableRow>
              )
            }
            if (row.variant === 'section') {
              return (
                <TableRow
                  key={`section-${row.label}-${index}`}
                  className="bg-[#f5f7fb] text-[#0f1e3d] font-semibold uppercase tracking-wide"
                >
                  <TableCell colSpan={3}>{row.label}</TableCell>
                </TableRow>
              )
            }

            const valueClasses =
              row.variant === 'total'
                ? 'font-bold text-[#0f1e3d]'
                : row.variant === 'subtotal'
                  ? 'font-semibold text-[#142853]'
                  : ''

            return (
              <TableRow key={`${row.label}-${index}`}>
                <TableCell className="font-medium text-[#0f1e3d]">
                  {row.label}
                </TableCell>
                <TableCell className={cn('tabular-nums', valueClasses)}>
                  {renderValue(row)}
                </TableCell>
                <TableCell className="text-xs text-[#0f1e3d]/70">
                  {row.note ?? '—'}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
