import { CardContent, CardHeader, CardTitle } from './ui/card'
import type { ReactNode } from 'react'

interface FormulaExplanationCardProps {
  title: string
  steps: Array<string>
  extra?: ReactNode
}

export function FormulaExplanationCard({
  title,
  steps,
  extra,
}: FormulaExplanationCardProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-[#0f1e3d]/80">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {extra && <div className="mt-4">{extra}</div>}
      </CardContent>
    </>
  )
}
