'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { useCredits } from '@/hooks/useCredits'
import { useTranslation } from '@/lib/translations/context'
import { t, type Language } from '@/lib/translations/dictionary'
import { FlagIcon } from '@/components/FlagIcon'
import {
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  ChevronLeft,
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
    { code: 'fr' as const, name: 'Français' },
    { code: 'en' as const, name: 'English' },
    { code: 'es' as const, name: 'Español' },
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
            </div>
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
                {languages.filter(lang => lang.code !== currentLanguage).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code as 'fr' | 'en' | 'es')}
                    disabled={isTranslating}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                      'text-text-soft hover:bg-[rgba(15,23,42,0.5)] hover:text-text-main'
                    } ${isTranslating ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    <FlagIcon countryCode={lang.code} className="w-5 h-5" />
                    <span className="text-[11px] font-semibold tracking-[0.18em]">{lang.code.toUpperCase()}</span>
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
                {languages.filter(lang => lang.code !== currentLanguage).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code as 'fr' | 'en' | 'es')}
                    disabled={isTranslating}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                      'text-text-soft hover:bg-[rgba(15,23,42,0.5)] hover:text-text-main'
                    } ${isTranslating ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    <FlagIcon countryCode={lang.code} className="w-4 h-4" />
                    <span className="text-[11px] font-semibold tracking-[0.18em]">{lang.code.toUpperCase()}</span>
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
        <>
          {/* Backdrop overlay - click to close */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Mobile menu */}
          <div 
            className="lg:hidden pb-4 px-5 space-y-1 border-t border-[rgba(51,65,85,0.5)] pt-4 relative z-[60]"
            style={{
              background: `
                radial-gradient(circle at top, rgba(129, 140, 248, 0.5), transparent 60%),
                radial-gradient(circle at bottom, rgba(255, 138, 31, 0.4), transparent 60%),
                rgba(3, 7, 18, 0.98)
              `
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
        </>
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

export default function PolitiqueConfidentialite() {
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
            Politique de Confidentialité
          </h1>
          
          <div className="space-y-6 text-text-soft text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">1. Données collectées</h2>
              <p className="mb-3">
                Les données personnelles collectées sur le site FLAZY peuvent inclure notamment :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                <li>l'adresse email</li>
                <li>les informations liées au compte utilisateur</li>
                <li>les données nécessaires au paiement et à la facturation</li>
                <li>les données techniques liées à l'utilisation du service</li>
              </ul>
              <p>
                Certaines données techniques peuvent être collectées automatiquement lors de l'utilisation du site, notamment l'adresse IP, le type de navigateur, le système d'exploitation et les logs de connexion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">2. Finalités du traitement</h2>
              <p className="mb-3">
                Les données personnelles sont collectées afin de :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                <li>permettre l'accès et l'utilisation du service</li>
                <li>gérer les comptes utilisateurs</li>
                <li>traiter les paiements et transactions</li>
                <li>assurer le support client</li>
                <li>améliorer le fonctionnement du service</li>
              </ul>
              <p>
                Les données peuvent également être utilisées à des fins de sécurité, de prévention des fraudes et de respect des obligations légales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">3. Partage des données</h2>
              <p className="mb-3">
                Les données personnelles peuvent être partagées uniquement avec des prestataires tiers nécessaires au fonctionnement du service (hébergement, paiement, outils techniques).
              </p>
              <p className="mb-3">
                FLAZY ne vend ni ne loue les données personnelles des utilisateurs à des tiers.
              </p>
              <p>
                Les prestataires tiers n'ont accès aux données que dans la limite strictement nécessaire à l'exécution de leurs services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">4. Transfert hors Union européenne</h2>
              <p>
                Certaines données peuvent être transférées et traitées en dehors de l'Union européenne, notamment lorsque des prestataires techniques ou d'hébergement sont situés hors UE. Dans ce cas, FLAZY s'assure que des garanties appropriées sont mises en place conformément à la réglementation applicable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">5. Responsabilité de l'utilisateur</h2>
              <p className="mb-3">
                L'utilisateur est responsable des informations qu'il fournit lors de l'utilisation du service.
              </p>
              <p>
                L'utilisateur s'engage à fournir des informations exactes, complètes et à jour.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">6. Limitation de responsabilité</h2>
              <p className="mb-3">
                FLAZY met en œuvre des moyens raisonnables pour protéger les données personnelles.
              </p>
              <p>
                FLAZY ne pourra être tenu responsable des dommages résultant d'un accès non autorisé aux données lorsque celui-ci résulte de facteurs indépendants de sa volonté.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">7. Droits des utilisateurs</h2>
              <p className="mb-3">
                Vous disposez des droits suivants concernant vos données personnelles :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                <li><strong>Droit d'opposition :</strong> vous pouvez vous opposer au traitement de vos données</li>
                <li><strong>Droit à la limitation :</strong> vous pouvez demander la limitation du traitement</li>
                <li><strong>Droit d'accès :</strong> obtenir une copie des données personnelles vous concernant</li>
                <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données, dans les limites prévues par la loi</li>
              </ul>
              <p className="mb-3">
                Pour exercer ces droits, contactez-nous à : <strong translate="no">Support@flazy.app</strong>
              </p>
              <p>
                Vous disposez également du droit d'introduire une réclamation auprès de l'autorité de contrôle compétente, notamment la CNIL.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">8. Sécurité des données</h2>
              <p className="mb-3">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, perte, destruction ou altération.
              </p>
              <p className="mb-3">
                Cependant, aucune méthode de transmission sur Internet n'est totalement sécurisée.
              </p>
              <p>
                FLAZY ne peut garantir une sécurité absolue des données transmises ou stockées.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">9. Cookies</h2>
              <p className="mb-3">
                Notre site utilise des cookies techniques nécessaires au fonctionnement du service. Nous n'utilisons pas de cookies de tracking publicitaire sans votre consentement explicite.
              </p>
              <p>
                L'utilisateur peut configurer son navigateur afin de refuser les cookies ou être informé de leur utilisation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">10. Conservation des données</h2>
              <p>
                Les données personnelles sont conservées uniquement pendant la durée nécessaire aux finalités pour lesquelles elles sont collectées et traitées, sauf obligation légale contraire.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">11. Modifications</h2>
              <p>
                Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications entrent en vigueur dès leur publication sur cette page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">12. Contact</h2>
              <p>
                Pour toute question concernant cette politique de confidentialité ou vos données personnelles, contactez-nous à : <strong translate="no">Support@flazy.app</strong>
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
