'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import {
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Video,
  Loader2,
} from 'lucide-react'

export default function CarouselPage() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Swipe gesture state
  const touchStartY = useRef<number>(0)
  const touchEndY = useRef<number>(0)
  const minSwipeDistance = 50

  interface VideoData {
    id: string
    videoUrl: string
  }

  // Fetch videos from carousel_videos table
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true)

        const { data, error } = await supabase
          .from('carousel_videos')
          .select('id, video_path')
          .eq('is_published', true)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching videos:', error)
          return
        }

        if (!data || data.length === 0) {
          setVideos([])
          return
        }

        const mappedVideos: VideoData[] = data
          .filter((video) => video.video_path && video.video_path.trim() !== '')
          .map((video) => {
            const { data: urlData } = supabase.storage
              .from('videos')
              .getPublicUrl(video.video_path)
            
            return {
              id: video.id,
              videoUrl: urlData.publicUrl,
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

  // Navigate to previous video (up)
  const goToPrevious = useCallback(() => {
    if (videos.length === 0 || isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1))
    setIsPlaying(true)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [videos.length, isTransitioning])

  // Navigate to next video (down)
  const goToNext = useCallback(() => {
    if (videos.length === 0 || isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1))
    setIsPlaying(true)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [videos.length, isTransitioning])

  // Handle video play/pause (click/tap on video)
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
  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
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

  // Touch handlers for swipe gestures - improved for better detection
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.targetTouches[0].clientY
    touchEndY.current = e.targetTouches[0].clientY
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.targetTouches[0].clientY
  }

  const onTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return
    
    const distance = touchStartY.current - touchEndY.current
    
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swiped up - next video
        goToNext()
      } else {
        // Swiped down - previous video
        goToPrevious()
      }
    }
    
    touchStartY.current = 0
    touchEndY.current = 0
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        goToPrevious()
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        goToNext()
      }
      if (e.key === ' ') {
        e.preventDefault()
        togglePlayPause()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [goToPrevious, goToNext, togglePlayPause])

  // Prevent body scroll on mobile only
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div 
      className="fixed inset-0 md:relative md:min-h-screen bg-black md:bg-[#020314]"
      style={{
        background: `
          radial-gradient(circle 800px at top right, rgba(255, 138, 31, 0.4), transparent),
          radial-gradient(circle 600px at bottom left, rgba(56, 189, 248, 0.22), transparent),
          radial-gradient(circle 800px at bottom right, rgba(129, 140, 248, 0.4), transparent),
          #020314
        `,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Back button - top left */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/80 transition-all duration-200 touch-manipulation"
        aria-label="Retour à l'accueil"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </Link>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full md:min-h-screen space-y-6">
          <div className="w-16 h-16 border-4 border-[rgba(252,211,77,0.3)] border-t-accent-orange-soft rounded-full animate-spin"></div>
          <p className="text-text-soft text-lg">Chargement des vidéos...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full md:min-h-screen space-y-4 px-5">
          <Video className="w-16 h-16 text-text-muted mb-4" />
          <p className="text-text-main text-xl font-semibold text-center">Aucune vidéo disponible pour le moment.</p>
          <p className="text-text-soft text-sm text-center">Revenez bientôt pour découvrir de nouvelles vidéos !</p>
        </div>
      ) : (
        <div className="w-full h-full md:flex md:items-center md:justify-center md:min-h-screen md:py-8 md:h-screen">
          <div 
            ref={containerRef}
            className="relative w-full h-full md:w-[400px] md:h-auto bg-black md:rounded-2xl overflow-hidden cursor-pointer"
            style={{
              aspectRatio: '9/16',
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={togglePlayPause}
          >
            {videos.map((video, index) => (
              <video
                key={video.id}
                ref={index === currentIndex ? videoRef : null}
                src={video.videoUrl}
                muted={isMuted}
                loop
                playsInline
                autoPlay={index === currentIndex}
                preload="auto"
                className={`absolute inset-0 w-full h-full object-cover md:object-contain transition-opacity duration-300 ease-in-out ${
                  index === currentIndex && !isTransitioning ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />
            ))}

            {/* Mute button - bottom right */}
            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/80 transition-all duration-200 touch-manipulation"
              aria-label={isMuted ? 'Activer le son' : 'Désactiver le son'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              )}
            </button>

            {/* Play/Pause indicator - center, shows briefly on click */}
            {!isPlaying && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <Pause className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
              </div>
            )}

            {/* Desktop navigation arrows - right side */}
            {videos.length > 1 && (
              <div className="hidden md:flex flex-col gap-4 absolute right-4 top-1/2 -translate-y-1/2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                  className="w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center hover:bg-black/90 hover:scale-110 hover:border-white/50 transition-all duration-200 shadow-lg"
                  aria-label="Vidéo précédente"
                  title="Vidéo précédente (↑)"
                >
                  <ChevronUp className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                  className="w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center hover:bg-black/90 hover:scale-110 hover:border-white/50 transition-all duration-200 shadow-lg"
                  aria-label="Vidéo suivante"
                  title="Vidéo suivante (↓)"
                >
                  <ChevronDown className="w-6 h-6 text-white" />
                </button>
              </div>
            )}

            {/* Desktop keyboard hint */}
            {videos.length > 1 && (
              <div className="hidden md:block absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
                <div className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
                  <p className="text-white text-[10px] font-medium text-center">
                    ↑ ↓ pour naviguer • Espace pour pause
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

