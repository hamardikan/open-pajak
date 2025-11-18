import { useEffect, useMemo, useState } from 'react'
import { Input } from './input'
import type { InputProps } from './input'

const formatter = new Intl.NumberFormat('id-ID')

function formatValue(value: number | null | undefined) {
  if (value === null || value === undefined) return ''
  return formatter.format(value)
}

const sanitize = (raw: string) => raw.replace(/[^\d]/g, '')

export interface NumberInputProps
  extends Omit<InputProps, 'value' | 'onChange' | 'type'> {
  value: number | null
  onValueChange?: (value: number | null) => void
}

export function NumberInput({
  value,
  onValueChange,
  ...props
}: NumberInputProps) {
  const [display, setDisplay] = useState(formatValue(value))

  useEffect(() => {
    setDisplay(formatValue(value))
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digits = sanitize(event.target.value)
    if (!digits) {
      setDisplay('')
      onValueChange?.(null)
      return
    }

    const numeric = Number(digits)
    setDisplay(formatter.format(numeric))
    onValueChange?.(numeric)
  }

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={display}
      onChange={handleChange}
      {...props}
    />
  )
}
