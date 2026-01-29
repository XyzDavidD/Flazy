'use client'

import React, { useState, FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { Lock } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getRedirectUrl = () => {
    if (typeof window === 'undefined') return 'http://localhost:3000/auth/reset-password'
    const isDev = window.location.hostname === 'localhost'
    return isDev 
      ? 'http://localhost:3000/auth/reset-password'
      : 'https://www.flazy.app/auth/reset-password'
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getRedirectUrl(),
      })

      if (resetError) {
        throw resetError
      }

      setIsSubmitted(true)
    } catch (err: any) {
      console.error('Reset password error:', err)
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{
      background: `
        radial-gradient(circle at top right, rgba(255, 138, 31, 0.4), transparent 58%),
        radial-gradient(circle at bottom left, rgba(56, 189, 248, 0.22), transparent 60%),
        radial-gradient(circle at bottom right, rgba(129, 140, 248, 0.4), transparent 58%),
        #020314
      `
    }}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-[18px] bg-gradient-to-b from-[rgba(5,6,18,0.96)] to-[rgba(5,6,18,0.9)] border-b border-[rgba(51,65,85,0.85)]">
        <nav className="relative flex items-center justify-between py-[14px] px-5 max-w-[1120px] mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="FLAZY Logo"
              width={48}
              height={48}
              className="w-10 h-10 md:w-12 md:h-12"
              priority
            />
            <div>
              <div className="font-extrabold tracking-[0.08em] uppercase text-[15px]">FLAZY</div>
              <div className="text-[11px] text-text-muted">Vidéos IA virales prêtes à poster</div>
            </div>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-5">
        <div className="w-full max-w-md">
          <div className="bg-[rgba(6,9,22,0.98)] rounded-[22px] p-8 border border-[rgba(252,211,77,0.75)] shadow-[0_18px_40px_rgba(0,0,0,0.8)]"
            style={{
              background: `
                radial-gradient(circle at top, rgba(255, 138, 31, 0.22), transparent 60%),
                rgba(6, 9, 22, 0.98)
              `
            }}
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-extrabold mb-2">Mot de passe oublié</h1>
              <p className="text-sm text-text-soft">
                {isSubmitted 
                  ? 'Vérifiez votre boîte de réception'
                  : 'Entrez votre email pour recevoir un lien de réinitialisation'
                }
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-xs text-text-soft mb-2 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-[rgba(75,85,99,0.95)] bg-[rgba(15,23,42,0.96)] text-text-main px-4 py-3 text-[13px] outline-none transition-all duration-[0.18s] ease-out placeholder:text-text-muted focus:border-accent-orange-soft focus:shadow-[0_0_0_1px_rgba(248,181,86,0.6)] focus:bg-[rgba(15,23,42,0.98)]"
                    placeholder="votre@email.com"
                  />
                </div>

                <p className="text-xs text-text-muted text-center">
                  Vous recevrez un email pour réinitialiser votre mot de passe.
                </p>

                {error && (
                  <div className="p-3 rounded-xl bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.6)] text-[#fecaca] text-xs">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative overflow-hidden bg-transparent text-white shadow-[0_18px_45px_rgba(0,0,0,0.75)] z-0 rounded-full border-none text-[13px] font-semibold px-6 py-3 h-[42px] inline-flex items-center justify-center gap-2 transition-all duration-[0.18s] ease-out hover:-translate-y-px hover:shadow-[0_22px_60px_rgba(0,0,0,0.95)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  style={{
                    position: 'relative',
                  }}
                >
                  <span className="absolute inset-0 -z-10 rounded-full" style={{
                    backgroundColor: '#ff8a1f'
                  }}></span>
                  {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-5">
                <div className="w-16 h-16 mx-auto rounded-full bg-[rgba(34,197,94,0.2)] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-text-soft">
                  Un email de réinitialisation a été envoyé à <strong className="text-text-main">{email}</strong>
                </p>
                <p className="text-xs text-text-muted">
                  Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-xs text-accent-orange-soft hover:text-accent-orange font-semibold transition-colors"
              >
                ← Retour à la connexion
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-[rgba(51,65,85,0.3)] flex items-center justify-center gap-2 text-xs text-text-muted">
              <Lock className="w-3 h-3" />
              <span>Vos données sont sécurisées</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

