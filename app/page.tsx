'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

// Header Component
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[rgba(5,6,18,0.95)] border-b border-[rgba(51,65,85,0.5)] shadow-xl">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-11 h-11 rounded-2xl bg-[radial-gradient(circle_at_20%_10%,#ffe29f,#ff8a1f_45%,#ff4b2b_90%)] shadow-[0_0_0_1px_rgba(15,23,42,0.9),0_8px_32px_rgba(255,138,31,0.3)] flex items-center justify-center text-xl font-extrabold text-gray-900 transition-transform duration-300 group-hover:scale-110">
              F
            </div>
            <div className="font-extrabold tracking-[0.15em] uppercase text-lg">FLAZY</div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {[
              { id: 'generer', label: 'Générer une vidéo', type: 'scroll' },
              { id: 'steps', label: 'Comment ça marche', type: 'scroll' },
              { id: 'examples', label: 'Exemples', type: 'scroll' },
              { id: 'faq', label: 'FAQ', type: 'scroll' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 text-sm text-text-soft hover:text-text-main transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/carrousel"
              className="hidden sm:flex items-center justify-center px-6 py-2.5 rounded-full border border-[rgba(252,211,77,0.6)] bg-[rgba(252,211,77,0.1)] backdrop-blur-sm text-text-soft text-sm font-semibold transition-all duration-300 hover:bg-[rgba(252,211,77,0.2)] hover:border-[rgba(252,211,77,0.9)] hover:text-text-main hover:scale-105"
            >
              Feed
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-text-soft"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            {[
              { id: 'generer', label: 'Générer une vidéo' },
              { id: 'steps', label: 'Comment ça marche' },
              { id: 'examples', label: 'Exemples' },
              { id: 'faq', label: 'FAQ' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-4 py-2 text-sm text-text-soft hover:text-text-main"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}

// Hero Component
function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const scrollToForm = () => {
    const element = document.getElementById('generer')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative flex items-center justify-center px-6 lg:px-8 py-32">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(252,211,77,0.1)] border border-[rgba(252,211,77,0.3)] w-fit">
              <span className="text-xs font-semibold text-accent-gold">Générateur FLAZY maintenant disponible</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
              Générateur de Vidéos IA Virales & Monétisables
            </h1>
            <p className="text-lg text-text-soft">
              Transformez vos idées en vidéos de 10 secondes prêtes à poster sur TikTok, Reels Instagram et YouTube Shorts. Simple, rapide et efficace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToForm}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-accent-orange to-accent-red text-white font-semibold hover:scale-105 transition-transform duration-300"
              >
                Créer ma vidéo virale
              </button>
              <Link
                href="/carrousel"
                className="px-8 py-4 rounded-full border-2 border-accent-orange text-accent-orange font-semibold hover:bg-accent-orange hover:text-white transition-all duration-300 text-center"
              >
                Feed
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center w-full">
            <div className="relative w-full max-w-[520px] bg-[rgba(6,9,22,0.95)] backdrop-blur-xl rounded-[32px] p-8 border-2 border-[rgba(252,211,77,0.6)] shadow-[0_0_0_1px_rgba(252,211,77,0.2),0_25px_50px_rgba(0,0,0,0.9),0_0_60px_rgba(255,138,31,0.15)]">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <div className="px-4 py-2 rounded-full bg-[rgba(15,23,42,0.95)] border-2 border-[rgba(252,211,77,0.8)] backdrop-blur-sm shadow-lg">
                    <span className="text-xs font-bold text-accent-orange-soft">Aperçu vidéo FLAZY</span>
                  </div>
                  <div className="px-4 py-2 rounded-full text-[10px] bg-[rgba(15,23,42,0.95)] border-2 border-[rgba(252,211,77,0.8)] backdrop-blur-sm shadow-lg">
                    <span className="text-accent-orange-soft font-bold">Vidéo IA virale 9:16</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-[1fr_1.2fr] gap-6 items-stretch">
                  <div className="relative group">
                    {/* Outer glow */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-accent-orange/30 via-accent-red/30 to-accent-orange/30 rounded-[20px] blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    
                    <div className="relative rounded-[20px] overflow-hidden bg-[#0a0e1a] aspect-[9/16] border-2 border-[rgba(252,211,77,0.9)] shadow-[inset_0_0_30px_rgba(0,0,0,0.5),0_10px_30px_rgba(0,0,0,0.8)]">
                      <video
                        ref={videoRef}
                        src="/placeholder.mp4"
                        muted
                        loop
                        playsInline
                        autoPlay
                        className="relative z-10 w-full h-full object-cover"
                      />
                      <button
                        onClick={togglePlayPause}
                        className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm"
                      >
                        <div className="relative w-16 h-16 rounded-full bg-[rgba(15,23,42,0.95)] border-2 border-[rgba(252,211,77,0.9)] flex items-center justify-center shadow-[0_0_20px_rgba(255,138,31,0.5),0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-sm hover:scale-110 transition-transform">
                          {isPlaying ? (
                            <svg className="w-7 h-7 text-accent-orange-soft ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                          ) : (
                            <svg className="w-7 h-7 text-accent-orange-soft ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 justify-center">
                    <div className="relative">
                      <div className="text-lg font-bold bg-gradient-to-r from-accent-orange-soft via-accent-gold to-accent-orange-soft bg-clip-text text-transparent leading-tight">
                        2,3M vues potentielles*
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-orange rounded-full animate-pulse shadow-[0_0_10px_rgba(255,138,31,0.8)]"></div>
                    </div>
                    <div className="text-xs text-text-soft leading-relaxed bg-[rgba(15,23,42,0.6)] rounded-xl p-4 border border-[rgba(51,65,85,0.5)] backdrop-blur-sm">
                      Hook optimisé pour capter l'attention dès la première seconde, montage adapté aux formats très courts.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Form Section Component
function FormSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [prompt, setPrompt] = useState('')
  const [allowPublic, setAllowPublic] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setVideoFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name || !email || !prompt || !videoFile) {
      setError('Veuillez remplir tous les champs requis.')
      return
    }

    setIsLoading(true)

    try {
      const filePath = `flazy/${Date.now()}-${videoFile.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, videoFile)

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      const { data: urlData } = supabase.storage.from('videos').getPublicUrl(filePath)
      const videoPath = urlData.publicUrl

      console.log('Uploaded video path:', filePath)
      console.log('Video public URL:', videoPath)

      console.log('Calling /api/create-checkout-session...')
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, prompt, allowPublic, videoPath }),
      })

      console.log('create-checkout-session status:', res.status)
      const data = await res.json()
      console.log('create-checkout-session response:', data)

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session de paiement.')
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('URL de paiement non disponible.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.')
      console.error('Form submission error:', err)
      setIsLoading(false)
    }
  }

  return (
    <section id="generer" className="py-20 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">Générer une vidéo</h2>
          <p className="text-text-soft">Remplissez le formulaire ci-dessous pour créer votre vidéo virale</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[rgba(6,9,22,0.8)] backdrop-blur-sm border border-[rgba(51,65,85,0.5)] rounded-2xl p-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(15,23,42,0.6)] border border-[rgba(51,65,85,0.5)] text-text-main focus:outline-none focus:border-accent-orange transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(15,23,42,0.6)] border border-[rgba(51,65,85,0.5)] text-text-main focus:outline-none focus:border-accent-orange transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="prompt" className="block text-sm font-semibold mb-2">
              Décrivez votre vidéo
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(15,23,42,0.6)] border border-[rgba(51,65,85,0.5)] text-text-main focus:outline-none focus:border-accent-orange transition-colors resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Téléversez votre vidéo
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-accent-orange bg-[rgba(255,138,31,0.1)]'
                  : 'border-[rgba(51,65,85,0.5)] bg-[rgba(15,23,42,0.3)]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {videoFile ? (
                <div className="space-y-2">
                  <p className="text-text-main font-semibold">{videoFile.name}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="text-sm text-accent-orange hover:underline"
                  >
                    Changer de fichier
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-text-soft">Glissez-déposez votre vidéo ici ou</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-accent-orange hover:underline font-semibold"
                  >
                    Parcourir les fichiers
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="allowPublic"
              checked={allowPublic}
              onChange={(e) => setAllowPublic(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-[rgba(51,65,85,0.5)] bg-[rgba(15,23,42,0.6)] text-accent-orange focus:ring-accent-orange"
            />
            <label htmlFor="allowPublic" className="text-sm text-text-soft">
              J'autorise ma vidéo à être publiée dans le carrousel public de FLAZY.
            </label>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-accent-orange to-accent-red text-white font-semibold hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? 'Téléversement en cours...' : 'Continuer'}
          </button>
        </form>
      </div>
    </section>
  )
}

// Steps Section
function StepsSection() {
  return (
    <section id="steps" className="py-20 px-6 lg:px-8 bg-[rgba(6,9,22,0.4)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">Comment ça marche</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              step: '1', 
              title: 'Remplissez le formulaire', 
              desc: 'Décrivez votre vidéo en détail : type de contenu, ambiance, message et langue. Téléversez vos fichiers vidéo si nécessaire. Plus votre description est précise, meilleur sera le résultat.' 
            },
            { 
              step: '2', 
              title: 'Paiement sécurisé', 
              desc: 'Effectuez le paiement de manière sécurisée via Stripe. Vos informations sont protégées et cryptées. Vous recevez une confirmation par email avec le suivi de votre commande.' 
            },
            { 
              step: '3', 
              title: 'Recevez votre vidéo', 
              desc: 'Votre vidéo est générée automatiquement en quelques minutes. Vous la recevez par email dans un format optimisé pour TikTok, Reels et YouTube Shorts, prête à être publiée.' 
            },
          ].map((item) => (
            <div key={item.step} className="relative bg-[rgba(6,9,22,0.8)] border border-[rgba(51,65,85,0.5)] rounded-2xl p-8 pt-12">
              <div className="absolute -top-5 -left-5 w-14 h-14 rounded-xl bg-gradient-to-br from-accent-orange to-accent-red flex items-center justify-center shadow-[0_8px_24px_rgba(255,138,31,0.4)] border-2 border-[rgba(6,9,22,0.9)] z-10">
                <span className="text-2xl font-extrabold text-[#111827]">{item.step}</span>
              </div>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-text-soft">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Examples Section
function ExamplesSection() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const examples = [
    {
      title: 'Vidéos Viralité',
      tag: 'Interview / plateau / info',
      desc: 'Formats type plateau TV, interview, témoignage ou info virale, pensés pour crédibiliser votre message et maximiser les vues et les partages.',
    },
    {
      title: 'Vidéos Boost',
      tag: 'Publicité et retours clients',
      desc: 'Vidéos orientées conversion : publicité, mise en avant d\'offre, retours clients mis en scène et hooks puissants pour booster votre business.',
    },
    {
      title: 'Motivation et Vibes',
      tag: 'Mindset et lifestyle',
      desc: 'Scènes stylées type voiture de luxe, skyline ou Dubaï avec messages motivants, listes pourquoi tu ne réussis pas ou citations impactantes.',
    },
    {
      title: 'Divertissement',
      tag: 'Humour et insolite',
      desc: 'Contenus fun, insolites ou décalés pour divertir, faire réagir votre audience et alimenter vos comptes de manière régulière.',
    },
    {
      title: 'Détente',
      tag: 'ASMR, animaux et paysages',
      desc: 'Vidéos relaxantes : sons doux, ASMR visuel, animaux, paysages esthétiques ou ambiance zen, parfaites pour des comptes chill et apaisants.',
    },
    {
      title: 'Mystère et Frisson',
      tag: 'Caméra de surveillance',
      desc: 'Caméra de surveillance, ambiance thriller léger, bruits étranges, scènes bizarres mais safe pour le public. Idéal pour créer de la tension sans choquer.',
    },
  ]

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index]
    if (!video) return

    if (playingIndex === index) {
      // Pause if already playing
      video.pause()
      setPlayingIndex(null)
    } else {
      // Pause all other videos
      videoRefs.current.forEach((v, i) => {
        if (v && i !== index) {
          v.pause()
          v.currentTime = 0
        }
      })
      // Play clicked video
      video.play()
      setPlayingIndex(index)
    }
  }

  return (
    <section id="examples" className="py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-wider text-accent-orange-soft mb-2">Exemples de vidéos virales</div>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">Aperçu des vidéos que vous pouvez générer avec FLAZY</h2>
          <p className="text-text-soft max-w-3xl mx-auto">
            Chaque exemple ci-dessous correspond à une catégorie FLAZY : Viralité, Boost, Motivation / Vibes, Divertissement, Détente et Mystère & Frisson.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {examples.map((example, i) => (
            <div
              key={i}
              className="bg-[radial-gradient(circle_at_top,rgba(255,138,31,0.16),transparent_60%),rgba(6,9,22,0.98)] border border-[rgba(252,211,77,0.85)] rounded-2xl p-4 flex flex-col gap-3 shadow-[0_18px_40px_rgba(0,0,0,0.8)]"
            >
              <div
                className="w-full aspect-[9/16] rounded-2xl overflow-hidden border border-[rgba(252,211,77,0.7)] bg-[#020617] cursor-pointer relative group"
                onClick={() => handleVideoClick(i)}
              >
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  src="/placeholder.mp4"
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  onEnded={() => setPlayingIndex(null)}
                />
                {playingIndex !== i && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-[rgba(15,23,42,0.9)] border-2 border-white/30 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-sm font-semibold text-text-main">{example.title}</div>
              <div className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-[rgba(252,211,77,0.8)] bg-[rgba(15,23,42,0.96)] text-accent-orange-soft w-fit">
                {example.tag}
              </div>
              <p className="text-xs text-text-soft">{example.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      q: 'Comment fonctionne FLAZY ?',
      a: 'FLAZY utilise l\'intelligence artificielle pour générer des vidéos virales à partir de vos descriptions. Remplissez simplement le formulaire, effectuez le paiement, et recevez votre vidéo.',
    },
    {
      q: 'Combien de temps faut-il pour générer une vidéo ?',
      a: 'La génération d\'une vidéo prend généralement entre 24 et 48 heures après confirmation du paiement.',
    },
    {
      q: 'Puis-je utiliser ma vidéo commercialement ?',
      a: 'Oui, toutes les vidéos générées peuvent être utilisées à des fins commerciales.',
    },
    {
      q: 'Que se passe-t-il si je ne suis pas satisfait ?',
      a: 'Contactez-nous et nous travaillerons avec vous pour améliorer votre vidéo ou trouver une solution.',
    },
  ]

  return (
    <section id="faq" className="py-20 px-6 lg:px-8 bg-[rgba(6,9,22,0.4)]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">FAQ</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[rgba(6,9,22,0.8)] border border-[rgba(51,65,85,0.5)] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[rgba(15,23,42,0.5)] transition-colors"
              >
                <span className="font-semibold">{faq.q}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 border-t border-[rgba(51,65,85,0.5)] text-text-soft">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer Component
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 px-6 lg:px-8 border-t border-[rgba(30,41,59,0.9)] bg-[rgba(3,7,18,0.98)] text-[11px] text-text-muted">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>© {currentYear} FLAZY. Tous droits réservés.</div>
          <div className="flex gap-4 flex-wrap">
            <a href="#" className="text-text-muted hover:text-text-main transition-colors">
              Mentions légales
            </a>
            <a href="#" className="text-text-muted hover:text-text-main transition-colors">
              Conditions générales
            </a>
            <a href="#" className="text-text-muted hover:text-text-main transition-colors">
              Politique de confidentialité
            </a>
            <a href="mailto:Flazy.orders@gmail.com" className="text-text-muted hover:text-text-main transition-colors">
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
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <FormSection />
      <StepsSection />
      <ExamplesSection />
      <FAQSection />
      <Footer />
    </main>
  )
}

