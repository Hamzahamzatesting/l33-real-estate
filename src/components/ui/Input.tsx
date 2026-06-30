import { cn } from '@/lib/utils'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[11px] font-semibold text-stone-500 tracking-[0.15em] uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 border bg-white text-sm text-[#0a0a0a] placeholder-stone-300 focus:outline-none focus:border-[#c9a84c] transition-colors duration-200',
            error ? 'border-red-300' : 'border-stone-200',
            className
          )}
          {...props}
        />
        {error && <p className="text-[11px] text-red-500 mt-0.5">{error}</p>}
        {helperText && !error && <p className="text-[11px] text-stone-400 mt-0.5">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
