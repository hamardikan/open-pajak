import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import type { ButtonHTMLAttributes } from 'react'
import type { VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-[#0f1e3d] text-white hover:bg-[#142b5c] focus-visible:ring-[#f9c74f]',
        outline:
          'border border-[#0f1e3d]/20 bg-white text-[#0f1e3d] hover:bg-[#fff7e0] focus-visible:ring-[#0f1e3d]',
        ghost: 'text-[#0f1e3d] bg-transparent hover:bg-[#0f1e3d]/10',
        accent:
          'bg-[#f9c74f] text-[#0f1e3d] hover:bg-[#f7b824] focus-visible:ring-[#0f1e3d]',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}
