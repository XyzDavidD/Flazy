'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-[18px] bg-gradient-to-b from-[rgba(5,6,18,0.96)] to-[rgba(5,6,18,0.9)] border-b border-[rgba(51,65,85,0.85)]">
      <nav className="relative flex items-center justify-between py-[14px] px-5 max-w-[1120px] mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="FLAZY Logo"
              width={48}
              height={48}
              className="w-12 h-12"
              priority
            />
            <div>
              <div className="font-extrabold tracking-[0.08em] uppercase text-[15px]">FLAZY</div>
              <div className="text-[11px] text-text-muted">Vidéos IA virales prêtes à poster</div>
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-[18px] text-[13px] text-text-muted absolute left-1/2 -translate-x-1/2">
          <button
            onClick={() => scrollToSection('prompt-zone')}
            className="relative cursor-pointer transition-colors duration-[0.18s] ease-out hover:text-text-main after:content-[''] after:absolute after:left-0 after:-bottom-[6px] after:w-0 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#ffb347] after:via-[#ff8a1f] after:to-[#ff4b2b] after:transition-all after:duration-[0.18s] after:ease-out hover:after:w-[18px]"
          >
            Créer
          </button>
          <button
            onClick={() => scrollToSection('examples')}
            className="relative cursor-pointer transition-colors duration-[0.18s] ease-out hover:text-text-main after:content-[''] after:absolute after:left-0 after:-bottom-[6px] after:w-0 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#ffb347] after:via-[#ff8a1f] after:to-[#ff4b2b] after:transition-all after:duration-[0.18s] after:ease-out hover:after:w-[18px]"
          >
            Exemples
          </button>
          <button
            onClick={() => scrollToSection('tarifs')}
            className="relative cursor-pointer transition-colors duration-[0.18s] ease-out hover:text-text-main after:content-[''] after:absolute after:left-0 after:-bottom-[6px] after:w-0 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#ffb347] after:via-[#ff8a1f] after:to-[#ff4b2b] after:transition-all after:duration-[0.18s] after:ease-out hover:after:w-[18px]"
          >
            Tarifs
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="relative cursor-pointer transition-colors duration-[0.18s] ease-out hover:text-text-main after:content-[''] after:absolute after:left-0 after:-bottom-[6px] after:w-0 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#ffb347] after:via-[#ff8a1f] after:to-[#ff4b2b] after:transition-all after:duration-[0.18s] after:ease-out hover:after:w-[18px]"
          >
            FAQ
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const element = document.getElementById('carousel')
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="hidden sm:flex items-center justify-center px-4 py-2 rounded-full border border-[rgba(148,163,184,0.7)] bg-transparent text-text-soft text-[13px] font-semibold transition-all duration-[0.18s] ease-out hover:bg-[rgba(15,23,42,0.9)] hover:text-text-main hover:border-[rgba(203,213,225,0.9)]"
          >
            Feed
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-text-soft"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden pb-4 px-5 space-y-2 border-t border-[rgba(51,65,85,0.5)] pt-4">
          <button
            onClick={() => scrollToSection('prompt-zone')}
            className="block w-full text-left px-4 py-2 text-sm text-text-soft hover:text-text-main transition-colors"
          >
            Créer
          </button>
          <button
            onClick={() => scrollToSection('examples')}
            className="block w-full text-left px-4 py-2 text-sm text-text-soft hover:text-text-main transition-colors"
          >
            Exemples
          </button>
          <button
            onClick={() => scrollToSection('tarifs')}
            className="block w-full text-left px-4 py-2 text-sm text-text-soft hover:text-text-main transition-colors"
          >
            Tarifs
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="block w-full text-left px-4 py-2 text-sm text-text-soft hover:text-text-main transition-colors"
          >
            FAQ
          </button>
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

  const scrollToPricing = () => {
    const element = document.getElementById('tarifs')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="hero mt-2 pb-12">
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

              <button
                onClick={scrollToPricing}
                className="bg-transparent text-white border border-[rgba(248,181,86,0.95)] shadow-[0_0_0_1px_rgba(248,181,86,0.4)] rounded-full text-[13px] font-semibold px-6 py-3 cursor-pointer inline-flex items-center gap-2 transition-all duration-[0.18s] ease-out hover:bg-[radial-gradient(circle_at_top_left,rgba(255,138,31,0.16),transparent_70%)] hover:border-[rgba(248,181,86,1)]"
              >
                Voir les offres et les packs
              </button>
            </div>

            <div className="flex flex-wrap gap-6 items-center text-xs text-white mt-4 justify-center">
              <div className="inline-flex items-center gap-2">
                <div className="w-[18px] h-[18px] rounded-full bg-[radial-gradient(circle_at_30%_0,#ffe29f,#ff8a1f_50%,#ff4b2b_90%)] flex items-center justify-center">
                  <Lock className="w-3 h-3 text-[#111827]" />
                </div>
                <span>Paiement sécurisé</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <div className="w-[18px] h-[18px] rounded-full bg-[radial-gradient(circle_at_30%_0,#ffe29f,#ff8a1f_50%,#ff4b2b_90%)] flex items-center justify-center">
                  <Shield className="w-3 h-3 text-[#111827]" />
                </div>
                <span>Données protégées</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <div className="w-[18px] h-[18px] rounded-full bg-[radial-gradient(circle_at_30%_0,#ffe29f,#ff8a1f_50%,#ff4b2b_90%)] flex items-center justify-center">
                  <Zap className="w-3 h-3 text-[#111827]" />
                </div>
                <span>Résultats rapides</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Carousel Component - EXACT LOGIC FROM CAROUSEL PAGE
function CarouselSection() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  interface VideoData {
    id: string
    videoUrl: string
    pseudo: string
    prompt: string
  }

  // Fetch videos from Supabase
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true)

        // Fetch submissions where payment_status = 'paid' AND allow_public = true AND video_path is not null/empty
        const { data, error } = await supabase
          .from('submissions')
          .select('id, name, prompt, video_path')
          .eq('payment_status', 'paid')
          .eq('allow_public', true)
          .not('video_path', 'is', null)
          .neq('video_path', '') // Also filter out empty strings
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching videos:', error)
          return
        }

        if (!data || data.length === 0) {
          setVideos([])
          return
        }

        // Map the data to VideoData format and handle video_path
        const mappedVideos: VideoData[] = data
          .filter((submission) => submission.video_path && submission.video_path.trim() !== '') // Additional safety check for non-empty strings
          .map((submission) => {
            let videoUrl: string

            // Check if video_path is already a full URL
            if (submission.video_path.startsWith('http')) {
              videoUrl = submission.video_path
            } else {
              // Get public URL from Supabase Storage
              const { data: urlData } = supabase.storage
                .from('videos')
                .getPublicUrl(submission.video_path)
              videoUrl = urlData.publicUrl
            }

            return {
              id: submission.id,
              videoUrl,
              pseudo: submission.name,
              prompt: submission.prompt,
            }
          })

        setVideos(mappedVideos)
      } catch (error) {
        console.error('Error fetching videos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const currentVideo = videos[currentIndex]

  // Navigate to previous video
  const goToPrevious = useCallback(() => {
    if (videos.length === 0) return
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1))
    setIsPlaying(true)
  }, [videos.length])

  // Navigate to next video
  const goToNext = useCallback(() => {
    if (videos.length === 0) return
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1))
    setIsPlaying(true)
  }, [videos.length])

  // Handle video play/pause
  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  // Handle mute/unmute
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  // Reset video when index changes
  useEffect(() => {
    if (videoRef.current && currentVideo) {
      videoRef.current.load()
      videoRef.current.play().catch(() => {
        // Autoplay might fail, handle silently
      })
      setIsPlaying(true)
    }
  }, [currentIndex, currentVideo])

  // Sync state with video events
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handlePlay = () => setIsPlaying(true)
      const handlePause = () => setIsPlaying(false)

      video.addEventListener('play', handlePlay)
      video.addEventListener('pause', handlePause)

      return () => {
        video.removeEventListener('play', handlePlay)
        video.removeEventListener('pause', handlePause)
      }
    }
  }, [currentVideo])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle keyboard events when carousel is in view
      const carouselSection = document.getElementById('carousel')
      if (!carouselSection) return
      
      const rect = carouselSection.getBoundingClientRect()
      const isInView = rect.top < window.innerHeight && rect.bottom > 0
      
      if (!isInView) return
      
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === ' ') {
        e.preventDefault()
        togglePlayPause()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [goToPrevious, goToNext, togglePlayPause])

  return (
    <section id="carousel" className="py-12 pb-4">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-left mb-8">
          <div className="text-[11px] uppercase tracking-[0.16em] text-accent-orange-soft mb-1.5 font-semibold">
            Carrousel public
          </div>
          <h2 className="text-[28px] lg:text-[32px] mb-3 font-extrabold leading-tight">
            Découvrez les vidéos créées par la communauté FLAZY
          </h2>
          <p className="text-[14px] lg:text-[15px] text-text-soft max-w-[600px] leading-relaxed">
            Parcourez les vidéos publiques partagées par nos utilisateurs.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="w-16 h-16 border-4 border-[rgba(252,211,77,0.3)] border-t-accent-orange-soft rounded-full animate-spin"></div>
            <p className="text-text-soft text-lg">Chargement des vidéos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Video className="w-16 h-16 text-text-muted mb-4" />
            <p className="text-text-main text-xl font-semibold">Aucune vidéo publique pour le moment.</p>
            <p className="text-text-soft text-sm">Revenez bientôt pour découvrir de nouvelles créations !</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group w-full max-w-md">
              <div className="relative rounded-3xl overflow-hidden bg-[rgba(6,9,22,0.8)] backdrop-blur-sm border border-[rgba(252,211,77,0.3)] shadow-2xl aspect-[9/16]">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-orange/20 via-accent-red/20 to-accent-orange/20 rounded-3xl blur-xl opacity-50"></div>

                <video
                  ref={videoRef}
                  src={currentVideo?.videoUrl}
                  muted={isMuted}
                  loop
                  playsInline
                  autoPlay
                  className="relative z-10 w-full h-full object-cover"
                />

                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlayPause}
                      className="relative w-16 h-16 rounded-full flex items-center justify-center"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff8a1f] via-[#ffd700] to-[#ff4b2b] opacity-60 blur-md"></div>
                      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[rgba(15,23,42,0.98)] via-[rgba(15,23,42,0.95)] to-[rgba(6,9,22,0.98)] border-2 border-[rgba(252,211,77,0.8)] backdrop-blur-sm flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.9),0_0_0_1px_rgba(252,211,77,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
                        {isPlaying ? (
                          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                            <defs>
                              <linearGradient id="carouselPauseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ffd700" />
                                <stop offset="50%" stopColor="#ff8a1f" />
                                <stop offset="100%" stopColor="#ffffff" />
                              </linearGradient>
                            </defs>
                            <rect x="6" y="4" width="4" height="16" rx="1" fill="url(#carouselPauseGradient)" />
                            <rect x="14" y="4" width="4" height="16" rx="1" fill="url(#carouselPauseGradient)" />
                          </svg>
                        ) : (
                          <svg className="w-7 h-7 ml-0.5" viewBox="0 0 24 24" fill="none">
                            <defs>
                              <linearGradient id="carouselPlayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ffd700" />
                                <stop offset="50%" stopColor="#ff8a1f" />
                                <stop offset="100%" stopColor="#ffffff" />
                              </linearGradient>
                            </defs>
                            <path d="M8 5v14l11-7z" fill="url(#carouselPlayGradient)" />
                          </svg>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={toggleMute}
                      className="relative w-16 h-16 rounded-full flex items-center justify-center"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff8a1f] via-[#ffd700] to-[#ff4b2b] opacity-60 blur-md"></div>
                      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[rgba(15,23,42,0.98)] via-[rgba(15,23,42,0.95)] to-[rgba(6,9,22,0.98)] border-2 border-[rgba(252,211,77,0.8)] backdrop-blur-sm flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.9),0_0_0_1px_rgba(252,211,77,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
                        {isMuted ? (
                          <VolumeX className="w-6 h-6 text-white drop-shadow-lg" />
                        ) : (
                          <Volume2 className="w-6 h-6 text-white drop-shadow-lg" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {videos.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[rgba(15,23,42,0.95)] backdrop-blur-sm border-2 border-[rgba(252,211,77,0.5)] flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 hover:border-[rgba(252,211,77,0.9)] hover:bg-[rgba(15,23,42,1)] z-30"
                    aria-label="Vidéo précédente"
                  >
                    <ChevronLeft className="w-6 h-6 text-accent-orange-soft" />
                  </button>

                  <button
                    onClick={goToNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[rgba(15,23,42,0.95)] backdrop-blur-sm border-2 border-[rgba(252,211,77,0.5)] flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 hover:border-[rgba(252,211,77,0.9)] hover:bg-[rgba(15,23,42,1)] z-30"
                    aria-label="Vidéo suivante"
                  >
                    <ChevronRight className="w-6 h-6 text-accent-orange-soft" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// Features/Why Section
function FeaturesSection() {
  return (
    <section id="features" className="py-12 pb-4">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-left mb-8">
          <div className="text-[11px] uppercase tracking-[0.16em] text-accent-orange-soft mb-1.5 font-semibold">
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
    <section id="steps" className="steps pt-12 pb-4">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-left mb-8">
          <div className="text-[11px] uppercase tracking-[0.16em] text-accent-orange-soft mb-1.5 font-semibold">
            Comment ça marche
          </div>
          <h2 className="text-[28px] lg:text-[32px] mb-3 font-extrabold leading-tight">
            En 3 étapes, vos vidéos IA sont prêtes à publier
          </h2>
          <p className="text-[14px] lg:text-[15px] text-text-soft max-w-[600px] leading-relaxed">
            Choisissez votre pack, décrivez la vidéo que vous voulez, et recevez une vidéo prête à poster sur vos
            réseaux.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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
              title: 'Recevez vos vidéos',
              text: 'Vous recevez vos vidéos de 10 secondes prêtes à poster sur TikTok, Reels Instagram ou YouTube Shorts. Format optimisé, aucun montage à faire.',
              icon: Rocket,
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
              key={item.step}
              className="rounded-[22px] p-6 border border-[rgba(252,211,77,0.65)] shadow-[0_18px_40px_rgba(0,0,0,0.8)] text-[13px] text-text-soft hover:border-[rgba(252,211,77,0.9)] transition-all duration-300"
              style={{
                background: `
                  radial-gradient(circle at top left, rgba(255, 138, 31, 0.22), transparent 60%),
                  rgba(6, 9, 22, 0.98)
                `
              }}
            >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-[32px] h-[32px] rounded-full bg-[radial-gradient(circle_at_20%_0,#ffe29f,#ff8a1f_45%,#ff4b2b_90%)] flex items-center justify-center text-[14px] text-[#111827] font-bold shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-base m-0 text-text-main font-semibold">{item.title}</h3>
                </div>
                <p className="m-0 leading-relaxed">{item.text}</p>
                <div className="mt-4 pt-4 border-t border-[rgba(51,65,85,0.3)]">
                  <Icon className="w-5 h-5 text-accent-orange-soft" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Form Section Component - KEEPING EXACT LOGIC FROM ORIGINAL
function FormSection() {
  const [email, setEmail] = useState('')
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !prompt) {
      setError('Veuillez remplir tous les champs requis.')
      return
    }

    setIsLoading(true)

    try {
      // Extract name from email or use default
      const defaultName = email.split('@')[0] || 'Client'

      console.log('Calling /api/create-checkout-session...')
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: defaultName, email, prompt, allowPublic: false }),
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
    <section className="prompt-section pt-16 pb-4">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-left mb-8">
          <div className="text-[11px] uppercase tracking-[0.16em] text-accent-orange-soft mb-1.5 font-semibold">
            Décrivez la vidéo que vous voulez
          </div>
          <h2 className="text-[28px] lg:text-[32px] mb-3 font-extrabold leading-tight">
            Vous écrivez le prompt, FLAZY s'occupe du reste
          </h2>
          <p className="text-[14px] lg:text-[15px] text-text-soft max-w-[600px] leading-relaxed">
            Donnez quelques indications simples et laissez FLAZY transformer vos idées en vidéos prêtes à poster.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
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

            <div className="space-y-5">

              <div>
                <label htmlFor="prompt" className="block text-xs text-text-soft mb-2 font-medium">
                  Décrivez votre vidéo
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="w-full min-h-[160px] resize-y rounded-2xl border border-[rgba(75,85,99,0.95)] bg-[rgba(15,23,42,0.96)] text-text-main px-4 py-3 text-[13px] outline-none transition-all duration-[0.18s] ease-out placeholder:text-text-muted focus:border-accent-orange-soft focus:shadow-[0_0_0_1px_rgba(248,181,86,0.6)] focus:bg-[rgba(15,23,42,0.98)]"
                  placeholder="Exemple : Vidéo verticale 9:16, une femme de 28 ans en blazer élégant, debout devant la Tour Eiffel à Paris en fin d'après-midi, lumière dorée. Elle regarde la caméra et parle d'un ton enthousiaste en français, partageant comment elle a triplé ses ventes grâce à des vidéos quotidiennes. Montage dynamique, sous-titres lisibles, idéal TikTok/Reels."
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs text-text-soft mb-2 font-medium">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[rgba(75,85,99,0.95)] bg-[rgba(15,23,42,0.96)] text-text-main text-[13px] outline-none transition-all duration-[0.18s] ease-out focus:border-accent-orange-soft focus:shadow-[0_0_0_1px_rgba(248,181,86,0.6)] focus:bg-[rgba(15,23,42,0.98)]"
                  required
                />
              </div>

            </div>

            <div className="mt-6 flex items-center justify-between gap-4 text-[11px] text-text-muted">
              <div className="max-w-[280px] leading-relaxed">
                Plus votre description est précise, plus le résultat colle à ce que vous imaginez.
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="relative overflow-hidden bg-transparent text-[#111827] shadow-[0_18px_45px_rgba(0,0,0,0.75)] z-0 rounded-full border-none text-[13px] font-semibold px-[26px] py-3 h-[42px] inline-flex items-center justify-center whitespace-nowrap text-center min-w-[140px] transition-all duration-[0.18s] ease-out hover:-translate-y-px hover:shadow-[0_22px_60px_rgba(0,0,0,0.95)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  position: 'relative',
                }}
              >
                <span className="absolute inset-0 -z-10 rounded-full" style={{
                  backgroundImage: 'linear-gradient(90deg, #ff6b00 0%, #ffd700 25%, #ff4b2b 50%, #ffd700 75%, #ff6b00 100%)',
                  backgroundSize: '220% 100%',
                  animation: 'flazyTopbar 10s ease-in-out infinite alternate'
                }}></span>
                {isLoading ? 'Téléversement...' : 'Générer'}
              </button>
            </div>

            {error && (
              <div className="mt-4 text-xs p-3 rounded-xl border border-[rgba(239,68,68,0.6)] bg-[rgba(239,68,68,0.15)] text-[#fecaca]">
                {error}
              </div>
            )}
          </div>

          <div className="text-[13px] text-text-soft">
            <div className="p-4 rounded-xl bg-[rgba(15,23,42,0.5)] border border-[rgba(51,65,85,0.3)]">
              <p className="text-xs text-text-muted leading-relaxed m-0">
                Une fois votre prompt envoyé, la vidéo est générée automatiquement en quelques minutes.<br />
                Vous la recevez directement par e-mail, prête à poster.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

// Examples Section with Playable Videos
function ExamplesSection() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const setVideoRef = (index: number) => (el: HTMLVideoElement | null) => {
    videoRefs.current[index] = el
  }

  const examples = [
    {
      title: 'Vidéos Viralité',
      tag: 'Interview / plateau / info',
      desc: 'Formats type plateau TV, interview, témoignage ou info virale, pensés pour crédibiliser votre message et maximiser les vues et les partages.',
      icon: TrendingUp,
    },
    {
      title: 'Vidéos Boost',
      tag: 'Publicité et retours clients',
      desc: 'Vidéos orientées conversion : publicité, mise en avant d\'offre, retours clients mis en scène et hooks puissants pour booster votre business.',
      icon: Rocket,
    },
    {
      title: 'Motivation et Vibes',
      tag: 'Mindset et lifestyle',
      desc: 'Scènes stylées type voiture de luxe, skyline ou Dubaï avec messages motivants, listes pourquoi tu ne réussis pas ou citations impactantes.',
      icon: Sparkles,
    },
    {
      title: 'Divertissement',
      tag: 'Humour et insolite',
      desc: 'Contenus fun, insolites ou décalés pour divertir, faire réagir votre audience et alimenter vos comptes de manière régulière.',
      icon: Video,
    },
    {
      title: 'Détente',
      tag: 'ASMR, animaux et paysages',
      desc: 'Vidéos relaxantes : sons doux, ASMR visuel, animaux, paysages esthétiques ou ambiance zen, parfaites pour des comptes chill et apaisants.',
      icon: CheckCircle2,
    },
    {
      title: 'Mystère et Frisson',
      tag: 'Caméra de surveillance',
      desc: 'Caméra de surveillance, ambiance thriller léger, bruits étranges, scènes bizarres mais safe pour le public. Idéal pour créer de la tension sans choquer.',
      icon: Shield,
    },
  ]

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index]
    if (!video) return

    if (playingIndex === index) {
      video.pause()
      setPlayingIndex(null)
    } else {
      videoRefs.current.forEach((v, i) => {
        if (v && i !== index) {
          v.pause()
          v.currentTime = 0
        }
      })
      video.play()
      setPlayingIndex(index)
    }
  }

  return (
    <section id="examples" className="py-12 pb-4">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-left mb-8">
          <div className="text-[11px] uppercase tracking-[0.16em] text-accent-orange-soft mb-1.5 font-semibold">
            Exemples de vidéos virales
          </div>
          <h2 className="text-[28px] lg:text-[32px] mb-3 font-extrabold leading-tight">
            Aperçu des vidéos que vous pouvez générer avec FLAZY
          </h2>
          <p className="text-[14px] lg:text-[15px] text-text-soft max-w-[600px] leading-relaxed">
            Chaque exemple ci-dessous correspond à une catégorie FLAZY : Viralité, Boost, Motivation / Vibes,
            Divertissement, Détente et Mystère & Frisson.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {examples.map((example, i) => {
            const Icon = example.icon
            return (
              <div
              key={i}
              className="rounded-[22px] p-4 border border-[rgba(252,211,77,0.85)] shadow-[0_18px_40px_rgba(0,0,0,0.8)] text-xs text-text-soft flex flex-col gap-3 hover:border-[rgba(252,211,77,1)] transition-all duration-300"
              style={{
                background: `
                  radial-gradient(circle at top, rgba(255, 138, 31, 0.16), transparent 60%),
                  rgba(6, 9, 22, 0.98)
                `
              }}
            >
                <div
                  className="relative rounded-2xl overflow-hidden border border-[rgba(252,211,77,0.7)] aspect-[9/16] mx-auto bg-[#020617] max-w-[160px] cursor-pointer group"
                  onClick={() => handleVideoClick(i)}
                >
                  <video
                    ref={setVideoRef(i)}
                    src="/placeholder.mp4"
                    muted
                    loop
                    playsInline
                    className="w-full h-full block object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="relative w-14 h-14 rounded-full flex items-center justify-center">
                      {/* Outer glow */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff8a1f] via-[#ffd700] to-[#ff4b2b] opacity-50 blur-lg"></div>
                      {/* Main button */}
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[rgba(15,23,42,0.98)] via-[rgba(15,23,42,0.95)] to-[rgba(6,9,22,0.98)] border-2 border-[rgba(252,211,77,0.8)] backdrop-blur-sm flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.9),0_0_0_1px_rgba(252,211,77,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
                        {playingIndex === i ? (
                          <svg className="w-6 h-6 drop-shadow-lg" viewBox="0 0 24 24" fill="none">
                            <defs>
                              <linearGradient id={`pauseGradient${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ffd700" />
                                <stop offset="50%" stopColor="#ff8a1f" />
                                <stop offset="100%" stopColor="#ffffff" />
                              </linearGradient>
                            </defs>
                            <rect x="6" y="4" width="4" height="16" rx="1" fill={`url(#pauseGradient${i})`} />
                            <rect x="14" y="4" width="4" height="16" rx="1" fill={`url(#pauseGradient${i})`} />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 ml-0.5 drop-shadow-lg" viewBox="0 0 24 24" fill="none">
                            <defs>
                              <linearGradient id={`playGradient${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ffd700" />
                                <stop offset="50%" stopColor="#ff8a1f" />
                                <stop offset="100%" stopColor="#ffffff" />
                              </linearGradient>
                            </defs>
                            <path d="M8 5v14l11-7z" fill={`url(#playGradient${i})`} />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Icon className="w-4 h-4 text-accent-orange-soft mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-[14px] font-semibold text-text-main mb-1">{example.title}</div>
                    <div className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border border-[rgba(252,211,77,0.8)] bg-[rgba(15,23,42,0.96)] text-accent-orange-soft w-fit mb-2">
                      {example.tag}
                    </div>
                    <p className="text-xs text-text-soft leading-relaxed m-0">{example.desc}</p>
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
      name: '5 tokens vidéo',
      oldPrice: '24,90€',
      price: '14,90€',
      offer: '40 % Promo',
      desc: 'Idéal pour tester les vidéos IA et commencer à poster du contenu viral.',
      icon: Sparkles,
    },
    {
      badge: 'Pack Creator',
      name: '10 tokens vidéo',
      oldPrice: '41,90€',
      price: '24,90€',
      offer: '40 % Promo',
      desc: 'Parfait pour publier régulièrement, tester de nombreux hooks et trouver ce qui fonctionne.',
      icon: Users,
    },
    {
      badge: 'Pack Pro',
      name: '25 tokens vidéo',
      oldPrice: '84,90€',
      price: '49,90€',
      offer: '40 % Promo',
      desc: 'Idéal pour les créateurs sérieux, les business et les agences qui veulent accélérer leur croissance.',
      icon: TrendingUp,
    },
    {
      badge: 'Pack Boost',
      name: '50 tokens vidéo',
      oldPrice: '149,90€',
      price: '89,90€',
      offer: '40 % Promo',
      desc: 'Le meilleur rapport quantité prix pour exploser votre présence sur les réseaux chaque mois.',
      icon: Rocket,
    },
  ]

  return (
    <section id="tarifs" className="py-12 pb-4">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-left mb-8">
          <div className="text-[11px] uppercase tracking-[0.16em] text-accent-orange-soft mb-1.5 font-semibold">
            Tarifs simples et lisibles
          </div>
          <h2 className="text-[28px] lg:text-[32px] mb-3 font-extrabold leading-tight">
            Choisissez le pack qui correspond à votre rythme
          </h2>
          <p className="text-[14px] lg:text-[15px] text-text-soft max-w-[600px] leading-relaxed">
            Des packs attractifs et adaptés à tous les niveaux.
            <br />
            Plus le pack est élevé, plus le coût unitaire de la vidéo diminue.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {pricingPlans.map((plan, i) => {
            const Icon = plan.icon
            return (
              <div
              key={i}
              className="rounded-[22px] p-5 border border-[rgba(252,211,77,0.95)] shadow-[0_18px_40px_rgba(0,0,0,0.8)] flex flex-col gap-3 relative hover:border-[rgba(252,211,77,1)] transition-all duration-300"
              style={{
                background: `
                  radial-gradient(circle at top, rgba(255, 138, 31, 0.18), transparent 60%),
                  rgba(6, 9, 22, 0.98)
                `
              }}
            >
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-accent-orange-soft font-semibold">
                    {plan.badge}
                  </div>
                  <Icon className="w-5 h-5 text-accent-orange-soft opacity-60" />
                </div>
                <div className="text-[13px] text-text-soft">{plan.name}</div>
                <div className="text-xs text-text-muted line-through">{plan.oldPrice}</div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-2xl font-bold text-text-main">{plan.price}</span>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-[rgba(22,163,74,0.18)] border border-[rgba(22,163,74,0.8)] text-[#bbf7d0]">
                    {plan.offer}
                  </span>
                </div>
                <p className="text-xs text-text-soft min-h-[50px] leading-relaxed">{plan.desc}</p>
                <div className="mt-auto pt-2">
                  <button
                    onClick={scrollToForm}
                    className="w-full bg-transparent text-accent-orange-soft border border-[rgba(248,181,86,0.95)] shadow-[0_0_0_1px_rgba(248,181,86,0.4)] rounded-full text-[13px] font-semibold px-4 py-2.5 cursor-pointer inline-flex items-center justify-center gap-2 transition-all duration-[0.18s] ease-out hover:bg-[radial-gradient(circle_at_top_left,rgba(255,138,31,0.16),transparent_70%)] hover:border-[rgba(248,181,86,1)] hover:scale-105"
                  >
                    Choisir ce pack
                  </button>
                </div>
              </div>
            )
          })}
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
      q: 'Quel est le délai de livraison de mes vidéos ?',
      a: 'Le délai dépend du volume de demandes mais reste très rapide. En général, vos vidéos sont livrées <strong>en quelques minutes</strong> après la validation de votre prompt.',
    },
    {
      q: 'Où puis-je utiliser mes vidéos virales ?',
      a: 'Les vidéos sont optimisées pour les formats courts verticaux 9:16 (TikTok, Reels Instagram, YouTube Shorts, Facebook et autres plateformes mobiles), mais peuvent aussi être générées en <strong>format horizontal 16:9</strong> pour YouTube, vos publicités et autres supports. Vous pouvez les réutiliser sur tous vos comptes.',
    },
    {
      q: 'Que se passe-t-il si j\'arrive au bout de mes tokens ?',
      a: 'Vous pouvez simplement reprendre un pack ou cumuler plusieurs abonnements. Les tokens sont <strong>cumulables</strong> afin de générer autant de vidéos que vous le souhaitez, sans bloquer votre rythme de publication.',
    },
  ]

  return (
    <section id="faq" className="py-12 pb-4">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="text-left mb-8">
          <div className="text-[11px] uppercase tracking-[0.16em] text-accent-orange-soft mb-1.5 font-semibold">
            Questions fréquentes
          </div>
          <h2 className="text-[28px] lg:text-[32px] mb-3 font-extrabold leading-tight">
            Une offre simple sans prise de tête
          </h2>
          <p className="text-[14px] lg:text-[15px] text-text-soft max-w-[600px] leading-relaxed">
            Voici les réponses aux questions que l'on nous pose le plus souvent à propos de FLAZY.
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

// Footer Component
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-6 border-t border-[rgba(30,41,59,0.9)] bg-[rgba(3,7,18,0.98)] text-[11px] text-text-muted mt-12">
      <div className="max-w-[1120px] mx-auto px-5">
        <div className="flex items-center justify-between gap-2.5 flex-wrap">
          <div>© {currentYear} FLAZY. Tous droits réservés.</div>
          <div className="flex gap-3.5 flex-wrap">
            <a href="#" className="text-text-muted hover:text-text-main transition-colors">
              Mentions légales
            </a>
            <a href="#" className="text-text-muted hover:text-text-main transition-colors">
              Conditions générales
            </a>
            <a href="#" className="text-text-muted hover:text-text-main transition-colors">
              Politique de confidentialité
            </a>
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
  return (
    <div className="min-h-screen" style={{
      background: `
        radial-gradient(circle at top right, rgba(255, 138, 31, 0.24), transparent 58%),
        radial-gradient(circle at bottom left, rgba(56, 189, 248, 0.22), transparent 60%),
        radial-gradient(circle at bottom right, rgba(129, 140, 248, 0.4), transparent 58%),
        #020314
      `
    }}>
      <TopBar />
      <Header />
      <main className="py-8 pb-12">
        <Hero />
        <FormSection />
        <ExamplesSection />
        <CarouselSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
