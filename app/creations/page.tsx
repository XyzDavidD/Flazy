'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import Lottie from 'lottie-react'
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
  Download,
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
  const [preloadedVideos, setPreloadedVideos] = useState<Set<number>>(new Set())
  const [videoLoadingStates, setVideoLoadingStates] = useState<Map<number, 'loading' | 'ready' | 'error'>>(new Map())
  const [videoErrors, setVideoErrors] = useState<Map<number, number>>(new Map()) // Track retry counts
  const [swipeAnimationData, setSwipeAnimationData] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const lottieRef = useRef<any>(null)
  
  // Swipe gesture state
  const touchStartY = useRef<number>(0)
  const touchEndY = useRef<number>(0)
  const minSwipeDistance = 50

  const STORAGE_ORDER_KEY = 'flazy_carousel_order'
  const STORAGE_LAST_ID_KEY = 'flazy_carousel_last_id'

  interface VideoData {
    id: string
    videoUrl: string
    videoPath: string
  }

  const shuffleArray = <T,>(array: T[]) => {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  const buildOrderedVideos = (items: VideoData[]) => {
    if (typeof window === 'undefined') {
      return { ordered: items, startIndex: 0 }
    }

    const storedOrderRaw = window.localStorage.getItem(STORAGE_ORDER_KEY)
    const storedOrder = storedOrderRaw ? (JSON.parse(storedOrderRaw) as string[]) : []
    const itemMap = new Map(items.map((item) => [item.id, item]))

    const existingIds = storedOrder.filter((id) => itemMap.has(id))
    const missingItems = items.filter((item) => !existingIds.includes(item.id))
    const shuffledMissing = shuffleArray(missingItems.map((item) => item.id))
    const nextOrder = [...existingIds, ...shuffledMissing]

    const ordered = nextOrder.map((id) => itemMap.get(id)).filter(Boolean) as VideoData[]

    window.localStorage.setItem(STORAGE_ORDER_KEY, JSON.stringify(nextOrder))

    const lastId = window.localStorage.getItem(STORAGE_LAST_ID_KEY)
    const lastIndex = lastId ? ordered.findIndex((item) => item.id === lastId) : -1
    const startIndex = ordered.length > 0 && lastIndex >= 0
      ? (lastIndex + 1) % ordered.length
      : 0

    return { ordered, startIndex }
  }

  // Load Lottie animation
  useEffect(() => {
    fetch('/swipe.json')
      .then((res) => res.json())
      .then((data) => setSwipeAnimationData(data))
      .catch((err) => console.error('Error loading animation:', err))
  }, [])

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
              videoPath: video.video_path,
            }
          })

        const { ordered, startIndex } = buildOrderedVideos(mappedVideos)
        setVideos(ordered)
        setCurrentIndex(startIndex)
      } catch (error) {
        console.error('Error fetching videos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const currentVideo = videos[currentIndex]

  // Persist last viewed video to resume on return
  useEffect(() => {
    if (!currentVideo || typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_LAST_ID_KEY, currentVideo.id)
  }, [currentVideo])

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

  // Navigate to previous video (up) - smooth transition without delay
  const goToPrevious = useCallback(() => {
    if (videos.length === 0 || isTransitioning) return
    const newIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1
    pauseAllVideos(newIndex)
    setCurrentIndex(newIndex)
    setIsPlaying(true)
    // Hide swipe indicator if user swipes
    if (!hasSwiped) {
      setHasSwiped(true)
      setShowSwipeIndicator(false)
    }
  }, [videos.length, isTransitioning, currentIndex, pauseAllVideos, hasSwiped])

  // Navigate to next video (down) - smooth transition without delay
  const goToNext = useCallback(() => {
    if (videos.length === 0 || isTransitioning) return
    const newIndex = currentIndex === videos.length - 1 ? 0 : currentIndex + 1
    pauseAllVideos(newIndex)
    setCurrentIndex(newIndex)
    setIsPlaying(true)
    // Hide swipe indicator if user swipes
    if (!hasSwiped) {
      setHasSwiped(true)
      setShowSwipeIndicator(false)
    }
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

  // Smart preloading: only load current + adjacent videos, unload distant ones
  useEffect(() => {
    if (videos.length === 0) return

    const indicesToKeep = new Set<number>()
    
    // Always keep current
    indicesToKeep.add(currentIndex)
    
    // Keep next video
    const nextIndex = currentIndex === videos.length - 1 ? 0 : currentIndex + 1
    indicesToKeep.add(nextIndex)
    
    // Keep previous video
    const prevIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1
    indicesToKeep.add(prevIndex)

    // Unload videos that are far away to free memory
    videoRefs.current.forEach((video, index) => {
      if (video && !indicesToKeep.has(index)) {
        // Unload distant videos
        video.src = ''
        video.load()
        setPreloadedVideos((prev) => {
          const newSet = new Set(prev)
          newSet.delete(index)
          return newSet
        })
        setVideoLoadingStates((prev) => {
          const newMap = new Map(prev)
          newMap.delete(index)
          return newMap
        })
      }
    })

    // Load videos that should be kept
    indicesToKeep.forEach((index) => {
      const video = videoRefs.current[index]
      if (video && videos[index]) {
        // Only set src if not already set
        if (!video.src || video.src !== videos[index].videoUrl) {
          setVideoLoadingStates((prev) => {
            const newMap = new Map(prev)
            newMap.set(index, 'loading')
            return newMap
          })
          video.src = videos[index].videoUrl
          video.load()
        }
      }
    })
  }, [currentIndex, videos])

  // Reset video when index changes - optimized for instant playback with better buffering
  useEffect(() => {
    if (videoRef.current && currentVideo) {
      // Pause all other videos first
      pauseAllVideos(currentIndex)
      
      // Set mute state for current video
      videoRef.current.muted = isMuted
      
      // Disable remote playback (casting)
      if ('disableRemotePlayback' in videoRef.current) {
        (videoRef.current as any).disableRemotePlayback = true
      }
      
      const playVideo = () => {
        if (videoRef.current) {
          videoRef.current.play().catch((err) => {
            console.warn('Autoplay failed:', err)
            setIsPlaying(false)
          })
          setIsPlaying(true)
        }
      }

      // Check if video is ready
      if (videoRef.current.readyState >= 4) { // HAVE_ENOUGH_DATA
        playVideo()
      } else if (videoRef.current.readyState >= 3) { // HAVE_FUTURE_DATA
        // Wait for canplaythrough for better buffering
        const handleCanPlayThrough = () => {
          playVideo()
          videoRef.current?.removeEventListener('canplaythrough', handleCanPlayThrough)
        }
        videoRef.current.addEventListener('canplaythrough', handleCanPlayThrough, { once: true })
        
        // Fallback to canplay if canplaythrough takes too long
        const timeout = setTimeout(() => {
          if (videoRef.current && videoRef.current.readyState >= 3) {
            playVideo()
          }
          videoRef.current?.removeEventListener('canplaythrough', handleCanPlayThrough)
        }, 2000)
        
        return () => {
          clearTimeout(timeout)
          videoRef.current?.removeEventListener('canplaythrough', handleCanPlayThrough)
        }
      } else {
        // Video not loaded yet, wait for loading
        const handleCanPlay = () => {
          playVideo()
          videoRef.current?.removeEventListener('canplay', handleCanPlay)
        }
        videoRef.current.addEventListener('canplay', handleCanPlay, { once: true })
        
        return () => {
          videoRef.current?.removeEventListener('canplay', handleCanPlay)
        }
      }
    }
  }, [currentIndex, currentVideo, isMuted, pauseAllVideos])

  // Sync state with video events - only listen to play event, manage pause state manually
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Only listen to play event - pause state is managed by togglePlayPause
      const handlePlay = () => setIsPlaying(true)
      
      video.addEventListener('play', handlePlay)
      
      // Disable remote playback (casting)
      if ('disableRemotePlayback' in video) {
        (video as any).disableRemotePlayback = true
      }

      return () => {
        video.removeEventListener('play', handlePlay)
      }
    }
  }, [currentVideo])
  
  // Prevent cast overlays from appearing
  useEffect(() => {
    const preventCastOverlay = () => {
      // Remove any cast buttons that might appear
      const castButtons = document.querySelectorAll('[data-cast-button], .cast-button, [aria-label*="Cast"]')
      castButtons.forEach(btn => {
        (btn as HTMLElement).style.display = 'none'
      })
      
      // Prevent remote playback on all videos
      const allVideos = document.querySelectorAll('video')
      allVideos.forEach(video => {
        if ('disableRemotePlayback' in video) {
          (video as any).disableRemotePlayback = true
        }
      })
    }
    
    // Run immediately and on interval to catch dynamically added elements
    preventCastOverlay()
    const interval = setInterval(preventCastOverlay, 500)
    
    return () => clearInterval(interval)
  }, [])

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

  // Prevent body scroll and optimize mobile viewport handling
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      // Lock body scroll - prevents address bar issues
      const originalOverflow = document.body.style.overflow
      const originalPosition = document.body.style.position
      const originalWidth = document.body.style.width
      const originalHeight = document.body.style.height
      const originalTouchAction = document.body.style.touchAction
      
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.height = '100%'
      document.body.style.touchAction = 'none' // Prevent pull-to-refresh
      
      // Set viewport height CSS variable for dynamic viewport support
      const setViewportHeight = () => {
        // Use visualViewport API if available (more accurate on mobile)
        const height = window.visualViewport?.height || window.innerHeight
        const vh = height * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
      }
      
      setViewportHeight()
      
      // Listen to visual viewport changes (handles keyboard, address bar, etc.)
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', setViewportHeight)
      } else {
        window.addEventListener('resize', setViewportHeight)
      }
      window.addEventListener('orientationchange', setViewportHeight)
      
      // Force content to be at top on load
      window.scrollTo(0, 0)
      
      return () => {
        document.body.style.overflow = originalOverflow
        document.body.style.position = originalPosition
        document.body.style.width = originalWidth
        document.body.style.height = originalHeight
        document.body.style.touchAction = originalTouchAction
        
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', setViewportHeight)
        } else {
          window.removeEventListener('resize', setViewportHeight)
        }
        window.removeEventListener('orientationchange', setViewportHeight)
      }
    }
  }, [])

  // Ensure Lottie animation keeps playing when visible
  useEffect(() => {
    if (showSwipeIndicator && currentIndex === 0 && !hasSwiped && lottieRef.current && swipeAnimationData) {
      // Small delay to ensure component is mounted
      const timer = setTimeout(() => {
        if (lottieRef.current) {
          lottieRef.current.setSpeed(1)
          lottieRef.current.play()
          lottieRef.current.setLoop(true)
        }
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [showSwipeIndicator, currentIndex, hasSwiped, swipeAnimationData])

  // Swipe indicator stays visible until user swipes (no auto-hide)

  // Reset indicator visibility when on first video and hasn't swiped yet
  useEffect(() => {
    if (currentIndex !== 0) {
      setShowSwipeIndicator(false)
    } else if (currentIndex === 0 && !hasSwiped && videos.length > 0) {
      // Show indicator only on first video, first time
      setShowSwipeIndicator(true)
    }
  }, [currentIndex, hasSwiped, videos.length])


  return (
    <div 
        className="fixed inset-0 md:relative md:min-h-screen bg-black md:bg-[#020314] carousel-fullscreen"
        style={{
          background: `
            radial-gradient(circle 800px at top right, rgba(255, 138, 31, 0.4), transparent),
            radial-gradient(circle 600px at bottom left, rgba(56, 189, 248, 0.22), transparent),
            radial-gradient(circle 800px at bottom right, rgba(129, 140, 248, 0.4), transparent),
            #020314
          `,
          backgroundAttachment: 'fixed',
          // Mobile: Use calc with CSS variable for true viewport height (accounts for address bar)
          height: 'calc(var(--vh, 1vh) * 100)',
          minHeight: 'calc(var(--vh, 1vh) * 100)',
          maxHeight: 'calc(var(--vh, 1vh) * 100)',
          // Safe area insets for notched devices
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
          // Prevent overscroll and ensure no scrollbars
          overscrollBehavior: 'none',
          overflow: 'hidden',
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
        <div className="w-full h-full md:flex md:items-center md:justify-center md:min-h-screen md:py-8 md:h-screen" style={{ height: '100%' }}>
          <div 
            ref={containerRef}
            className="relative w-full h-full md:w-[400px] md:h-auto bg-black md:rounded-2xl overflow-hidden cursor-pointer"
            style={{
              aspectRatio: '9/16',
              height: '100%',
              maxHeight: '100%',
              backgroundColor: '#000000',
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={togglePlayPause}
          >
            {videos.map((video, index) => {
              const isCurrent = index === currentIndex
              const isAdjacent = index === (currentIndex === 0 ? videos.length - 1 : currentIndex - 1) || 
                                 index === (currentIndex === videos.length - 1 ? 0 : currentIndex + 1)
              const shouldLoad = isCurrent || isAdjacent
              const loadingState = videoLoadingStates.get(index)
              const isBuffering = loadingState === 'loading' && isCurrent

              return (
                <div
                  key={video.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-200 ease-in-out ${
                    isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {shouldLoad ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el
                        if (index === currentIndex) {
                          (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el
                        }
                      }}
                      src={video.videoUrl}
                      muted={isCurrent ? isMuted : true}
                      loop
                      playsInline
                      disablePictureInPicture
                      controlsList="nodownload nofullscreen noremoteplayback"
                      autoPlay={isCurrent}
                      preload={isCurrent ? 'auto' : isAdjacent ? 'metadata' : 'none'}
                      className="w-full h-full object-cover pointer-events-none"
                      style={{ backgroundColor: '#000000' }}
                      onContextMenu={(e) => e.preventDefault()}
                      onLoadStart={() => {
                        setVideoLoadingStates((prev) => {
                          const newMap = new Map(prev)
                          newMap.set(index, 'loading')
                          return newMap
                        })
                      }}
                      onLoadedData={() => {
                        setVideoLoadingStates((prev) => {
                          const newMap = new Map(prev)
                          newMap.set(index, 'ready')
                          return newMap
                        })
                        if (isCurrent && videoRefs.current[index]) {
                          videoRefs.current[index]?.play().catch(() => {})
                        }
                      }}
                      onCanPlayThrough={() => {
                        setVideoLoadingStates((prev) => {
                          const newMap = new Map(prev)
                          newMap.set(index, 'ready')
                          return newMap
                        })
                      }}
                      onError={(e) => {
                        console.error(`Video ${index} error:`, e)
                        const retryCount = videoErrors.get(index) || 0
                        if (retryCount < 3) {
                          setVideoErrors((prev) => {
                            const newMap = new Map(prev)
                            newMap.set(index, retryCount + 1)
                            return newMap
                          })
                          setVideoLoadingStates((prev) => {
                            const newMap = new Map(prev)
                            newMap.set(index, 'error')
                            return newMap
                          })
                          // Retry after delay
                          setTimeout(() => {
                            const video = videoRefs.current[index]
                            if (video) {
                              video.load()
                            }
                          }, 1000 * (retryCount + 1))
                        } else {
                          setVideoLoadingStates((prev) => {
                            const newMap = new Map(prev)
                            newMap.set(index, 'error')
                            return newMap
                          })
                        }
                      }}
                      onPlaying={() => {
                        if (isCurrent) {
                          setIsPlaying(true)
                        }
                      }}
                    />
                  ) : null}
                  
                  {/* Loading/Buffering indicator */}
                  {isBuffering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  {/* Error state */}
                  {loadingState === 'error' && isCurrent && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                      <Video className="w-16 h-16 text-white/50 mb-4" />
                      <p className="text-white text-sm">Erreur de chargement</p>
                      <button
                        onClick={() => {
                          const video = videoRefs.current[index]
                          if (video) {
                            setVideoErrors((prev) => {
                              const newMap = new Map(prev)
                              newMap.delete(index)
                              return newMap
                            })
                            video.load()
                          }
                        }}
                        className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-colors"
                      >
                        Réessayer
                      </button>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Mute button - bottom right, small and discreet */}
            <button
              onClick={toggleMute}
              className="absolute right-4 z-30 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/70 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-black/90 transition-all duration-200 touch-manipulation shadow-lg"
              aria-label={isMuted ? 'Activer le son' : 'Désactiver le son'}
              style={{ 
                pointerEvents: 'auto',
                bottom: 'max(calc(env(safe-area-inset-bottom) + 12px), 96px)',
              }}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
              )}
            </button>

            {/* Download button - below mute button */}
            <button
              onClick={async (event) => {
                event.preventDefault()
                event.stopPropagation()
                const currentVideo = videos[currentIndex]
                if (!currentVideo) return

                try {
                  const downloadUrl = `/api/download?path=${encodeURIComponent(currentVideo.videoPath)}`
                  const link = document.createElement('a')
                  link.href = downloadUrl
                  link.download = `flazy-video-${Date.now()}.mp4`
                  link.rel = 'noopener'
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                } catch (error) {
                  console.error('Download error:', error)
                }
              }}
              onPointerDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              className="absolute right-4 z-30 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/70 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-black/90 transition-all duration-200 touch-manipulation shadow-lg"
              aria-label="Télécharger la vidéo"
              style={{ 
                pointerEvents: 'auto',
                bottom: 'max(calc(env(safe-area-inset-bottom) + 12px), 44px)',
              }}
            >
              <Download className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>

            {/* Swipe indicator - only on first video, onboarding - visible until first swipe */}
            {showSwipeIndicator && currentIndex === 0 && !hasSwiped && swipeAnimationData && (
              <div className="absolute inset-0 z-[15] flex items-center justify-center pointer-events-none">
                <div className="relative w-full h-full flex items-center justify-center">
                  <div
                    className="absolute"
                    style={{
                      opacity: 0.5,
                    }}
                  >
                    <Lottie
                      key="swipe-indicator"
                      lottieRef={lottieRef}
                      animationData={swipeAnimationData}
                      loop={true}
                      autoplay={true}
                      style={{ width: 120, height: 120 }}
                      rendererSettings={{
                        preserveAspectRatio: 'xMidYMid slice',
                      }}
                    />
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
              <div className="hidden md:flex flex-col gap-4 absolute right-4 top-[55%] -translate-y-1/2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                  className="w-11 h-11 rounded-full bg-black/70 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center hover:bg-black/90 hover:scale-110 hover:border-white/50 transition-all duration-200 shadow-lg"
                  aria-label="Vidéo précédente"
                  title="Vidéo précédente (↑)"
                >
                  <ChevronUp className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                  className="w-11 h-11 rounded-full bg-black/70 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center hover:bg-black/90 hover:scale-110 hover:border-white/50 transition-all duration-200 shadow-lg"
                  aria-label="Vidéo suivante"
                  title="Vidéo suivante (↓)"
                >
                  <ChevronDown className="w-5 h-5 text-white" />
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

