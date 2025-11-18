import { Label } from './ui/label'
import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  htmlFor: string
  children: ReactNode
  description?: string
  error?: string
}

export function FormField({
  label,
  htmlFor,
  children,
  description,
  error,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {description && (
        <p className="text-xs text-[#0f1e3d]/60">{description}</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
