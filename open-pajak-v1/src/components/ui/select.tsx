import { forwardRef } from 'react'
import { cn } from '../../lib/cn'
import type { SelectHTMLAttributes } from 'react'

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-xl border border-[#0f1e3d]/20 bg-white/90 px-3 text-sm text-[#0f1e3d] shadow-inner shadow-black/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9c74f] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
)
Select.displayName = 'Select'
