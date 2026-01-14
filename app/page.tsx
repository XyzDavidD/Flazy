'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { useCredits } from '@/hooks/useCredits'
import { useTranslation } from '@/lib/translations/context'
import {
  Zap,
  Lock,
  Shield,
  ChevronDown,
  Play,
  Pause,
  Menu,
  X,
  Sparkles,
  Video,
  CheckCircle2,
  TrendingUp,
  Users,
  Rocket,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Loader2,
  LogOut,
  User,
  Globe,
} from 'lucide-react'

// Top Bar Component
function TopBar() {
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    let countdownEnd = Date.now() + 24 * 60 * 60 * 1000

    const updateCountdown = () => {
      const diff = countdownEnd - Date.now()

      if (diff <= 0) {
        countdownEnd = Date.now() + 24 * 60 * 60 * 1000
      }

      const totalSeconds = Math.max(0, Math.floor((countdownEnd - Date.now()) / 1000))
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      const h = String(hours).padStart(2, '0')
      const m = String(minutes).padStart(2, '0')
      const s = String(seconds).padStart(2, '0')

      setCountdown(`${h} h ${m} min ${s} s`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center text-[#111827] text-[10px] sm:text-[13px] font-semibold py-[4px] sm:py-[6px] px-2 sm:px-4 text-center shadow-[0_1px_0_rgba(15,23,42,0.8)] min-h-[36px] sm:min-h-[34px] overflow-hidden" style={{
      backgroundImage: 'linear-gradient(90deg, #ff6b00 0%, #ffd700 25%, #ff4b2b 50%, #ffd700 75%, #ff6b00 100%)',
      backgroundSize: '220% 100%',
      animation: 'flazyTopbar 10s ease-in-out infinite alternate'
    }}>
      <span className="inline-flex items-center justify-center gap-1 sm:gap-2 flex-wrap sm:flex-nowrap max-w-full">
        <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
        <span className="whitespace-nowrap text-[10px] sm:text-[13px]">Offre spéciale FLAZY</span>
        <strong className="whitespace-nowrap text-[10px] sm:text-[13px]">40 % de réduction</strong>
        <span className="hidden sm:inline whitespace-nowrap">Offre valable encore</span>
        <span className="px-1.5 sm:px-2 py-[2px] rounded-full border border-[rgba(252,211,77,0.95)] bg-[rgba(15,23,42,0.95)] text-[#f9fafb] text-[9px] sm:text-[11px] shadow-[0_0_0_1px_rgba(252,211,77,0.35)] whitespace-nowrap flex-shrink-0">
          {countdown}
        </span>
      </span>
    </div>
  )
}

