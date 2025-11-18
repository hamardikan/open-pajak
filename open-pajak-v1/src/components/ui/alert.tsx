import { cn } from '../../lib/cn'
import type { HTMLAttributes } from 'react'

export function Alert({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-2xl border border-[#f9c74f]/40 bg-[#fff9ec] px-4 py-3 text-sm text-[#5a4100]',
        className,
      )}
      {...props}
    />
  )
}
