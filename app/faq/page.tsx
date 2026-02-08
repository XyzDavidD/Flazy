'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { useCredits } from '@/hooks/useCredits'
import { useTranslation } from '@/lib/translations/context'
import { t, getFaqAnswer, type Language } from '@/lib/translations/dictionary'
import { FlagIcon } from '@/components/FlagIcon'
import {
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Globe,
  CheckCircle2,
  Loader2,
  Video,
  Rocket,
} from 'lucide-react'

// Header Component (simplified for FAQ page)
function Header({ lang }: { lang: Language }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  
  const { credits, loading: creditsLoading } = useCredits()
  
  // Use translation context
  const { language: currentLanguage, setLanguage, isLoading: isTranslating } = useTranslation()

  const languages = [
    { code: 'fr' as const, name: 'Français' },
    { code: 'en' as const, name: 'English' },
    { code: 'es' as const, name: 'Español' },
  ]

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0]

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
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-[18px] text-[13px] text-text-muted absolute left-1/2 -translate-x-1/2">
          <Link
            href="/creations"
            className="relative cursor-pointer transition-colors duration-[0.18s] ease-out hover:text-text-main after:content-[''] after:absolute after:left-0 after:-bottom-[6px] after:w-0 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#ffb347] after:via-[#ff8a1f] after:to-[#ff4b2b] after:transition-all after:duration-[0.18s] after:ease-out hover:after:w-[18px]"
          >
            {t('Creations', currentLanguage)}
          </Link>
          <Link
            href="/pricing"
            className="relative cursor-pointer transition-colors duration-[0.18s] ease-out hover:text-text-main after:content-[''] after:absolute after:left-0 after:-bottom-[6px] after:w-0 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#ffb347] after:via-[#ff8a1f] after:to-[#ff4b2b] after:transition-all after:duration-[0.18s] after:ease-out hover:after:w-[18px]"
          >
            {t('Tarifs', currentLanguage)}
          </Link>
          <Link
            href="/faq"
            className="relative cursor-pointer transition-colors duration-[0.18s] ease-out hover:text-text-main after:content-[''] after:absolute after:left-0 after:-bottom-[6px] after:w-0 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#ffb347] after:via-[#ff8a1f] after:to-[#ff4b2b] after:transition-all after:duration-[0.18s] after:ease-out hover:after:w-[18px]"
          >
            {t('FAQ', currentLanguage)}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector - Mobile (Top Bar) */}
          <div className="sm:hidden relative language-dropdown" data-no-translate>
            <button
              onClick={() => {
                setLanguageDropdownOpen(!languageDropdownOpen)
                setAccountDropdownOpen(false)
              }}
              className="flex items-center gap-1 px-1.5 py-1 rounded-full bg-transparent text-text-soft text-[13px] font-medium transition-colors duration-150 hover:text-text-main"
              aria-label="Select language"
              disabled={isTranslating}
            >
              <FlagIcon countryCode={currentLang.code} className="w-5 h-5" />
              {isTranslating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''}`} />
              )}
            </button>
            {languageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-24 rounded-xl bg-[rgba(6,9,22,0.98)] border border-[rgba(252,211,77,0.75)] shadow-lg overflow-hidden z-50" data-no-translate>
                {languages.filter(l => l.code !== currentLanguage).map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLanguageChange(l.code as 'fr' | 'en' | 'es')}
                    disabled={isTranslating}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                      'text-text-soft hover:bg-[rgba(15,23,42,0.5)] hover:text-text-main'
                    } ${isTranslating ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    <FlagIcon countryCode={l.code} className="w-5 h-5" />
                    <span className="text-[11px] font-semibold tracking-[0.18em]">{l.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Language Selector - Compact */}
          <div className="hidden sm:block relative language-dropdown" data-no-translate>
            <button
              onClick={() => {
                setLanguageDropdownOpen(!languageDropdownOpen)
                setAccountDropdownOpen(false)
              }}
              className="flex items-center gap-1 px-1.5 py-1 rounded-full bg-transparent text-text-soft text-[13px] font-medium transition-colors duration-150 hover:text-text-main"
              aria-label="Select language"
              disabled={isTranslating}
            >
              <FlagIcon countryCode={currentLang.code} className="w-4 h-4" />
              {isTranslating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''}`} />
              )}
            </button>
            {languageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-24 rounded-xl bg-[rgba(6,9,22,0.98)] border border-[rgba(252,211,77,0.75)] shadow-lg overflow-hidden z-50" data-no-translate>
                {languages.filter(l => l.code !== currentLanguage).map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLanguageChange(l.code as 'fr' | 'en' | 'es')}
                    disabled={isTranslating}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                      'text-text-soft hover:bg-[rgba(15,23,42,0.5)] hover:text-text-main'
                    } ${isTranslating ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    <FlagIcon countryCode={l.code} className="w-4 h-4" />
                    <span className="text-[11px] font-semibold tracking-[0.18em]">{l.code.toUpperCase()}</span>
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
                    <span>{t('crédits', lang)}</span>
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
                      {t('Mon compte', lang)}
                      <ChevronDown className={`w-3 h-3 transition-transform ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {accountDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[rgba(6,9,22,0.98)] border border-[rgba(252,211,77,0.75)] shadow-lg overflow-hidden z-50">
                        <Link
                          href="/mes-videos"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="w-full text-left px-4 py-3 text-sm text-text-soft hover:bg-[rgba(15,23,42,0.5)] transition-colors flex items-center gap-2"
                        >
                          <Video className="w-4 h-4" />
                          Mes vidéos
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-sm text-text-soft hover:bg-[rgba(15,23,42,0.5)] transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('Se déconnecter', lang)}
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
                    {t('Se connecter', lang)}
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="hidden sm:flex items-center justify-center px-4 py-2 rounded-full border border-[rgba(148,163,184,0.7)] bg-transparent text-text-soft text-[13px] font-semibold transition-all duration-[0.18s] ease-out hover:bg-[rgba(15,23,42,0.9)] hover:text-text-main hover:border-[rgba(203,213,225,0.9)]"
                  >
                    {t("S'inscrire", lang)}
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
        <div 
          className="lg:hidden pb-4 px-5 space-y-1 border-t border-[rgba(51,65,85,0.5)] pt-4 relative z-50"
          style={{
            background: `
              radial-gradient(circle at top, rgba(129, 140, 248, 0.5), transparent 60%),
              radial-gradient(circle at bottom, rgba(255, 138, 31, 0.4), transparent 60%),
              rgba(3, 7, 18, 0.98)
            `
          }}
        >
          <div className="space-y-1 mb-3">
            <Link
              href="/creations"
              className="block w-full text-left px-4 py-2.5 text-sm text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.5)] rounded-lg transition-colors touch-manipulation"
              onClick={(e) => {
                setMobileMenuOpen(false)
                e.stopPropagation()
              }}
            >
              {t('Carrousel', lang)}
            </Link>
            <Link
              href="/pricing"
              className="block w-full text-left px-4 py-2.5 text-sm text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.5)] rounded-lg transition-colors touch-manipulation"
              onClick={(e) => {
                setMobileMenuOpen(false)
                e.stopPropagation()
              }}
            >
              {t('Tarifs', lang)}
            </Link>
            <Link
              href="/faq"
              className="block w-full text-left px-4 py-2.5 text-sm text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.5)] rounded-lg transition-colors touch-manipulation"
              onClick={(e) => {
                setMobileMenuOpen(false)
                e.stopPropagation()
              }}
            >
              {t('FAQ', lang)}
            </Link>
          </div>

          <div className="border-t border-[rgba(51,65,85,0.5)] pt-3 mt-3">
            {user ? (
              <>
                <div className="px-4 py-2 flex items-center gap-1.5 text-text-soft text-sm mb-2">
                  <span className="text-accent-orange-soft font-semibold">
                    {creditsLoading ? '—' : (credits ?? 0)}
                  </span>
                  <span>{t('crédits', lang)}</span>
                </div>
                <Link
                  href="/mes-videos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left px-4 py-2.5 text-sm text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.5)] rounded-lg transition-colors flex items-center gap-2 touch-manipulation"
                >
                  <Video className="w-4 h-4" />
                  Mes vidéos
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2.5 text-sm text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.5)] rounded-lg transition-colors flex items-center gap-2 touch-manipulation"
                >
                  <LogOut className="w-4 h-4" />
                  {t('Se déconnecter', lang)}
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
                  {t('Se connecter', lang)}
                </Link>
                <Link
                  href="/auth/signup"
                  className="block w-full text-left px-4 py-2.5 text-sm text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.5)] rounded-lg transition-colors touch-manipulation"
                  onClick={(e) => {
                    setMobileMenuOpen(false)
                    e.stopPropagation()
                  }}
                >
                  {t("S'inscrire", lang)}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

// Footer Component
function Footer({ lang }: { lang: Language }) {
  const currentYear = 2025

  return (
    <footer className="py-6 border-t border-[rgba(30,41,59,0.9)] bg-[rgba(3,7,18,0.98)] text-[11px] text-text-muted mt-12">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="flex items-center justify-between gap-2.5 flex-wrap">
          <div>© {currentYear} FLAZY. {t('Tous droits réservés.', lang)}</div>
          <div className="flex gap-3.5 flex-wrap">
            <Link href="/mentions-legales" className="text-text-muted hover:text-text-main transition-colors">
              {t('Mentions légales', lang)}
            </Link>
            <Link href="/conditions-generales" className="text-text-muted hover:text-text-main transition-colors">
              {t('Conditions générales', lang)}
            </Link>
            <Link href="/politique-confidentialite" className="text-text-muted hover:text-text-main transition-colors">
              {t('Politique de confidentialité', lang)}
            </Link>
            <a
              href="mailto:Support@flazy.app"
              className="text-text-muted hover:text-text-main transition-colors"
              translate="no"
            >
              Support@flazy.app
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// FAQ Section
export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { language } = useTranslation()
  const lang = language as Language

  const howItWorksSteps = [
    {
      title: t('Choisissez votre pack', lang),
      description: t('Sélectionnez le pack qui correspond à vos besoins (Starter, Creator, Pro ou Boost), puis finalisez votre commande.', lang),
      icon: CheckCircle2,
    },
    {
      title: t('Décrivez votre vidéo', lang),
      description: t('Décrivez la vidéo que vous souhaitez générer : sujet, ambiance, style.', lang),
      icon: Video,
    },
    {
      title: t('Génération automatique', lang),
      description: t('Votre vidéo est générée automatiquement en quelques minutes et accessible dans votre espace "Mes vidéos".', lang),
      icon: Rocket,
    },
    {
      title: t('Publiez et monétisez', lang),
      description: t("Téléchargez votre vidéo et publiez-la sur TikTok, Reels, YouTube Shorts ou toute autre plateforme. Vous conservez l'intégralité des droits sur vos vidéos.", lang),
      icon: CheckCircle2,
    },
  ]

  // FAQ questions - we use the dictionary keys
  const faqQuestions = [
    'Combien de temps faut-il pour générer mes vidéos ?',
    'Puis-je utiliser les vidéos à des fins commerciales ?',
    'Les vidéos contiennent-elles un filigrane ?',
    'Où puis-je publier mes vidéos ?',
    "Que faire si je n'aime pas le résultat ?",
    'Mes prompts et vidéos générées sont-ils privés ?',
    "Que se passe-t-il si j'arrive au bout de mes tokens ?",
  ]

  return (
    <div className="min-h-screen" style={{
      background: `
        radial-gradient(circle at top right, rgba(255, 138, 31, 0.4), transparent 58%),
        radial-gradient(circle at bottom left, rgba(56, 189, 248, 0.22), transparent 60%),
        radial-gradient(circle at bottom right, rgba(129, 140, 248, 0.4), transparent 58%),
        #020314
      `
    }}>
      <Header lang={lang} />
      <div className="max-w-[1120px] mx-auto px-5 pt-4 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[rgba(148,163,184,0.7)] bg-[rgba(15,23,42,0.5)] backdrop-blur-sm text-text-soft hover:text-text-main hover:bg-[rgba(15,23,42,0.8)] hover:border-[rgba(203,213,225,0.9)] transition-all duration-[0.18s] ease-out text-sm font-semibold group touch-manipulation"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">{t("Retour à l'accueil", lang)}</span>
          <span className="sm:hidden">{t('Retour', lang)}</span>
        </Link>
      </div>
      <main className="py-8 md:py-12">
        <div className="max-w-[1120px] mx-auto px-5">
          <div className="text-left mb-8 md:mb-10">
            <div className="text-[11px] uppercase tracking-[0.16em] mb-1.5 font-semibold text-[#ff8a1f]">
              {t('Questions fréquentes', lang)}
            </div>
            <h1 className="text-[32px] lg:text-[42px] mb-3 font-extrabold leading-tight">
              {t('Des réponses claires et transparentes', lang)}
            </h1>
            <p className="text-[14px] lg:text-[16px] text-text-soft max-w-[600px] leading-relaxed">
              {t('Voici les informations essentielles à connaître sur FLAZY.', lang)}
            </p>
          </div>

          <div className="space-y-3 w-full">
            <div
              className="bg-[rgba(6,9,22,0.98)] rounded-[22px] border border-[rgba(252,211,77,0.7)] shadow-[0_18px_40px_rgba(0,0,0,0.8)] overflow-hidden hover:border-[rgba(252,211,77,0.9)] transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === 0 ? null : 0)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[rgba(15,23,42,0.5)] transition-colors"
              >
                <h3 className="text-[15px] font-semibold text-text-main pr-4">{t('Comment ça fonctionne ?', lang)}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-accent-orange-soft flex-shrink-0 transition-transform duration-300 ${
                    openIndex === 0 ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === 0 ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pt-2 border-t border-[rgba(51,65,85,0.5)]">
                  <p className="text-[13px] text-text-soft leading-relaxed mb-4">
                    {t('Créez des vidéos virales en quelques minutes, grâce à un processus simple et fluide', lang)}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {howItWorksSteps.map((step, stepIndex) => {
                      const Icon = step.icon
                      return (
                        <div
                          key={stepIndex}
                          className="relative rounded-[16px] p-4 border border-[rgba(252,211,77,0.7)] shadow-[0_8px_24px_rgba(0,0,0,0.6)] h-full flex flex-col"
                          style={{
                            background: `
                              radial-gradient(circle at top, rgba(255, 138, 31, 0.16), transparent 60%),
                              rgba(6, 9, 22, 0.98)
                            `
                          }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="w-5 h-5 text-accent-orange-soft flex-shrink-0" />
                            <h4 className="text-sm font-bold text-text-main leading-tight">{step.title}</h4>
                          </div>
                          <p className="text-[11px] text-text-soft leading-relaxed flex-grow">{step.description}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {faqQuestions.map((question, index) => (
              <div
                key={index}
                className="bg-[rgba(6,9,22,0.98)] rounded-[22px] border border-[rgba(252,211,77,0.7)] shadow-[0_18px_40px_rgba(0,0,0,0.8)] overflow-hidden hover:border-[rgba(252,211,77,0.9)] transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index + 1 ? null : index + 1)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[rgba(15,23,42,0.5)] transition-colors"
                >
                  <h3 className="text-[15px] font-semibold text-text-main pr-4">{t(question, lang)}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-accent-orange-soft flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index + 1 ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index + 1 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-4 pt-2 border-t border-[rgba(51,65,85,0.5)]">
                    <p
                      className="text-[13px] text-text-soft leading-relaxed m-0"
                      dangerouslySetInnerHTML={{ __html: getFaqAnswer(index, lang) }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/pricing"
              className="relative overflow-hidden bg-transparent text-[#000] shadow-[0_18px_45px_rgba(0,0,0,0.75)] z-0 rounded-full border-none text-[13px] font-semibold px-6 py-3 cursor-pointer inline-flex items-center gap-2 transition-all duration-[0.18s] ease-out hover:-translate-y-px hover:shadow-[0_22px_60px_rgba(0,0,0,0.95)]"
              style={{
                position: 'relative',
              }}
            >
              <span className="absolute inset-0 -z-10 rounded-full" style={{
                backgroundImage: 'linear-gradient(90deg, #ff6b00 0%, #ffd36a 50%, #ff5a1f 100%)'
              }}></span>
              <span>{t('Découvrez nos tarifs', lang)}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  )
}

