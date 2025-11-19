import { formatCurrency } from '../lib/format'
import { cn } from '../lib/cn'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import type { TaxBreakdownRow } from '../lib/tax/types'

const percentFormatter = new Intl.NumberFormat('id-ID', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

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
    return percentFormatter.format(row.value)
  }
  return formatCurrency(row.value)
}

export function TaxResultTable({ breakdown }: TaxResultTableProps) {
  return (
    <div className="overflow-x-auto lg:max-h-[620px]">
      <Table className="text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Komponen</TableHead>
            <TableHead>Nilai (Rp)</TableHead>
            <TableHead>Keterangan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {breakdown.map((row) => {
            if (row.variant === 'section') {
              return (
                <TableRow
                  key={row.label}
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
              <TableRow key={row.label}>
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
