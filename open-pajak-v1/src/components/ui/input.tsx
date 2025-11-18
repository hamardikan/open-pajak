import { forwardRef } from 'react'
import { cn } from '../../lib/cn'
import type { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-[#0f1e3d]/20 bg-white/90 px-3 py-2 text-sm text-[#0f1e3d] shadow-inner shadow-black/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9c74f] disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'
