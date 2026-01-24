'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { useCredits } from '@/hooks/useCredits'
import { useTranslation } from '@/lib/translations/context'
import { t, type Language } from '@/lib/translations/dictionary'
import {
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  ChevronLeft,
  CheckCircle2,
  Loader2,
  Video,
} from 'lucide-react'

// Header Component (simplified for legal pages)
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
              href="mailto:Support@flazy.app"
              className="text-text-muted hover:text-text-main transition-colors"
            >
              Support@flazy.app
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function MentionsLegales() {
  const { language } = useTranslation()
  const lang = language as Language
  
  return (
    <div className="min-h-screen" style={{
      background: `
        radial-gradient(circle at top right, rgba(255, 138, 31, 0.24), transparent 58%),
        radial-gradient(circle at bottom left, rgba(56, 189, 248, 0.22), transparent 60%),
        radial-gradient(circle at bottom right, rgba(129, 140, 248, 0.4), transparent 58%),
        #020314
      `
    }}>
      <Header />
      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="bg-[rgba(6,9,22,0.98)] rounded-[22px] border border-[rgba(252,211,77,0.7)] shadow-[0_18px_40px_rgba(0,0,0,0.8)] p-8 lg:p-12">
          <h1 className="text-3xl lg:text-4xl font-extrabold mb-6 bg-gradient-to-br from-[#ffe29f] via-[#ff8a1f] to-[#ff4b2b] bg-clip-text text-transparent">
            Mentions Légales
          </h1>
          
          <div className="space-y-6 text-text-soft text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">1. Informations sur l'éditeur</h2>
              <p className="mb-3">
                FLAZY est une plateforme de génération de vidéos par intelligence artificielle.
              </p>
              <p className="mb-3">
                <strong>Email :</strong> Support@flazy.app
              </p>
              <p>
                Cet email constitue le point de contact officiel pour toute demande liée au service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">2. Hébergement</h2>
              <p className="mb-3">
                Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
              </p>
              <p>
                FLAZY ne saurait être tenu responsable des interruptions ou dysfonctionnements liés à l'hébergement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">3. Propriété intellectuelle</h2>
              <p className="mb-3">
                L'ensemble du contenu du site FLAZY (textes, images, logos, vidéos, etc.) est la propriété exclusive de FLAZY, sauf mention contraire. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable écrite.
              </p>
              <p>
                Toute extraction automatisée, reproduction massive ou utilisation à des fins concurrentielles est interdite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">4. Protection des données personnelles</h2>
              <p className="mb-3">
                Les données personnelles collectées sur le site sont traitées conformément à notre{' '}
                <Link href="/politique-confidentialite" className="text-accent-orange-soft hover:underline">
                  Politique de Confidentialité
                </Link>.
              </p>
              <p>
                Conformément au RGPD, l'utilisateur dispose de droits d'accès, de rectification et de suppression.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">5. Responsabilité de l'utilisateur</h2>
              <div className="bg-[rgba(255,138,31,0.1)] border border-[rgba(255,138,31,0.3)] rounded-xl p-4 my-4">
                <p className="font-semibold text-text-main mb-2">
                  ⚠️ Règles d'utilisation strictes
                </p>
                <p className="mb-2">
                  En utilisant FLAZY, vous vous engagez à ne <strong>jamais générer</strong> :
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Du contenu illégal ou contraire aux lois applicables</li>
                  <li>Du contenu impliquant des personnes réelles identifiables ou des célébrités sans autorisation explicite</li>
                  <li>Du contenu diffamatoire, haineux, discriminatoire ou violent</li>
                  <li>Du contenu portant atteinte aux droits de propriété intellectuelle de tiers</li>
                  <li>Du contenu pornographique, obscène ou inapproprié</li>
                  <li>Du contenu trompeur ou visant à usurper l'identité d'une personne réelle</li>
                  <li>Du contenu de type deepfake ou imitation réaliste d'une personne existante</li>
                </ul>
                <p className="mt-3 font-semibold">
                  Vous êtes <strong>entièrement responsable</strong> du contenu que vous générez et de la manière dont vous l'utilisez. 
                  FLAZY se réserve le droit de suspendre ou supprimer tout compte en cas de violation de ces règles.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">6. Limitation de responsabilité</h2>
              <p className="mb-3">
                FLAZY ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation du service ou de l'impossibilité de l'utiliser. 
                Le service est fourni « tel quel » sans garantie d'aucune sorte.
              </p>
              <p>
                FLAZY ne saurait être tenu responsable des services tiers utilisés, notamment hébergement, API ou paiement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">7. Droit applicable</h2>
              <p className="mb-3">
                Les présentes mentions légales sont régies par le droit français. Tout litige relatif à leur interprétation 
                et/ou à leur exécution relève des tribunaux compétents.
              </p>
              <p>
                Le service est réservé aux utilisateurs majeurs ou ayant atteint l'âge légal requis.
              </p>
            </section>

            <div className="pt-6 border-t border-[rgba(51,65,85,0.5)] mt-8">
              <Link 
                href="/" 
                className="inline-flex items-center text-accent-orange-soft hover:text-accent-orange transition-colors"
                data-no-translate
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t("Retour à l'accueil", lang)}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
