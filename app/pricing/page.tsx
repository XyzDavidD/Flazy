'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import {
  Sparkles,
  Users,
  TrendingUp,
  Rocket,
  Lock,
  Shield,
  Loader2,
} from 'lucide-react'

export default function PricingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const pricingPlans = [
    {
      badge: 'Pack Starter',
      name: '5 tokens',
      oldPrice: '',
      price: '€19.90',
      offer: '',
      desc: 'Idéal pour tester la plateforme et générer vos premières vidéos IA.',
      icon: Sparkles,
      recommended: false,
      pack: 'starter' as const,
    },
    {
      badge: 'Pack Creator',
      name: '10 tokens',
      oldPrice: '',
      price: '€34.90',
      offer: '',
      desc: 'Parfait pour publier régulièrement et tester différents formats.',
      icon: Users,
      recommended: true,
      pack: 'creator' as const,
    },
    {
      badge: 'Pack Pro',
      name: '25 tokens',
      oldPrice: '',
      price: '€74.90',
      offer: '',
      desc: 'Conçu pour les créateurs avancés, les entreprises et les agences.',
      icon: TrendingUp,
      recommended: false,
      pack: 'pro' as const,
    },
    {
      badge: 'Pack Boost',
      name: '50 tokens',
      oldPrice: '',
      offer: '',
      price: '€139.90',
      desc: 'Meilleur rapport qualité-prix pour les créateurs à fort volume et les équipes.',
      icon: Rocket,
      recommended: false,
      pack: 'boost' as const,
    },
  ]

  const handleChoosePack = async (pack: 'starter' | 'creator' | 'pro' | 'boost') => {
    if (!user) {
      router.push('/auth/signup')
      return
    }

    setIsProcessing(pack)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ pack }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Show friendly French error message
        const errorMessage = data.error || 'Une erreur est survenue lors de la création de la session de paiement. Veuillez réessayer plus tard.'
        alert(errorMessage)
        setIsProcessing(null)
        return
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('URL de paiement non disponible. Veuillez réessayer.')
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Une erreur est survenue. Veuillez réessayer plus tard.'
      alert(errorMessage)
      setIsProcessing(null)
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
          <div className="flex items-center gap-3">
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
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/auth/signup"
              className="hidden sm:flex items-center justify-center px-4 py-2 rounded-full border border-[rgba(148,163,184,0.7)] bg-transparent text-text-soft text-[13px] font-semibold transition-all duration-[0.18s] ease-out hover:bg-[rgba(15,23,42,0.9)] hover:text-text-main hover:border-[rgba(203,213,225,0.9)]"
            >
              S'inscrire
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="py-12 md:py-16">
        <div className="max-w-[1120px] mx-auto px-5">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-[11px] uppercase tracking-[0.16em] mb-1.5 font-semibold bg-gradient-to-r from-[#ffb347] via-[#ff8a1f] to-[#ff4b2b] bg-clip-text text-transparent">
              Tarifs
            </div>
            <h1 className="text-[32px] lg:text-[42px] mb-4 font-extrabold leading-tight">
              Choisissez le pack qui correspond à votre rythme
            </h1>
            <p className="text-[14px] lg:text-[16px] text-text-soft max-w-[600px] mx-auto leading-relaxed">
              Des packs attractifs et adaptés à tous les niveaux.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {pricingPlans.map((plan, i) => {
              const Icon = plan.icon
              return (
                <div key={i} className="relative flex flex-col h-full">
                  {plan.recommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-br from-[#ff6b00] via-[#ffd700] to-[#ff4b2b] text-[#111827] text-[12px] font-bold uppercase tracking-wide px-5 py-2 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.5)] whitespace-nowrap">
                        Le plus populaire
                      </div>
                    </div>
                  )}
                  <div
                    className={`rounded-[22px] p-5 border shadow-[0_18px_40px_rgba(0,0,0,0.8)] flex flex-col gap-3 h-full hover:border-[rgba(252,211,77,1)] transition-all duration-300 ${
                      plan.recommended 
                        ? 'border-2 border-[rgba(252,211,77,1)] pt-7' 
                        : 'border border-[rgba(252,211,77,0.95)]'
                    }`}
                    style={{
                      background: `
                        radial-gradient(circle at top, rgba(255, 138, 31, ${plan.recommended ? '0.25' : '0.18'}), transparent 60%),
                        rgba(6, 9, 22, 0.98)
                      `
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-accent-orange-soft font-semibold flex-1 leading-tight">
                        {plan.badge}
                      </div>
                      <Icon className="w-5 h-5 text-accent-orange-soft opacity-60 flex-shrink-0" />
                    </div>
                    <div className="text-[13px] text-text-soft">{plan.name}</div>
                    <div className="text-[10px] text-text-muted italic">
                      1 token = 1 génération
                    </div>
                    {plan.oldPrice && (
                      <div className="text-xs text-text-muted line-through">{plan.oldPrice}</div>
                    )}
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-2xl font-bold text-text-main">{plan.price}</span>
                      {plan.offer && (
                        <span className="text-[11px] px-2 py-1 rounded-full bg-[rgba(22,163,74,0.18)] border border-[rgba(22,163,74,0.8)] text-[#bbf7d0]">
                          {plan.offer}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-soft flex-grow leading-relaxed">{plan.desc}</p>
                    <div className="mt-auto pt-2">
                      <button
                        onClick={() => handleChoosePack(plan.pack)}
                        disabled={isProcessing === plan.pack || isLoading}
                        className="w-full bg-transparent text-accent-orange-soft border border-[rgba(248,181,86,0.95)] shadow-[0_0_0_1px_rgba(248,181,86,0.4)] rounded-full text-[13px] font-semibold px-4 py-2.5 cursor-pointer inline-flex items-center justify-center gap-2 transition-all duration-[0.18s] ease-out hover:bg-[radial-gradient(circle_at_top_left,rgba(255,138,31,0.16),transparent_70%)] hover:border-[rgba(248,181,86,1)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isProcessing === plan.pack ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Chargement...</span>
                          </>
                        ) : (
                          'Choisir ce pack'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-[rgba(51,65,85,0.3)]">
            <div className="flex items-center gap-2 text-text-soft text-xs">
              <Lock className="w-4 h-4 text-accent-orange-soft" />
              <span>Paiement sécurisé SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/stripe.svg.png"
                alt="Stripe - Paiement sécurisé"
                width={60}
                height={24}
                className="h-6 w-auto opacity-80"
              />
            </div>
            <div className="flex items-center gap-2 text-text-soft text-xs">
              <Shield className="w-4 h-4 text-accent-orange-soft" />
              <span>Données protégées</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

