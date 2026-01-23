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
  Loader2,
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

export default function ConditionsGenerales() {
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
            Conditions Générales d'Utilisation
          </h1>
          
          <div className="space-y-6 text-text-soft text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">1. Objet du service</h2>
              <p className="mb-3">
                FLAZY est une plateforme permettant aux utilisateurs de générer des vidéos à l'aide de technologies d'intelligence artificielle, à partir de descriptions, prompts ou instructions fournis par l'utilisateur.
              </p>
              <p>
                FLAZY fournit uniquement un outil technique de génération de contenu et n'intervient pas dans la définition des objectifs, des usages, ni dans les résultats attendus par l'utilisateur. FLAZY n'exerce aucun contrôle éditorial préalable sur les contenus générés.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">2. Responsabilité de l'utilisateur</h2>
              <p className="mb-3">
                L'utilisateur est seul responsable :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                <li>des prompts, instructions et contenus qu'il fournit à FLAZY,</li>
                <li>de l'utilisation qu'il fait des vidéos générées,</li>
                <li>du respect des lois et réglementations applicables dans son pays.</li>
              </ul>
              <p className="mb-3">
                FLAZY décline toute responsabilité concernant l'utilisation que vous faites du contenu généré. Vous acceptez d'indemniser et de dégager FLAZY de toute responsabilité en cas de réclamation, dommage ou litige résultant de votre utilisation du service.
              </p>
              <p>
                L'utilisateur garantit que les contenus demandés ne portent pas atteinte aux droits de tiers, notamment aux droits de marque, droits d'auteur, droits à l'image, et ne constituent pas un contenu interdit, illégal ou contraire à l'ordre public.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">3. Absence de garantie de résultat</h2>
              <p className="mb-3">
                Les vidéos générées par FLAZY sont produites automatiquement par des systèmes d'intelligence artificielle.
              </p>
              <p>
                FLAZY ne garantit aucun résultat en termes de qualité perçue, de performance, de viralité, de visibilité, d'engagement, de revenus ou de monétisation. Aucune réclamation ne pourra être fondée sur des attentes de résultats ou de performances.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">4. Propriété du contenu généré</h2>
              <p className="mb-3">
                Les vidéos générées via FLAZY vous appartiennent à 100%. Vous êtes libre de les utiliser à des fins personnelles ou commerciales, sous réserve du respect des présentes conditions et des lois applicables.
              </p>
              <p>
                FLAZY ne revendique aucun droit de propriété sur les vidéos générées, mais se réserve le droit de les supprimer ou d'en bloquer l'accès en cas de non-respect des présentes conditions ou à la suite d'un signalement légitime.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">5. Système de tokens et paiements</h2>
              <p className="mb-3">
                L'utilisation de FLAZY nécessite l'achat de tokens via des packs sans abonnement. Les tokens sont cumulables et non remboursables. Les paiements sont traités de manière sécurisée via Stripe.
              </p>
              <p>
                Une fois les tokens utilisés, aucune annulation, remboursement ou échange ne pourra être exigé.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">6. Disponibilité du service</h2>
              <p className="mb-3">
                FLAZY s'efforce d'assurer une disponibilité continue du service, mais ne peut garantir un accès ininterrompu. Le service peut être temporairement indisponible pour maintenance, mise à jour ou en cas de force majeure.
              </p>
              <p>
                FLAZY ne saurait être tenu responsable des interruptions, limitations ou dysfonctionnements liés à des services tiers, notamment les prestataires de paiement, fournisseurs d'API, services d'hébergement ou d'infrastructure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">7. Conservation des contenus</h2>
              <p>
                FLAZY ne garantit pas la conservation des vidéos générées dans le temps. Il appartient à l'utilisateur de sauvegarder ses contenus. FLAZY ne pourra être tenu responsable de la perte, suppression ou indisponibilité des contenus.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">8. Modération et droit de retrait</h2>
              <p className="mb-3">
                FLAZY se réserve le droit, à sa seule discrétion, de refuser, suspendre ou retirer tout contenu ou compte utilisateur ne respectant pas les présentes Conditions, sans préavis. Cette mesure peut être prise en cas de non-conformité avec les règles d'utilisation, de violation des présentes conditions, ou pour toute autre raison légitime que FLAZY jugerait appropriée.
              </p>
              <p>
                FLAZY n'exerce aucun contrôle préalable sur les contenus générés, mais peut intervenir à la suite d'un signalement ou lorsqu'un contenu est manifestement illicite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">9. Suspension et résiliation</h2>
              <p>
                FLAZY se réserve le droit de suspendre ou résilier votre compte à tout moment en cas de violation des présentes conditions, notamment en cas de génération de contenu interdit. Aucun remboursement ne sera effectué en cas de résiliation pour violation des présentes conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">10. Limitation de responsabilité</h2>
              <p>
                En tout état de cause, la responsabilité de FLAZY, toutes causes confondues, est strictement limitée au montant effectivement payé par l'utilisateur au cours des trente (30) derniers jours précédant l'événement à l'origine de la réclamation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">11. Conditions d'âge</h2>
              <p>
                Le service est réservé aux personnes âgées d'au moins 18 ans ou ayant atteint l'âge légal requis dans leur pays de résidence.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">12. Modifications des conditions</h2>
              <p>
                FLAZY se réserve le droit de modifier les présentes conditions à tout moment. Les modifications entrent en vigueur dès leur publication. Il est de la responsabilité de l'utilisateur de consulter régulièrement les conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">13. Droit applicable et juridiction</h2>
              <p>
                Les présentes conditions sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents français.
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

