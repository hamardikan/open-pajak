import { Alert } from './ui/alert'
import type { ReactNode } from 'react'

interface InfoAlertProps {
  title: string
  items: Array<string>
  extra?: ReactNode
}

export function InfoAlert({ title, items, extra }: InfoAlertProps) {
  return (
    <Alert className="space-y-3">
      <p className="text-base font-semibold">{title}</p>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {extra}
    </Alert>
  )
}
