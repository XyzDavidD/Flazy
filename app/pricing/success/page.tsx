'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle2 } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <div className="min-h-screen" style={{
      background: `
        radial-gradient(circle at top right, rgba(255, 138, 31, 0.4), transparent 58%),
        radial-gradient(circle at bottom left, rgba(56, 189, 248, 0.22), transparent 60%),
        radial-gradient(circle at bottom right, rgba(129, 140, 248, 0.4), transparent 58%),
        #020314
      `
    }}>
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

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-5">
        <div className="max-w-2xl mx-auto w-full text-center">
          <div className="bg-[rgba(6,9,22,0.95)] backdrop-blur-xl rounded-[32px] p-12 border-2 border-[rgba(252,211,77,0.6)] shadow-[0_0_0_1px_rgba(252,211,77,0.2),0_25px_50px_rgba(0,0,0,0.9),0_0_60px_rgba(255,138,31,0.15)]">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-full blur-xl animate-pulse"></div>
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-accent-orange-soft via-accent-gold to-accent-orange-soft bg-clip-text text-transparent">
              Paiement réussi !
            </h1>

            <p className="text-lg text-text-soft mb-8 max-w-md mx-auto">
              Merci pour votre achat. Vos tokens ont été ajoutés à votre compte et sont maintenant disponibles pour générer des vidéos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/"
                className="relative overflow-hidden bg-transparent text-[#000] shadow-[0_18px_45px_rgba(0,0,0,0.75)] z-0 rounded-full border-none text-[13px] font-semibold px-8 py-4 inline-flex items-center justify-center gap-2 transition-all duration-[0.18s] ease-out hover:-translate-y-px hover:shadow-[0_22px_60px_rgba(0,0,0,0.95)]"
                style={{
                  position: 'relative',
                }}
              >
                <span className="absolute inset-0 -z-10 rounded-full" style={{
                  backgroundImage: 'linear-gradient(135deg, #ff6b00 0%, #ffd700 25%, #ff8a1f 50%, #ff4b2b 75%, #ffd700 100%)'
                }}></span>
                Retour à l'accueil
              </Link>
            </div>

            {sessionId && (
              <div className="mt-10 pt-8 border-t border-[rgba(51,65,85,0.5)]">
                <p className="text-xs text-text-muted">
                  ID de session : {sessionId}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PricingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{
        background: `
          radial-gradient(circle at top right, rgba(255, 138, 31, 0.4), transparent 58%),
          radial-gradient(circle at bottom left, rgba(56, 189, 248, 0.22), transparent 60%),
          radial-gradient(circle at bottom right, rgba(129, 140, 248, 0.4), transparent 58%),
          #020314
        `
      }}>
        <div className="text-text-soft">Chargement...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}

