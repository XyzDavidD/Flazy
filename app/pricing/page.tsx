'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useCredits } from '@/hooks/useCredits'
import { useTranslation } from '@/lib/translations/context'
import { t, type Language } from '@/lib/translations/dictionary'
import {
  Sparkles,
  Users,
  TrendingUp,
  Rocket,
  Lock,
  Shield,
  Loader2,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  ChevronLeft,
  Globe,
  CheckCircle2,
} from 'lucide-react'

// Header Component (same as FAQ page)
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  
  const { credits, loading: creditsLoading } = useCredits()
  
  // Use translation context
  const { language: currentLanguage, setLanguage, isLoading: isTranslating } = useTranslation()

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ]

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]

  const handleLanguageChange = (langCode: 'fr' | 'en' | 'es') => {
    setLanguage(langCode)
    setLanguageDropdownOpen(false)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.language-dropdown') && !target.closest('.account-dropdown')) {
        setLanguageDropdownOpen(false)
        setAccountDropdownOpen(false)
      }
    }

    if (languageDropdownOpen || accountDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [languageDropdownOpen, accountDropdownOpen])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
      setIsLoadingAuth(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
      setIsLoadingAuth(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setAccountDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-[18px] bg-gradient-to-b from-[rgba(5,6,18,0.96)] to-[rgba(5,6,18,0.9)] border-b border-[rgba(51,65,85,0.85)]">
      <nav className="relative flex items-center justify-between py-[14px] px-5 max-w-[1120px] mx-auto flex-wrap">
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

        <div className="hidden lg:flex items-center gap-[18px] text-[13px] text-text-muted absolute left-1/2 -translate-x-1/2">
          <Link
            href="/carousel"
            className="relative cursor-pointer transition-colors duration-[0.18s] ease-out hover:text-text-main after:content-[''] after:absolute after:left-0 after:-bottom-[6px] after:w-0 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#ffb347] after:via-[#ff8a1f] after:to-[#ff4b2b] after:transition-all after:duration-[0.18s] after:ease-out hover:after:w-[18px]"
          >
            Carrousel
          </Link>
          <Link
            href="/pricing"
            className="relative cursor-pointer transition-colors duration-[0.18s] ease-out hover:text-text-main after:content-[''] after:absolute after:left-0 after:-bottom-[6px] after:w-0 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#ffb347] after:via-[#ff8a1f] after:to-[#ff4b2b] after:transition-all after:duration-[0.18s] after:ease-out hover:after:w-[18px]"
          >
            Tarifs
          </Link>
          <Link
            href="/faq"
            className="relative cursor-pointer transition-colors duration-[0.18s] ease-out hover:text-text-main after:content-[''] after:absolute after:left-0 after:-bottom-[6px] after:w-0 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#ffb347] after:via-[#ff8a1f] after:to-[#ff4b2b] after:transition-all after:duration-[0.18s] after:ease-out hover:after:w-[18px]"
          >
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector - Compact */}
          <div className="hidden sm:block relative language-dropdown" data-no-translate>
            <button
              onClick={() => {
                setLanguageDropdownOpen(!languageDropdownOpen)
                setAccountDropdownOpen(false)
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[rgba(148,163,184,0.7)] bg-transparent text-text-soft text-[13px] font-medium transition-all duration-[0.18s] ease-out hover:bg-[rgba(15,23,42,0.9)] hover:text-text-main hover:border-[rgba(203,213,225,0.9)]"
              aria-label="Select language"
              disabled={isTranslating}
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              {isTranslating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''}`} />
              )}
            </button>
            {languageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[rgba(6,9,22,0.98)] border border-[rgba(252,211,77,0.75)] shadow-lg overflow-hidden z-50" data-no-translate>
                {languages.filter(lang => lang.code !== currentLanguage).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code as 'fr' | 'en' | 'es')}
                    disabled={isTranslating}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2.5 ${
                      'text-text-soft hover:bg-[rgba(15,23,42,0.5)] hover:text-text-main'
                    } ${isTranslating ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {!isLoadingAuth && (
            <>
              {user ? (
                <>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-text-soft text-[12px] font-medium">
                    <span className="text-accent-orange-soft font-semibold">
                      {creditsLoading ? '—' : (credits ?? 0)}
                    </span>
                    <span>crédits</span>
                  </span>
                  <div className="hidden sm:block relative account-dropdown">
                    <button
                      onClick={() => {
                        setAccountDropdownOpen(!accountDropdownOpen)
                        setLanguageDropdownOpen(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(148,163,184,0.7)] bg-transparent text-text-soft text-[13px] font-semibold transition-all duration-[0.18s] ease-out hover:bg-[rgba(15,23,42,0.9)] hover:text-text-main hover:border-[rgba(203,213,225,0.9)]"
                    >
                      <User className="w-4 h-4" />
                      Mon compte
                      <ChevronDown className={`w-3 h-3 transition-transform ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {accountDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[rgba(6,9,22,0.98)] border border-[rgba(252,211,77,0.75)] shadow-lg overflow-hidden z-50">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-sm text-text-soft hover:bg-[rgba(15,23,42,0.5)] transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Se déconnecter
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="hidden sm:flex items-center justify-center px-4 py-2 rounded-full border border-[rgba(148,163,184,0.7)] bg-transparent text-text-soft text-[13px] font-semibold transition-all duration-[0.18s] ease-out hover:bg-[rgba(15,23,42,0.9)] hover:text-text-main hover:border-[rgba(203,213,225,0.9)]"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="hidden sm:flex items-center justify-center px-4 py-2 rounded-full border border-[rgba(148,163,184,0.7)] bg-transparent text-text-soft text-[13px] font-semibold transition-all duration-[0.18s] ease-out hover:bg-[rgba(15,23,42,0.9)] hover:text-text-main hover:border-[rgba(203,213,225,0.9)]"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-text-soft touch-manipulation z-50 relative"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden pb-4 px-5 space-y-1 border-t border-[rgba(51,65,85,0.5)] pt-4 relative z-50">
          <div className="space-y-1 mb-3">
            <Link
              href="/carousel"
              className="block w-full text-left px-4 py-2.5 text-sm text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.5)] rounded-lg transition-colors touch-manipulation"
              onClick={(e) => {
                setMobileMenuOpen(false)
                e.stopPropagation()
              }}
            >
              Carrousel
            </Link>
            <Link
              href="/pricing"
              className="block w-full text-left px-4 py-2.5 text-sm text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.5)] rounded-lg transition-colors touch-manipulation"
              onClick={(e) => {
                setMobileMenuOpen(false)
                e.stopPropagation()
              }}
            >
              Tarifs
            </Link>
            <Link
              href="/faq"
              className="block w-full text-left px-4 py-2.5 text-sm text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.5)] rounded-lg transition-colors touch-manipulation"
              onClick={(e) => {
                setMobileMenuOpen(false)
                e.stopPropagation()
              }}
            >
              FAQ
            </Link>
          </div>

          {/* Language Selector - Mobile */}
          <div className="border-t border-[rgba(51,65,85,0.5)] pt-3 mt-3" data-no-translate>
            <div className="px-4 py-2 text-xs text-text-muted mb-2">Langue / Language / Idioma</div>
            <div className="space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    handleLanguageChange(lang.code as 'fr' | 'en' | 'es')
                    setMobileMenuOpen(false)
                  }}
                  disabled={isTranslating}
                  className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors flex items-center gap-3 touch-manipulation ${
                    currentLanguage === lang.code
                      ? 'bg-[rgba(252,211,77,0.15)] text-text-main'
                      : 'text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.5)]'
                  } ${isTranslating ? 'opacity-50 cursor-wait' : ''}`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {currentLanguage === lang.code && (
                    <CheckCircle2 className="w-4 h-4 ml-auto text-accent-orange-soft" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="border-t border-[rgba(51,65,85,0.5)] pt-3 mt-3">
            {user ? (
              <>
                <div className="px-4 py-2 flex items-center gap-1.5 text-text-soft text-sm mb-2">
                  <span className="text-accent-orange-soft font-semibold">
                    {creditsLoading ? '—' : (credits ?? 0)}
                  </span>
                  <span>crédits</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2.5 text-sm text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.5)] rounded-lg transition-colors flex items-center gap-2 touch-manipulation"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/auth/login"
                  className="block w-full text-left px-4 py-2.5 text-sm text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.5)] rounded-lg transition-colors touch-manipulation"
                  onClick={(e) => {
                    setMobileMenuOpen(false)
                    e.stopPropagation()
                  }}
                >
                  Se connecter
                </Link>
                <Link
                  href="/auth/signup"
                  className="block w-full text-left px-4 py-2.5 text-sm text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.5)] rounded-lg transition-colors touch-manipulation"
                  onClick={(e) => {
                    setMobileMenuOpen(false)
                    e.stopPropagation()
                  }}
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

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
        radial-gradient(circle 800px at top right, rgba(255, 138, 31, 0.4), transparent),
        radial-gradient(circle 600px at bottom left, rgba(56, 189, 248, 0.22), transparent),
        radial-gradient(circle 800px at bottom right, rgba(129, 140, 248, 0.4), transparent),
        #020314
      `,
      backgroundAttachment: 'fixed'
    }}>
      <Header />
      <div className="max-w-[1120px] mx-auto px-5 pt-4 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[rgba(148,163,184,0.7)] bg-[rgba(15,23,42,0.5)] backdrop-blur-sm text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.8)] hover:border-[rgba(203,213,225,0.9)] transition-all duration-[0.18s] ease-out text-sm font-semibold group touch-manipulation"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Retour à l'accueil</span>
          <span className="sm:hidden">Retour</span>
        </Link>
      </div>
      {/* Main Content */}
      <main className="py-12 md:py-16">
        <div className="max-w-[1120px] mx-auto px-5">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-[11px] uppercase tracking-[0.16em] mb-1.5 font-semibold text-accent-orange">
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
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-br from-[#ff6b00] via-[#ffd700] to-[#ff4b2b] text-[#111827] text-[11px] font-bold uppercase tracking-wide px-4 py-1.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.5)] whitespace-nowrap">
                        Le plus populaire
                      </div>
                    </div>
                  )}
                  <div
                    className={`rounded-[22px] p-4 md:p-5 border shadow-[0_18px_40px_rgba(0,0,0,0.8)] flex flex-col h-full hover:border-[rgba(252,211,77,1)] transition-all duration-300 ${
                      plan.recommended 
                        ? 'border-2 border-[rgba(252,211,77,1)]' 
                        : 'border border-[rgba(252,211,77,0.95)]'
                    }`}
                    style={{
                      background: `
                        radial-gradient(circle at top, rgba(255, 138, 31, ${plan.recommended ? '0.25' : '0.18'}), transparent 60%),
                        rgba(6, 9, 22, 0.98)
                      `
                    }}
                  >
                    {/* Header section with fixed height for consistent alignment - same for all cards */}
                    <div className="flex items-start justify-between gap-2 mb-3 min-h-[2.5rem] mt-2">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-accent-orange-soft font-semibold leading-tight flex-1">
                        {plan.badge}
                      </div>
                      <Icon className="w-4 h-4 text-accent-orange-soft opacity-60 flex-shrink-0 mt-0.5" />
                    </div>
                    
                    {/* Content section */}
                    <div className="space-y-1.5 mb-4">
                      <div className="text-[13px] text-text-soft font-medium">{plan.name}</div>
                      <div className="text-[11px] text-text-muted">Aucun abonnement requis</div>
                    </div>
                    
                    {/* Bottom section with price and button */}
                    <div className="mt-auto pt-2 space-y-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xl font-bold text-text-main">{plan.price}</span>
                        {plan.offer && (
                          <span className="text-[11px] px-2 py-1 rounded-full bg-[rgba(22,163,74,0.18)] border border-[rgba(22,163,74,0.8)] text-[#bbf7d0]">
                            {plan.offer}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleChoosePack(plan.pack)}
                        disabled={isProcessing === plan.pack || isLoading}
                        className="w-full bg-transparent text-accent-orange-soft border border-[rgba(248,181,86,0.95)] shadow-[0_0_0_1px_rgba(248,181,86,0.4)] rounded-full text-[11px] font-medium px-3 py-1.5 cursor-pointer inline-flex items-center justify-center gap-1.5 transition-all duration-[0.18s] ease-out hover:bg-[radial-gradient(circle_at_top_left,rgba(255,138,31,0.16),transparent_70%)] hover:border-[rgba(248,181,86,1)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isProcessing === plan.pack ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Chargement...</span>
                          </>
                        ) : (
                          'Sélectionner'
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