// Header Component
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  
  // Use new credits hook with realtime updates
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
    // Check auth state for user (for account dropdown)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
      setIsLoadingAuth(false)
    })

    // Listen for auth changes
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
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
          <div className="border-t border-[rgba(51,65,85,0.5)] pt-3 mt-3 language-dropdown" data-no-translate>
            <button
              onClick={() => {
                setLanguageDropdownOpen(!languageDropdownOpen)
              }}
              className="w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors flex items-center justify-between touch-manipulation text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.5)]"
              disabled={isTranslating}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{currentLang.flag}</span>
                <span>{currentLang.name}</span>
              </div>
              {isTranslating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''}`} />
              )}
            </button>
            {languageDropdownOpen && (
              <div className="mt-1 space-y-1" data-no-translate>
                {languages.filter(lang => lang.code !== currentLanguage).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang.code as 'fr' | 'en' | 'es')
                    }}
                    disabled={isTranslating}
                    className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors flex items-center gap-3 touch-manipulation ${
                      'text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.5)]'
                    } ${isTranslating ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
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

// Hero Component
function Hero() {
  const scrollToForm = () => {
    const element = document.getElementById('prompt-zone')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="hero mt-2 pb-0">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="flex justify-center">
          <div className="hero-left max-w-[700px] text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(15,23,42,0.9)] border border-[rgba(148,163,184,0.6)] text-text-soft text-xs mb-4">
              <span className="text-[#111827] rounded-full px-2.5 py-[3px] font-bold text-[11px] uppercase tracking-[0.08em] flex items-center gap-1" style={{
                backgroundImage: 'linear-gradient(90deg, #ff6b00 0%, #ffd700 25%, #ff4b2b 50%, #ffd700 75%, #ff6b00 100%)',
                backgroundSize: '220% 100%',
                animation: 'flazyTopbar 10s ease-in-out infinite alternate'
              }}>
                <Sparkles className="w-3 h-3" />
                Nouveau
              </span>
              <span>Générateur FLAZY maintenant disponible</span>
            </div>

            <h1 className="text-[34px] lg:text-[42px] leading-[1.08] mb-3.5 font-extrabold">
              <span>Générateur de </span>
              <span className="bg-gradient-to-br from-[#ffe29f] via-[#ffb347] via-[#ff8a1f] via-[#ff4b2b] to-[#ffe29f] bg-[length:220%_220%] animate-[flazyGradient_6s_ease-in-out_infinite_alternate] bg-clip-text text-transparent">
                Vidéos IA Virales & Monétisables
              </span>
            </h1>

            <p className="mb-6 text-text-soft text-sm lg:text-base max-w-[480px] mx-auto leading-relaxed">
              Transformez vos idées en vidéos de 10 secondes prêtes à poster sur TikTok, Reels Instagram et
              YouTube Shorts. Simple, rapide et efficace.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-4 justify-center">
              <button
                onClick={scrollToForm}
                className="relative overflow-hidden bg-transparent text-[#111827] shadow-[0_18px_45px_rgba(0,0,0,0.75)] z-0 rounded-full border-none text-[13px] font-semibold px-6 py-3 cursor-pointer inline-flex items-center gap-2 transition-all duration-[0.18s] ease-out hover:-translate-y-px hover:shadow-[0_22px_60px_rgba(0,0,0,0.95)]"
                style={{
                  position: 'relative',
                }}
              >
                <span className="absolute inset-0 -z-10 rounded-full" style={{
                  backgroundImage: 'linear-gradient(90deg, #ff6b00 0%, #ffd700 25%, #ff4b2b 50%, #ffd700 75%, #ff6b00 100%)',
                  backgroundSize: '220% 100%',
                  animation: 'flazyTopbar 10s ease-in-out infinite alternate'
                }}></span>
                <Video className="w-4 h-4" />
                Créer ma vidéo virale
              </button>

              <Link
                href="/carousel"
                className="bg-transparent text-white border border-[rgba(248,181,86,0.95)] shadow-[0_0_0_1px_rgba(248,181,86,0.4)] rounded-full text-[13px] font-semibold px-6 py-3 cursor-pointer inline-flex items-center gap-2 transition-all duration-[0.18s] ease-out hover:bg-[radial-gradient(circle_at_top_left,rgba(255,138,31,0.16),transparent_70%)] hover:border-[rgba(248,181,86,1)]"
              >
                Découvrir les créations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Features/Why Section
function FeaturesSection() {
  return (
    <section id="features" className="py-8 md:py-10 pb-2 md:pb-4">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-left mb-6 md:mb-8">
          <div className="text-[11px] uppercase tracking-[0.16em] mb-1.5 font-semibold text-accent-orange">
            Pourquoi choisir FLAZY
          </div>
          <h2 className="text-[28px] lg:text-[32px] mb-3 font-extrabold leading-tight">
            Des vidéos pensées pour la viralité prêtes à poster
          </h2>
          <p className="text-[14px] lg:text-[15px] text-text-soft max-w-[600px] leading-relaxed">
            FLAZY combine intelligence artificielle et formats courts pour créer des vidéos qui accrochent dès la
            première seconde.
          </p>
        </div>
      </div>
    </section>
  )
}

// Steps Section
function StepsSection() {
  return (
    <section id="steps" className="steps pt-8 md:pt-10 pb-2 md:pb-4">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-left mb-6 md:mb-8">
          <div className="text-[11px] uppercase tracking-[0.16em] mb-1.5 font-semibold text-accent-orange">
            Comment ça marche
          </div>
          <h2 className="text-[28px] lg:text-[32px] mb-3 font-extrabold leading-tight">
            En 3 étapes, vos vidéos IA sont prêtes à publier
          </h2>
          <p className="text-[14px] lg:text-[15px] text-text-soft max-w-[600px] leading-relaxed">
            Choisissez votre pack, décrivez la vidéo que vous voulez, et retrouvez vos vidéos prêtes à poster dans votre espace (Mes vidéos).
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {[
            {
              step: '1',
              title: 'Choisissez votre pack',
              text: 'Sélectionnez le pack Starter, Creator, Pro ou Boost selon le nombre de vidéos que vous souhaitez générer chaque mois.',
              icon: CheckCircle2,
            },
            {
              step: '2',
              title: 'Décrivez la vidéo que vous voulez',
              text: 'Écrivez un prompt simple : type de vidéo, ambiance, message, langue. FLAZY gère les hooks, le rythme et la structure.',
              icon: Video,
            },
            {
              step: '3',
              title: 'Retrouvez vos vidéos',
              text: 'Vos vidéos de 10 secondes sont disponibles dans votre espace (Mes vidéos), prêtes à poster sur TikTok, Reels Instagram ou YouTube Shorts. Format optimisé, aucun montage à faire.',
              icon: Rocket,
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
              key={item.step}
              className="rounded-[16px] p-3 md:p-4 border border-[rgba(252,211,77,0.65)] shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-[13px] text-text-soft hover:border-[rgba(252,211,77,0.9)] transition-all duration-300"
              style={{
                background: `
                  radial-gradient(circle at top left, rgba(255, 138, 31, 0.22), transparent 60%),
                  rgba(6, 9, 22, 0.98)
                `
              }}
            >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-accent-orange-soft flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] md:text-base m-0 text-text-main font-semibold mb-1.5 leading-tight">{item.title}</h3>
                    <p className="m-0 leading-relaxed text-[12px] md:text-[13px]">{item.text}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Form Section Component
function FormSection() {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [displayedGenerations, setDisplayedGenerations] = useState(5)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isActiveRef = useRef(true)

  // Use new credits hook with realtime updates
  const { credits, refresh: refreshCredits } = useCredits()

  // Check auth state for user (for form gating)
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

    return () => subscription.unsubscribe()
  }, [])

  // Simulate dynamic activity indicator
  useEffect(() => {
    isActiveRef.current = true
    
    const updateDisplay = () => {
      if (!isActiveRef.current) return
      const newNumber = Math.floor(Math.random() * 8) + 1
      setDisplayedGenerations(newNumber)
      const nextInterval = 3000 + Math.floor(Math.random() * 1000)
      timeoutRef.current = setTimeout(updateDisplay, nextInterval)
    }

    const initialDelay = 3000 + Math.floor(Math.random() * 1000)
    timeoutRef.current = setTimeout(updateDisplay, initialDelay)

    return () => {
      isActiveRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!prompt.trim()) {
      setError('Veuillez remplir le prompt.')
      return
    }

    if (!user) {
      setError('Vous devez être connecté pour générer une vidéo.')
      return
    }

    setIsLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }

      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      let res: Response
      try {
        res = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ prompt: prompt.trim() }),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          throw new Error('La requête a pris trop de temps. Vérifiez votre connexion internet et réessayez.')
        }
        if (fetchError.message?.includes('Failed to fetch') || fetchError.message?.includes('NetworkError')) {
          throw new Error('Erreur de connexion. Vérifiez votre connexion internet et réessayez.')
        }
        throw new Error('Erreur réseau. Veuillez réessayer dans quelques instants.')
      }

      // Check content type before parsing JSON
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text()
        console.error('Non-JSON response:', text.substring(0, 200))
        throw new Error('Erreur serveur inattendue. Veuillez réessayer ou contacter le support.')
      }

      let data: any
      try {
        data = await res.json()
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError)
        throw new Error('Erreur lors de la lecture de la réponse. Veuillez réessayer.')
      }

      if (!res.ok) {
        const errorMessage = data?.error || `Erreur ${res.status}: ${res.statusText}`
        throw new Error(errorMessage)
      }

      setSuccess(true)
      setPrompt('')
      
      // Realtime subscription will update credits automatically
      // Call refresh immediately as fallback (realtime might have a small delay)
      // Small delay ensures DB write is complete before refetching
      setTimeout(() => {
        refreshCredits().catch(console.error)
      }, 300)
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Une erreur est survenue. Veuillez réessayer.'
      setError(errorMessage)
      console.error('Form submission error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const isLocked = !user || (user && credits !== null && credits <= 0)
  const lockReason = !user 
    ? 'Créez un compte et choisissez un pack pour générer des vidéos.'
    : 'Choisissez un pack pour générer des vidéos.'

  return (
    <section className="prompt-section pt-10 md:pt-12 pb-2 md:pb-4">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-left mb-6 md:mb-8">
          <div className="text-[11px] uppercase tracking-[0.16em] mb-1.5 font-semibold text-accent-orange">
            Décrivez la vidéo que vous voulez
          </div>
          <h2 className="text-[28px] lg:text-[32px] mb-3 font-extrabold leading-tight">
            Vous écrivez le prompt, FLAZY s'occupe du reste
          </h2>
          <p className="text-[14px] lg:text-[15px] text-text-soft max-w-[600px] leading-relaxed">
            Donnez quelques indications simples et laissez FLAZY transformer vos idées en vidéos prêtes à poster.
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-[rgba(255,138,31,0.1)] border border-[rgba(255,138,31,0.3)]">
            <div className="relative flex items-center w-2 h-2">
              <div className="absolute w-2 h-2 bg-[#22c55e] rounded-full animate-pulse"></div>
              <div className="absolute w-2 h-2 bg-[#22c55e] rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-[13px] text-text-soft font-medium ml-2.5">
              <strong className="text-accent-orange-soft">{displayedGenerations}</strong>{' '}générations en cours
            </span>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.6)] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#86efac]" />
            <div>
              <p className="text-sm font-semibold text-[#86efac]">Prompt envoyé avec succès !</p>
              <p className="text-xs text-[#86efac] opacity-80">Votre prompt a été transmis. Crédits restants : {credits ?? 0}</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mb-6 p-4 rounded-xl bg-[rgba(255,138,31,0.1)] border border-[rgba(255,138,31,0.3)] flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-accent-orange-soft animate-spin" />
            <div>
              <p className="text-sm font-semibold text-text-main">Génération en cours...</p>
              <p className="text-xs text-text-soft">Votre prompt est en cours de traitement.</p>
            </div>
          </div>
        )}

        <div className="relative">
          {/* Locked Overlay - only show if locked */}
          {isLocked && !isLoadingAuth && (
            <div className="absolute inset-0 z-30 flex items-center justify-center rounded-[22px] backdrop-blur-sm bg-[rgba(0,0,0,0.3)]">
              <div className="bg-[rgba(6,9,22,0.98)] rounded-[22px] p-8 border-2 border-[rgba(252,211,77,0.8)] shadow-[0_18px_40px_rgba(0,0,0,0.9)] max-w-md mx-4 text-center">
                <Lock className="w-12 h-12 text-accent-orange-soft mx-auto mb-4" />
                <h3 className="text-2xl font-extrabold text-text-main mb-3">Accès réservé</h3>
                <p className="text-sm text-text-soft mb-6 leading-relaxed">
                  {lockReason}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {!user ? (
                    <>
                      <Link
                        href="/auth/signup"
                        className="relative overflow-hidden bg-transparent text-[#111827] shadow-[0_18px_45px_rgba(0,0,0,0.75)] z-0 rounded-full border-none text-[13px] font-semibold px-6 py-3 inline-flex items-center justify-center gap-2 transition-all duration-[0.18s] ease-out hover:-translate-y-px hover:shadow-[0_22px_60px_rgba(0,0,0,0.95)]"
                        style={{
                          position: 'relative',
                        }}
                      >
                        <span className="absolute inset-0 -z-10 rounded-full" style={{
                          backgroundImage: 'linear-gradient(90deg, #ff6b00 0%, #ffd700 25%, #ff4b2b 50%, #ffd700 75%, #ff6b00 100%)',
                          backgroundSize: '220% 100%',
                          animation: 'flazyTopbar 10s ease-in-out infinite alternate'
                        }}></span>
                        Créer un compte
                      </Link>
                      <Link
                        href="/pricing"
                        className="bg-transparent text-accent-orange-soft border border-[rgba(248,181,86,0.95)] shadow-[0_0_0_1px_rgba(248,181,86,0.4)] rounded-full text-[13px] font-semibold px-6 py-3 inline-flex items-center justify-center gap-2 transition-all duration-[0.18s] ease-out hover:bg-[radial-gradient(circle_at_top_left,rgba(255,138,31,0.16),transparent_70%)] hover:border-[rgba(248,181,86,1)]"
                      >
                        Voir les packs
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/pricing"
                      className="relative overflow-hidden bg-transparent text-[#111827] shadow-[0_18px_45px_rgba(0,0,0,0.75)] z-0 rounded-full border-none text-[13px] font-semibold px-6 py-3 inline-flex items-center justify-center gap-2 transition-all duration-[0.18s] ease-out hover:-translate-y-px hover:shadow-[0_22px_60px_rgba(0,0,0,0.95)]"
                      style={{
                        position: 'relative',
                      }}
                    >
                      <span className="absolute inset-0 -z-10 rounded-full" style={{
                        backgroundImage: 'linear-gradient(90deg, #ff6b00 0%, #ffd700 25%, #ff4b2b 50%, #ffd700 75%, #ff6b00 100%)',
                        backgroundSize: '220% 100%',
                        animation: 'flazyTopbar 10s ease-in-out infinite alternate'
                      }}></span>
                      Choisir un pack
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className={`grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-start ${isLocked ? 'pointer-events-none opacity-80' : ''}`}>
            <div
              id="prompt-zone"
              className="rounded-[22px] p-6 border border-[rgba(252,211,77,0.75)] shadow-[0_18px_40px_rgba(0,0,0,0.8)]"
              style={{
                background: `
                  radial-gradient(circle at top, rgba(255, 138, 31, 0.22), transparent 60%),
                  rgba(6, 9, 22, 0.98)
                `
              }}
            >
            <div className="text-xs text-text-soft mb-4 flex items-center gap-2">
              <Video className="w-4 h-4 text-accent-orange-soft" />
              <span className="font-semibold">Votre prompt</span>
            </div>

            <div className="space-y-4">

              <div>
                <label htmlFor="prompt" className="block text-xs text-text-soft mb-2 font-medium">
                  Décrivez votre vidéo
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  disabled={isLocked}
                  className="w-full min-h-[160px] resize-y rounded-2xl border border-[rgba(75,85,99,0.95)] bg-[rgba(15,23,42,0.96)] text-text-main px-4 py-3 text-[13px] outline-none transition-all duration-[0.18s] ease-out placeholder:text-text-muted focus:border-accent-orange-soft focus:shadow-[0_0_0_1px_rgba(248,181,86,0.6)] focus:bg-[rgba(15,23,42,0.98)] disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="« Une femme élégante explique comment elle a augmenté ses ventes grâce aux vidéos courtes générées par l'IA. »"
                  required
                />
              </div>

            </div>

            <div className="mt-4 flex items-center justify-end gap-4 text-[11px] text-text-muted">
              <button
                type="submit"
                disabled={isLoading}
                className="relative overflow-hidden bg-transparent text-[#111827] shadow-[0_18px_45px_rgba(0,0,0,0.75)] z-0 rounded-full border-none text-[13px] font-semibold px-[26px] py-3 h-[42px] inline-flex items-center justify-center gap-2 whitespace-nowrap text-center min-w-[140px] transition-all duration-[0.18s] ease-out hover:-translate-y-px hover:shadow-[0_22px_60px_rgba(0,0,0,0.95)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  position: 'relative',
                }}
              >
                <span className="absolute inset-0 -z-10 rounded-full" style={{
                  backgroundImage: 'linear-gradient(90deg, #ff6b00 0%, #ffd700 25%, #ff4b2b 50%, #ffd700 75%, #ff6b00 100%)',
                  backgroundSize: '220% 100%',
                  animation: 'flazyTopbar 10s ease-in-out infinite alternate'
                }}></span>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Génération en cours...</span>
                  </>
                ) : (
                  'Générer'
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 text-xs p-3 rounded-xl border border-[rgba(239,68,68,0.6)] bg-[rgba(239,68,68,0.15)] text-[#fecaca]">
                {error}
              </div>
            )}
          </div>

          <div className="text-[13px] text-text-soft">
            <div className="p-2.5 md:p-3 rounded-xl bg-[rgba(15,23,42,0.5)] border border-[rgba(51,65,85,0.3)]">
              <p className="text-xs text-text-muted leading-snug md:leading-relaxed m-0">
                Une fois votre prompt envoyé, la vidéo est générée automatiquement en quelques minutes.<br />
                Elle est disponible dans votre espace (Mes vidéos).
              </p>
            </div>
          </div>
        </form>
        </div>
      </div>
    </section>
  )
}

// Examples Section with Playable Videos
function ExamplesSection() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const [pausedIndex, setPausedIndex] = useState<number | null>(null)
  const [exampleVideos, setExampleVideos] = useState<any[]>([])
  const [isLoadingExamples, setIsLoadingExamples] = useState(true)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const setVideoRef = (index: number) => (el: HTMLVideoElement | null) => {
    videoRefs.current[index] = el
  }

  // Sync video play/pause state with video elements
  useEffect(() => {
    const videoElements = videoRefs.current
    
    const handlePlay = (index: number) => () => {
      setPlayingIndex(index)
      setPausedIndex(null)
    }
    
    const handlePause = (index: number) => () => {
      setPausedIndex(index)
      setPlayingIndex(null)
    }

    const cleanupFunctions: (() => void)[] = []

    videoElements.forEach((video, index) => {
      if (video) {
        const playHandler = handlePlay(index)
        const pauseHandler = handlePause(index)
        video.addEventListener('play', playHandler)
        video.addEventListener('pause', pauseHandler)
        
        // Disable remote playback (casting)
        if ('disableRemotePlayback' in video) {
          (video as any).disableRemotePlayback = true
        }
        
        cleanupFunctions.push(() => {
          video.removeEventListener('play', playHandler)
          video.removeEventListener('pause', pauseHandler)
        })
      }
    })

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [exampleVideos.length])
  
  // Prevent cast overlays from appearing
  useEffect(() => {
    const preventCastOverlay = () => {
      // Remove any cast buttons that might appear
      const castButtons = document.querySelectorAll('[data-cast-button], .cast-button, [aria-label*="Cast"]')
      castButtons.forEach(btn => {
        (btn as HTMLElement).style.display = 'none'
      })
      
      // Prevent remote playback on all videos
      const allVideos = document.querySelectorAll('video')
      allVideos.forEach(video => {
        if ('disableRemotePlayback' in video) {
          (video as any).disableRemotePlayback = true
        }
      })
    }
    
    // Run immediately and on interval to catch dynamically added elements
    preventCastOverlay()
    const interval = setInterval(preventCastOverlay, 500)
    
    return () => clearInterval(interval)
  }, [])

  // Fetch example videos from database - same pattern as carousel
  useEffect(() => {
    const fetchExampleVideos = async () => {
      try {
        setIsLoadingExamples(true)

        const { data, error } = await supabase
          .from('example_videos')
          .select('*')
          .order('position', { ascending: true })

        if (error) {
          console.error('Error fetching example videos:', error)
          // Fallback to defaults on error
          setExampleVideos([
            { title: 'Actualité', desc: 'Formats réalistes inspirés des médias et de l\'actualité.', videoUrl: '/placeholder.mp4', icon: Video },
            { title: 'Preuve', desc: 'Vidéos UGC et témoignages authentiques.', videoUrl: '/placeholder.mp4', icon: Users },
            { title: 'Publicité', desc: 'Vidéos publicitaires orientées conversion.', videoUrl: '/placeholder.mp4', icon: Rocket },
            { title: 'Viral', desc: 'Formats créatifs pensés pour la viralité.', videoUrl: '/placeholder.mp4', icon: Sparkles },
          ])
          return
        }

        // Create array with 4 positions, fill with defaults if missing
        const defaultTitles = ['Actualité', 'Preuve', 'Publicité', 'Viral']
        const defaultDescs = [
          'Formats réalistes inspirés des médias et de l\'actualité.',
          'Vidéos UGC et témoignages authentiques.',
          'Vidéos publicitaires orientées conversion.',
          'Formats créatifs pensés pour la viralité.',
        ]
        const defaultIcons = [Video, Users, Rocket, Sparkles]

        const videosByPosition: any[] = []
        for (let i = 0; i < 4; i++) {
          const video = data?.find((v: any) => v.position === i + 1)
          if (video && video.video_path) {
            const { data: urlData } = supabase.storage
              .from('videos')
              .getPublicUrl(video.video_path)
            
            videosByPosition.push({
              title: defaultTitles[i], // Always use the new shorter titles
              desc: video.description || defaultDescs[i],
              videoUrl: urlData.publicUrl,
              icon: defaultIcons[i] || Video,
            })
          } else {
            // Fallback to default if no video at this position
            videosByPosition.push({
              title: defaultTitles[i],
              desc: defaultDescs[i],
              videoUrl: '/placeholder.mp4',
              icon: defaultIcons[i] || Video,
            })
          }
        }

        setExampleVideos(videosByPosition)
      } catch (error) {
        console.error('Error fetching example videos:', error)
        // Fallback to defaults on error
        setExampleVideos([
          { title: 'Actualité', desc: 'Formats réalistes inspirés des médias et de l\'actualité.', videoUrl: '/placeholder.mp4', icon: Video },
          { title: 'Preuve', desc: 'Vidéos UGC et témoignages authentiques.', videoUrl: '/placeholder.mp4', icon: Users },
          { title: 'Publicité', desc: 'Vidéos publicitaires orientées conversion.', videoUrl: '/placeholder.mp4', icon: Rocket },
          { title: 'Viral', desc: 'Formats créatifs pensés pour la viralité.', videoUrl: '/placeholder.mp4', icon: Sparkles },
        ])
      } finally {
        setIsLoadingExamples(false)
      }
    }

    fetchExampleVideos()
  }, [])

  const examples = exampleVideos.length > 0 ? exampleVideos : [
    {
      title: 'Actualité',
      desc: 'Formats réalistes inspirés des médias et de l\'actualité.',
      icon: Video,
      videoUrl: '/placeholder.mp4',
    },
    {
      title: 'Preuve',
      desc: 'Vidéos UGC et témoignages authentiques.',
      icon: Users,
      videoUrl: '/placeholder.mp4',
    },
    {
      title: 'Publicité',
      desc: 'Vidéos publicitaires orientées conversion.',
      icon: Rocket,
      videoUrl: '/placeholder.mp4',
    },
    {
      title: 'Viral',
      desc: 'Formats créatifs pensés pour la viralité.',
      icon: Sparkles,
      videoUrl: '/placeholder.mp4',
    },
  ]

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index]
    if (!video) return

    // If video is currently playing, pause it
    if (playingIndex === index) {
      video.pause()
      // State will be updated by event listeners
    } else {
      // Pause all other videos and reset their state
      videoRefs.current.forEach((v, i) => {
        if (v && i !== index) {
          v.pause()
          v.currentTime = 0
          if (playingIndex === i) {
            setPlayingIndex(null)
          }
          if (pausedIndex === i) {
            setPausedIndex(null)
          }
        }
      })
      // Play the clicked video
      video.play()
      // State will be updated by event listeners
    }
  }

  return (
    <section id="examples" className="py-8 md:py-10 pb-2 md:pb-4">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-left mb-6 md:mb-8">
          <div className="text-[11px] uppercase tracking-[0.16em] mb-1.5 font-semibold text-accent-orange">
            Exemples de vidéos virales
          </div>
          <h2 className="text-[28px] lg:text-[32px] mb-3 font-extrabold leading-tight">
            Aperçu des vidéos que vous pouvez générer avec FLAZY
          </h2>
          <p className="text-[14px] lg:text-[15px] text-text-soft max-w-[600px] leading-relaxed">
            Chaque exemple ci-dessous illustre un type de vidéo que vous pouvez générer avec FLAZY.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {examples.map((example, i) => {
            const Icon = example.icon
            return (
              <div
              key={i}
              className="rounded-[16px] p-2.5 border border-[rgba(252,211,77,0.85)] shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-xs text-text-soft hover:border-[rgba(252,211,77,1)] transition-all duration-300 flex flex-col"
              style={{
                background: `
                  radial-gradient(circle at top, rgba(255, 138, 31, 0.16), transparent 60%),
                  rgba(6, 9, 22, 0.98)
                `
              }}
            >
                <div
                  className="relative rounded-xl overflow-hidden border border-[rgba(252,211,77,0.7)] aspect-[9/16] w-full mb-2 bg-[#020617] cursor-pointer group flex-shrink-0"
                  onClick={() => handleVideoClick(i)}
                >
                  <video
                    ref={setVideoRef(i)}
                    src={example.videoUrl || '/placeholder.mp4'}
                    loop
                    playsInline
                    disablePictureInPicture
                    controlsList="nodownload nofullscreen noremoteplayback"
                    className="w-full h-full block object-cover"
                  />
                  {/* Play icon - visible at start (when not playing) or when paused */}
                  {playingIndex !== i && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="relative w-10 h-10 rounded-full flex items-center justify-center">
                        {/* Outer glow */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff8a1f] via-[#ffd700] to-[#ff4b2b] opacity-50 blur-md"></div>
                        {/* Main button */}
                        <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[rgba(15,23,42,0.98)] via-[rgba(15,23,42,0.95)] to-[rgba(6,9,22,0.98)] border-2 border-[rgba(252,211,77,0.8)] backdrop-blur-sm flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.9),0_0_0_1px_rgba(252,211,77,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
                          <svg className="w-4 h-4 ml-0.5 drop-shadow-lg" viewBox="0 0 24 24" fill="none">
                            <defs>
                              <linearGradient id={`playGradient${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ffd700" />
                                <stop offset="50%" stopColor="#ff8a1f" />
                                <stop offset="100%" stopColor="#ffffff" />
                              </linearGradient>
                            </defs>
                            <path d="M8 5v14l11-7z" fill={`url(#playGradient${i})`} />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* No icon visible when video is playing (playingIndex === i) */}
                </div>
                <div className="flex items-center gap-2 mt-auto">
                  <Icon className="w-3.5 h-3.5 text-accent-orange-soft flex-shrink-0" />
                  <h3 className="text-[12px] font-semibold text-text-main leading-tight m-0">{example.title}</h3>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Pricing Section
