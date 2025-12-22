'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function CheckoutPage() {
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
        <div className="w-full max-w-2xl">
          <div className="bg-[rgba(6,9,22,0.98)] rounded-[22px] p-8 md:p-12 border border-[rgba(252,211,77,0.75)] shadow-[0_18px_40px_rgba(0,0,0,0.8)] text-center"
            style={{
              background: `
                radial-gradient(circle at top, rgba(255, 138, 31, 0.22), transparent 60%),
                rgba(6, 9, 22, 0.98)
              `
            }}
          >
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[rgba(255,138,31,0.2)] flex items-center justify-center">
                <svg className="w-10 h-10 text-accent-orange-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold mb-4">Finaliser votre pack</h1>
              <p className="text-base text-text-soft max-w-md mx-auto leading-relaxed">
                Paiement et activation du pack seront disponibles bientôt.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-transparent text-accent-orange-soft border border-[rgba(248,181,86,0.95)] shadow-[0_0_0_1px_rgba(248,181,86,0.4)] text-[13px] font-semibold transition-all duration-[0.18s] ease-out hover:bg-[radial-gradient(circle_at_top_left,rgba(255,138,31,0.16),transparent_70%)] hover:border-[rgba(248,181,86,1)]"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

