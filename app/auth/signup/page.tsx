'use client'

import React, { useState, FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const getRedirectUrl = () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    return `${siteUrl}/auth/callback`
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' })
      return
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getRedirectUrl(),
        },
      })

      if (error) {
        throw error
      }

      setMessage({ 
        type: 'success', 
        text: 'Vérifiez votre email pour confirmer votre compte.' 
      })
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      console.error('Signup error:', error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Une erreur est survenue lors de la création du compte' 
      })
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
              <h1 className="text-2xl lg:text-3xl font-extrabold mb-2">Créer un compte</h1>
              <p className="text-sm text-text-soft">Rejoignez FLAZY et commencez à générer vos vidéos</p>
            </div>

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

              <div>
                <label htmlFor="password" className="block text-xs text-text-soft mb-2 font-medium">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-[rgba(75,85,99,0.95)] bg-[rgba(15,23,42,0.96)] text-text-main px-4 py-3 pr-12 text-[13px] outline-none transition-all duration-[0.18s] ease-out placeholder:text-text-muted focus:border-accent-orange-soft focus:shadow-[0_0_0_1px_rgba(248,181,86,0.6)] focus:bg-[rgba(15,23,42,0.98)]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs text-text-soft mb-2 font-medium">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-[rgba(75,85,99,0.95)] bg-[rgba(15,23,42,0.96)] text-text-main px-4 py-3 pr-12 text-[13px] outline-none transition-all duration-[0.18s] ease-out placeholder:text-text-muted focus:border-accent-orange-soft focus:shadow-[0_0_0_1px_rgba(248,181,86,0.6)] focus:bg-[rgba(15,23,42,0.98)]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors p-1"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden bg-transparent text-[#000] shadow-[0_18px_45px_rgba(0,0,0,0.75)] z-0 rounded-full border-none text-[13px] font-semibold px-6 py-3 h-[42px] inline-flex items-center justify-center gap-2 transition-all duration-[0.18s] ease-out hover:-translate-y-px hover:shadow-[0_22px_60px_rgba(0,0,0,0.95)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  position: 'relative',
                }}
              >
                <span className="absolute inset-0 -z-10 rounded-full" style={{
                  backgroundImage: 'linear-gradient(90deg, #ff6b00 0%, #ffd700 50%, #ff5a1f 100%)'
                }}></span>
                {isLoading ? 'Création en cours...' : 'Créer mon compte'}
              </button>
            </form>

            {message && (
              <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.6)] text-[#86efac]'
                  : 'bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.6)] text-[#fecaca]'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-xs">{message.text}</span>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-xs text-text-muted">
                Déjà un compte ?{' '}
                <Link href="/auth/login" className="text-accent-orange-soft hover:text-accent-orange font-semibold transition-colors">
                  Se connecter
                </Link>
              </p>
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

