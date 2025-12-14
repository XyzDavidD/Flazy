'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SuccessPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-6 lg:px-8 py-20">
      <div className="max-w-2xl mx-auto w-full text-center">
        <div className="bg-[rgba(6,9,22,0.95)] backdrop-blur-xl rounded-[32px] p-12 border-2 border-[rgba(252,211,77,0.6)] shadow-[0_0_0_1px_rgba(252,211,77,0.2),0_25px_50px_rgba(0,0,0,0.9),0_0_60px_rgba(255,138,31,0.15)]">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-full blur-xl animate-pulse"></div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-accent-orange-soft via-accent-gold to-accent-orange-soft bg-clip-text text-transparent">
            Paiement réussi !
          </h1>

          {/* Message */}
          <p className="text-lg text-text-soft mb-8 max-w-md mx-auto">
            Merci pour votre commande. Votre paiement a été traité avec succès. Votre vidéo sera générée et vous la recevrez par email dans les prochaines minutes.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-accent-orange to-accent-red text-white font-semibold hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              Retour à l'accueil
            </Link>
            <Link
              href="/carrousel"
              className="px-8 py-4 rounded-full border-2 border-accent-orange text-accent-orange font-semibold hover:bg-accent-orange hover:text-white transition-all duration-300 shadow-lg"
            >
              Voir le carrousel
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-10 pt-8 border-t border-[rgba(51,65,85,0.5)]">
            <p className="text-sm text-text-muted">
              Vous recevrez un email de confirmation avec tous les détails de votre commande.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

