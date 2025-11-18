import { CardContent, CardHeader, CardTitle } from './ui/card'
import type { ReactNode } from 'react'

interface TaxFormSectionProps {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
}

export function TaxFormSection({
  title,
  description,
  children,
  actions,
}: TaxFormSectionProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="mt-1 text-sm text-[#0f1e3d]/70">{description}</p>
        )}
        {actions && (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {actions}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">{children}</div>
      </CardContent>
    </>
  )
}
