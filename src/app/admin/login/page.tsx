'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/layout/Logo'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Invalid email or password.')
      setIsLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left: Branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-14 border-r border-white/5">
        <Logo size="md" />

        <div>
          <p className="text-white/10 text-[10px] tracking-[0.4em] uppercase mb-6">Admin Portal</p>
          <h1 className="font-heading text-5xl font-bold text-white leading-tight tracking-tight mb-6">
            Manage your
            <br />
            <em className="text-[#c9a84c]">listings</em>
            <br />
            with ease.
          </h1>
          <p className="text-white/25 text-sm leading-relaxed max-w-xs">
            Add, edit, and publish properties in minutes. Keep your portfolio organized and your clients impressed.
          </p>
        </div>

        <p className="text-white/15 text-xs tracking-wider">
          © {new Date().getFullYear()} L33 Real Estate
        </p>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-12 text-center">
            <Logo size="lg" className="mx-auto" />
            <p className="text-white/30 text-xs tracking-[0.4em] uppercase mt-1">Admin</p>
          </div>

          <div className="mb-10">
            <h2 className="text-white text-2xl font-semibold tracking-tight mb-2">Welcome back</h2>
            <p className="text-white/30 text-sm">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-white/40 text-[11px] tracking-[0.25em] uppercase mb-2.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@l33.ma"
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3.5 placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/60 focus:bg-white/8 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/40 text-[11px] tracking-[0.25em] uppercase mb-2.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3.5 pr-12 placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/60 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="border border-red-500/20 bg-red-500/10 text-red-400 px-4 py-3 text-xs tracking-wide">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 bg-[#c9a84c] hover:bg-[#a8892e] text-white text-xs tracking-[0.25em] uppercase font-semibold py-4 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed mt-2 group"
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
