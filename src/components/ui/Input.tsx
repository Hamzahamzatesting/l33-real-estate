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
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-brand-black tracking-wide"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 border text-sm text-brand-black placeholder-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-colors duration-200',
            error
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
              : 'border-stone-300',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600 mt-0.5">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-brand-gray mt-0.5">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
