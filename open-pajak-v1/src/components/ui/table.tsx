import { cn } from '../../lib/cn'
import type { HTMLAttributes, TableHTMLAttributes } from 'react'

export function Table({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn('w-full caption-bottom text-sm text-[#0f1e3d]', className)}
      {...props}
    />
  )
}

export function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn('text-xs uppercase text-[#0f1e3d]/60', className)}
      {...props}
    />
  )
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-[#0f1e3d]/5', className)} {...props} />
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn('hover:bg-[#0f1e3d]/5 transition-colors', className)}
      {...props}
    />
  )
}

export function TableHead({
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn('px-3 py-2 text-left font-medium tracking-wide', className)}
      {...props}
    />
  )
}

export function TableCell({
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-3 py-2 align-top text-sm', className)} {...props} />
  )
}
