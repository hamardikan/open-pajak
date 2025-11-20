import { cn } from '../lib/cn'
import { Card } from './ui/card'
import { FormulaSourceNote } from './FormulaSourceNote'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface TaxPageLayoutProps {
  title: string
  description: string
  form: ReactNode
  result: ReactNode
  summary: ReactNode
  explanation: ReactNode
  info?: ReactNode
  toolbar?: ReactNode
  footer?: ReactNode
  className?: string
}

export function TaxPageLayout({
  title,
  description,
  form,
  result,
  summary,
  explanation,
  info,
  toolbar,
  footer,
  className,
}: TaxPageLayoutProps) {
  const { t } = useTranslation()
  return (
    <section className={cn('space-y-6', className)}>
      <div className="space-y-3 text-center lg:text-left">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#f5a524]">
          {t('app.brand')}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[#0f1e3d]">
          {title}
        </h1>
        <p className="text-[#0f1e3d]/70 text-balance">{description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-0">{form}</Card>
        <div className="flex flex-col gap-6">
          {summary}
          <Card className="flex-1">{result}</Card>
        </div>
      </div>

      {toolbar && <div>{toolbar}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>{explanation}</Card>
        {info ? (
          <Card className="border-[#f9c74f]/50 bg-[#fff9eb]">{info}</Card>
        ) : (
          <div />
        )}
      </div>

      <FormulaSourceNote />

      {footer && <div>{footer}</div>}
    </section>
  )
}
