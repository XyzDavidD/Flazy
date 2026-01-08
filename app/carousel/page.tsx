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
  Hand,
} from 'lucide-react'

export default function CarouselPage() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(true)
  const [hasSwiped, setHasSwiped] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
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

  // Pause and mute all videos except the current one
  const pauseAllVideos = useCallback((currentIdx: number) => {
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIdx) {
        video.pause()
        video.muted = true
        video.currentTime = 0
      }
    })
  }, [])

  // Navigate to previous video (up)
  const goToPrevious = useCallback(() => {
    if (videos.length === 0 || isTransitioning) return
    setIsTransitioning(true)
    const newIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1
    pauseAllVideos(newIndex)
    setCurrentIndex(newIndex)
    setIsPlaying(true)
    // Hide swipe indicator if user swipes
    if (!hasSwiped) {
      setHasSwiped(true)
      setShowSwipeIndicator(false)
    }
    setTimeout(() => setIsTransitioning(false), 300)
  }, [videos.length, isTransitioning, currentIndex, pauseAllVideos, hasSwiped])

  // Navigate to next video (down)
  const goToNext = useCallback(() => {
    if (videos.length === 0 || isTransitioning) return
    setIsTransitioning(true)
    const newIndex = currentIndex === videos.length - 1 ? 0 : currentIndex + 1
    pauseAllVideos(newIndex)
    setCurrentIndex(newIndex)
    setIsPlaying(true)
    // Hide swipe indicator if user swipes
    if (!hasSwiped) {
      setHasSwiped(true)
      setShowSwipeIndicator(false)
    }
    setTimeout(() => setIsTransitioning(false), 300)
  }, [videos.length, isTransitioning, currentIndex, pauseAllVideos, hasSwiped])

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
      // Pause all other videos first
      pauseAllVideos(currentIndex)
      
      // Set mute state for current video
      videoRef.current.muted = isMuted
      
      // Load and play current video
      videoRef.current.load()
      videoRef.current.play().catch(() => {
        // Autoplay might fail, handle silently
      })
      setIsPlaying(true)
    }
  }, [currentIndex, currentVideo, isMuted, pauseAllVideos])

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
      // Hide swipe indicator on any swipe
      if (!hasSwiped) {
        setHasSwiped(true)
        setShowSwipeIndicator(false)
      }
      
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

  // Auto-hide swipe indicator after 2 seconds
  useEffect(() => {
    if (showSwipeIndicator && currentIndex === 0 && !hasSwiped) {
      const timer = setTimeout(() => {
        setShowSwipeIndicator(false)
        setHasSwiped(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showSwipeIndicator, currentIndex, hasSwiped])

  // Reset indicator visibility when on first video and hasn't swiped yet
  useEffect(() => {
    if (currentIndex !== 0) {
      setShowSwipeIndicator(false)
    } else if (currentIndex === 0 && !hasSwiped && videos.length > 0) {
      // Show indicator only on first video, first time
      setShowSwipeIndicator(true)
    }
  }, [currentIndex, hasSwiped, videos.length])

  // Inject swipe animation CSS
  useEffect(() => {
    const styleId = 'swipe-indicator-animation'
    if (document.getElementById(styleId)) return // Already injected

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      @keyframes swipeUp {
        0% {
          transform: translateY(60px) rotate(90deg);
          opacity: 0;
        }
        20% {
          opacity: 0.3;
        }
        80% {
          opacity: 0.3;
        }
        100% {
          transform: translateY(-60px) rotate(90deg);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      const existingStyle = document.getElementById(styleId)
      if (existingStyle) {
        existingStyle.remove()
      }
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
                ref={(el) => {
                  videoRefs.current[index] = el
                  if (index === currentIndex) {
                    (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el
                  }
                }}
                src={video.videoUrl}
                muted={index === currentIndex ? isMuted : true}
                loop
                playsInline
                autoPlay={index === currentIndex}
                preload="auto"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
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

            {/* Swipe indicator - only on first video, onboarding */}
            {showSwipeIndicator && currentIndex === 0 && !hasSwiped && (
              <div className="absolute inset-0 z-[15] flex items-center justify-center pointer-events-none">
                <div className="relative w-full h-full flex items-center justify-center">
                  <div
                    className="absolute text-white"
                    style={{
                      animation: 'swipeUp 1.5s ease-in-out infinite',
                      opacity: 0.25,
                    }}
                  >
                    <Hand className="w-8 h-8 md:w-10 md:h-10 rotate-90" />
                  </div>
                </div>
              </div>
            )}

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

