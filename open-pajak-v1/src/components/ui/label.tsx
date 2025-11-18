import { forwardRef } from 'react'
import { cn } from '../../lib/cn'
import type { LabelHTMLAttributes } from 'react'

export interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-sm font-medium text-[#0f1e3d]', className)}
      {...props}
    />
  ),
)
Label.displayName = 'Label'