function PricingSection() {
  const scrollToForm = () => {
    const element = document.getElementById('prompt-zone')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const pricingPlans = [
    {
      badge: 'Pack Starter',
      name: '5 tokens',
      oldPrice: '',
      price: '€19.90',
      offer: '',
      icon: Sparkles,
      recommended: false,
    },
    {
      badge: 'Pack Creator',
      name: '10 tokens',
      oldPrice: '',
      price: '€34.90',
      offer: '',
      icon: Users,
      recommended: true,
    },
    {
      badge: 'Pack Pro',
      name: '25 tokens',
      oldPrice: '',
      price: '€74.90',
      offer: '',
      icon: TrendingUp,
      recommended: false,
    },
    {
      badge: 'Pack Boost',
      name: '50 tokens',
      oldPrice: '',
      offer: '',
      price: '€139.90',
      icon: Rocket,
      recommended: false,
    },
  ]

  return (
    <section id="tarifs" className="py-8 md:py-10 pb-2 md:pb-4">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-left mb-6 md:mb-8">
          <h2 className="text-[28px] lg:text-[32px] mb-3 font-extrabold leading-tight">
            Choisissez le pack qui correspond à votre rythme
          </h2>
          <p className="text-[14px] lg:text-[15px] text-text-soft max-w-[600px] leading-relaxed">
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
                  className={`rounded-[22px] p-4 md:p-5 border shadow-[0_18px_40px_rgba(0,0,0,0.8)] flex flex-col gap-2.5 h-full hover:border-[rgba(252,211,77,1)] transition-all duration-300 ${
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
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-2xl font-bold text-text-main">{plan.price}</span>
                    {plan.offer && (
                      <span className="text-[11px] px-2 py-1 rounded-full bg-[rgba(22,163,74,0.18)] border border-[rgba(22,163,74,0.8)] text-[#bbf7d0]">
                        {plan.offer}
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] text-text-soft font-medium">{plan.name}</div>
                  <div className="text-[11px] text-text-muted">Aucun abonnement requis</div>
                  <div className="mt-auto pt-2">
                    <button
                      onClick={scrollToForm}
                      className="w-full bg-transparent text-accent-orange-soft border border-[rgba(248,181,86,0.95)] shadow-[0_0_0_1px_rgba(248,181,86,0.4)] rounded-full text-[13px] font-semibold px-4 py-2.5 cursor-pointer inline-flex items-center justify-center gap-2 transition-all duration-[0.18s] ease-out hover:bg-[radial-gradient(circle_at_top_left,rgba(255,138,31,0.16),transparent_70%)] hover:border-[rgba(248,181,86,1)] hover:scale-105"
                    >
                      Choisir ce pack
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-[rgba(51,65,85,0.3)]">
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
    </section>
  )
}

// FAQ Section with Dropdowns
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Combien de temps faut-il pour générer mes vidéos ?',
      a: 'Le temps de génération dépend de la demande actuelle, mais dans la plupart des cas, les vidéos sont générées <strong>en quelques minutes</strong> après la validation de votre prompt.',
    },
    {
      q: 'Qui possède les vidéos générées ?',
      a: 'Toutes les vidéos générées vous appartiennent à <strong>100%</strong>. Vous êtes libre de les utiliser à des fins personnelles ou professionnelles.',
    },
    {
      q: 'Puis-je utiliser les vidéos à des fins commerciales ?',
      a: 'Oui. Toutes les vidéos générées sur FLAZY peuvent être utilisées commercialement, <strong>sans frais supplémentaires</strong>.',
    },
    {
      q: 'Les vidéos contiennent-elles un filigrane ?',
      a: 'Par défaut, les vidéos sont disponibles <strong>sans aucun filigrane</strong> et sont prêtes à être publiées.',
    },
    {
      q: 'Où puis-je publier mes vidéos ?',
      a: 'Les vidéos sont optimisées pour le format vertical 9:16 et peuvent être publiées sur TikTok, Instagram Reels, YouTube Shorts, Snapchat, Facebook et autres plateformes de contenu court.',
    },
    {
      q: 'Que faire si je n\'aime pas le résultat ?',
      a: 'Vous pouvez ajuster votre prompt et générer une nouvelle vidéo tant que vous avez des tokens disponibles.',
    },
    {
      q: 'Mes prompts et vidéos générées sont-ils privés ?',
      a: 'Oui. Les prompts et les vidéos générées sont <strong>privés</strong> et ne sont pas partagés publiquement, sauf si vous avez explicitement approuvé l\'option « J\'autorise ma vidéo à être publiée dans le carrousel public de FLAZY. »',
    },
    {
      q: 'Que se passe-t-il si j\'arrive au bout de mes tokens ?',
      a: 'Vous pouvez simplement acheter des packs de tokens supplémentaires ou combiner plusieurs packs de tokens. Les tokens sont <strong>cumulables</strong>, vous permettant de générer autant de vidéos que vous le souhaitez, sans limiter votre rythme de publication.',
    },
  ]

  return (
    <section id="faq" className="py-8 md:py-10 pb-2 md:pb-4">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-left mb-6 md:mb-8">
          <div className="text-[11px] uppercase tracking-[0.16em] mb-1.5 font-semibold text-accent-orange">
            Questions fréquentes
          </div>
          <h2 className="text-[28px] lg:text-[32px] mb-3 font-extrabold leading-tight">
            Des réponses claires et transparentes
          </h2>
          <p className="text-[14px] lg:text-[15px] text-text-soft max-w-[600px] leading-relaxed">
            Voici les informations essentielles à connaître sur FLAZY.
          </p>
        </div>
      </div>
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="space-y-3 w-full">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[rgba(6,9,22,0.98)] rounded-[22px] border border-[rgba(252,211,77,0.7)] shadow-[0_18px_40px_rgba(0,0,0,0.8)] overflow-hidden hover:border-[rgba(252,211,77,0.9)] transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[rgba(15,23,42,0.5)] transition-colors"
              >
                <h3 className="text-[15px] font-semibold text-text-main pr-4">{faq.q}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-accent-orange-soft flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-4 pt-2 border-t border-[rgba(51,65,85,0.5)]">
                  <p
                    className="text-[13px] text-text-soft leading-relaxed m-0"
                    dangerouslySetInnerHTML={{ __html: faq.a }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      title: 'Choisissez votre pack',
      description: 'Sélectionnez le pack qui correspond à vos besoins (Starter, Creator, Pro ou Boost) et complétez votre paiement sécurisé.',
      icon: CheckCircle2,
    },
    {
      number: '2',
      title: 'Décrivez votre vidéo',
      description: 'Rédigez un prompt détaillé décrivant la vidéo que vous souhaitez générer : personnage, lieu, ton, style, etc.',
      icon: Video,
    },
    {
      number: '3',
      title: 'Génération automatique',
      description: 'Notre IA génère votre vidéo en quelques minutes. Vos vidéos sont disponibles directement dans votre espace (Mes vidéos).',
      icon: Rocket,
    },
    {
      number: '4',
      title: 'Publiez et monétisez',
      description: 'Téléchargez votre vidéo et publiez-la sur TikTok, Reels, YouTube Shorts ou toute autre plateforme. Les vidéos vous appartiennent à 100%.',
      icon: CheckCircle2,
    },
  ]

  return (
    <section className="py-8 md:py-10 pb-2 md:pb-4">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-center mb-6">
          <div className="text-[11px] uppercase tracking-[0.16em] mb-1.5 font-semibold text-accent-orange">
            Comment ça fonctionne
          </div>
          <h2 className="text-[28px] lg:text-[32px] mb-3 font-extrabold leading-tight">
            Créez des vidéos virales en quelques minutes, grâce à un processus simple et fluide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className="relative rounded-[16px] p-4 border border-[rgba(252,211,77,0.7)] shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:border-[rgba(252,211,77,0.9)] transition-all duration-300 h-full flex flex-col"
                style={{
                  background: `
                    radial-gradient(circle at top, rgba(255, 138, 31, 0.16), transparent 60%),
                    rgba(6, 9, 22, 0.98)
                  `
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-5 h-5 text-accent-orange-soft flex-shrink-0" />
                  <h3 className="text-sm font-bold text-text-main leading-tight">{step.title}</h3>
                </div>
                <p className="text-[11px] text-text-soft leading-relaxed flex-grow">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Footer Component
function Footer() {
  const currentYear = 2025
  
  return (
    <footer className="py-6 border-t border-[rgba(30,41,59,0.9)] bg-[rgba(3,7,18,0.98)] text-[11px] text-text-muted mt-12">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="flex items-center justify-between gap-2.5 flex-wrap">
          <div>© {currentYear} FLAZY Tous droits réservés.</div>
          <div className="flex gap-3.5 flex-wrap">
            <Link href="/mentions-legales" className="text-text-muted hover:text-text-main transition-colors">
              Mentions légales
            </Link>
            <Link href="/conditions-generales" className="text-text-muted hover:text-text-main transition-colors">
              Conditions générales
            </Link>
            <Link href="/politique-confidentialite" className="text-text-muted hover:text-text-main transition-colors">
              Politique de confidentialité
            </Link>
            <a
              href="mailto:Flazy.orders@gmail.com"
              className="text-text-muted hover:text-text-main transition-colors"
            >
              Flazy.orders@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main Page Component
export default function Home() {
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Just check auth state, don't redirect automatically
    // Users can navigate freely - redirect only happens when they try to generate videos
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        // Just set loading to false, no redirect
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [])

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: `
          radial-gradient(circle 800px at top right, rgba(255, 138, 31, 0.4), transparent),
          radial-gradient(circle 600px at bottom left, rgba(56, 189, 248, 0.22), transparent),
          radial-gradient(circle 800px at bottom right, rgba(129, 140, 248, 0.4), transparent),
          #020314
        `,
        backgroundAttachment: 'fixed'
      }}>
        <Loader2 className="w-8 h-8 text-accent-orange-soft animate-spin" />
      </div>
    )
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
      <TopBar />
      <Header />
      <main className="py-6 pb-0">
        <Hero />
        <FormSection />
        <ExamplesSection />
        <HowItWorksSection />
        <div className="py-8 md:py-10 pb-2 md:pb-4">
          <div className="max-w-[1120px] mx-auto px-5">
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/pricing"
                  className="relative overflow-hidden bg-transparent text-[#111827] shadow-[0_18px_45px_rgba(0,0,0,0.75)] z-0 rounded-full border-none text-[13px] font-semibold px-6 py-3 cursor-pointer inline-flex items-center gap-2 transition-all duration-[0.18s] ease-out hover:-translate-y-px hover:shadow-[0_22px_60px_rgba(0,0,0,0.95)]"
                  style={{
                    position: 'relative',
                  }}
                >
                  <span className="absolute inset-0 -z-10 rounded-full" style={{
                    backgroundImage: 'linear-gradient(90deg, #ff6b00 0%, #ffd700 25%, #ff4b2b 50%, #ffd700 75%, #ff6b00 100%)',
                    backgroundSize: '220% 100%',
                    animation: 'flazyTopbar 10s ease-in-out infinite alternate'
                  }}></span>
                  <span>Découvrez nos tarifs</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/carousel"
                  className="bg-transparent text-accent-orange-soft border border-[rgba(248,181,86,0.95)] shadow-[0_0_0_1px_rgba(248,181,86,0.4)] rounded-full text-[13px] font-semibold px-6 py-3 inline-flex items-center justify-center gap-2 transition-all duration-[0.18s] ease-out hover:bg-[radial-gradient(circle_at_top_left,rgba(255,138,31,0.16),transparent_70%)] hover:border-[rgba(248,181,86,1)]"
                >
                  <Video className="w-4 h-4" />
                  <span>Voir le carrousel</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
