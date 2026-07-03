import Image from 'next/image'
import { cn } from '@/lib/utils'

const heightMap = {
  sm: 'h-14',
  md: 'h-16',
  lg: 'h-24',
}

interface LogoProps {
  size?: keyof typeof heightMap
  className?: string
}

export default function Logo({ size = 'md', className }: LogoProps) {
  return (
    <span
      className={cn('relative inline-block w-auto shrink-0', heightMap[size], className)}
      style={{ aspectRatio: '786 / 570' }}
    >
      <Image src="/logo.png" alt="L33 Real Estate" fill className="object-contain" priority />
    </span>
  )
}
