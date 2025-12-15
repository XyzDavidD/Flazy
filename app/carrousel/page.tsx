'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

// Video data structure
interface VideoData {
  id: string
  videoUrl: string
  pseudo: string
  prompt: string
}

export default function CarrouselPage() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

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

  // Handle video play/pause
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

  // Handle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Navigate to previous video
  const goToPrevious = () => {
    if (videos.length === 0) return
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1))
    setIsPlaying(true)
  }

  // Navigate to next video
  const goToNext = () => {
    if (videos.length === 0) return
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1))
    setIsPlaying(true)
  }

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
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === ' ') {
        e.preventDefault()
        togglePlayPause()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isPlaying, videos.length])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(255,138,31,0.15),transparent_58%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.2),transparent_58%),#020314]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[rgba(5,6,18,0.95)] border-b border-[rgba(51,65,85,0.5)] shadow-xl">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-2xl bg-[radial-gradient(circle_at_20%_10%,#ffe29f,#ff8a1f_45%,#ff4b2b_90%)] shadow-[0_0_0_1px_rgba(15,23,42,0.9),0_8px_32px_rgba(255,138,31,0.3)] flex items-center justify-center text-xl font-extrabold text-gray-900 transition-transform duration-300 group-hover:scale-110">
                F
              </div>
              <div>
                <div className="font-extrabold tracking-[0.15em] uppercase text-lg leading-tight">FLAZY</div>
                <div className="text-xs text-text-muted leading-tight">Carrousel public</div>
              </div>
            </Link>

            <Link
              href="/"
              className="px-6 py-2.5 rounded-full border border-[rgba(252,211,77,0.6)] bg-[rgba(252,211,77,0.1)] backdrop-blur-sm text-text-soft text-sm font-semibold transition-all duration-300 hover:bg-[rgba(252,211,77,0.2)] hover:border-[rgba(252,211,77,0.9)] hover:text-text-main hover:scale-105"
            >
              Retour à l'accueil
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {isLoading ? (
            // Loading State
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
              <div className="w-16 h-16 border-4 border-[rgba(252,211,77,0.3)] border-t-accent-orange-soft rounded-full animate-spin"></div>
              <p className="text-text-soft text-lg">Chargement des vidéos...</p>
            </div>
          ) : videos.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
              <div className="text-6xl mb-4">📹</div>
              <p className="text-text-main text-xl font-semibold">Aucune vidéo publique pour le moment.</p>
              <p className="text-text-soft text-sm">Revenez bientôt pour découvrir de nouvelles créations !</p>
            </div>
          ) : (
            // Video Player
            <div className="flex flex-col items-center space-y-6">
              {/* Video Container */}
              <div className="relative group w-full max-w-md">
                <div className="relative rounded-3xl overflow-hidden bg-[rgba(6,9,22,0.8)] backdrop-blur-sm border border-[rgba(252,211,77,0.3)] shadow-2xl aspect-[9/16]">
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent-orange/20 via-accent-red/20 to-accent-orange/20 rounded-3xl blur-xl opacity-50"></div>
                  
                  {/* Video */}
                  <video
                    ref={videoRef}
                    src={currentVideo?.videoUrl}
                    muted={isMuted}
                    loop
                    playsInline
                    autoPlay
                    className="relative z-10 w-full h-full object-cover"
                  />

                  {/* Video Controls Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                    <div className="flex items-center gap-4">
                      {/* Play/Pause Button */}
                      <button
                        onClick={togglePlayPause}
                        className="w-14 h-14 rounded-full bg-[rgba(15,23,42,0.95)] backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110"
                      >
                        {isPlaying ? (
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>

                      {/* Mute/Unmute Button */}
                      <button
                        onClick={toggleMute}
                        className="w-14 h-14 rounded-full bg-[rgba(15,23,42,0.95)] backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110"
                      >
                        {isMuted ? (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                {videos.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[rgba(15,23,42,0.95)] backdrop-blur-sm border-2 border-[rgba(252,211,77,0.5)] flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 hover:border-[rgba(252,211,77,0.9)] hover:bg-[rgba(15,23,42,1)] z-30"
                      aria-label="Vidéo précédente"
                    >
                      <svg className="w-6 h-6 text-accent-orange-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      onClick={goToNext}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[rgba(15,23,42,0.95)] backdrop-blur-sm border-2 border-[rgba(252,211,77,0.5)] flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 hover:border-[rgba(252,211,77,0.9)] hover:bg-[rgba(15,23,42,1)] z-30"
                      aria-label="Vidéo suivante"
                    >
                      <svg className="w-6 h-6 text-accent-orange-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


