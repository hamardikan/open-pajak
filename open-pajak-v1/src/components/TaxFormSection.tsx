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
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-[#0f1e3d]">
              {title}
            </CardTitle>
            {description && (
              <p className="mt-1 text-sm text-[#0f1e3d]/70">{description}</p>
            )}
          </div>
          {actions ? (
            <div className="flex flex-wrap justify-end gap-2">{actions}</div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">{children}</div>
      </CardContent>
    </>
  )
}
