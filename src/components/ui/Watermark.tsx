import { cn } from '@/lib/utils'

export default function Watermark({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 select-none', className)}
      style={{
        backgroundImage: "url('/logo.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: '140px auto',
        opacity: 0.14,
      }}
    />
  )
}
