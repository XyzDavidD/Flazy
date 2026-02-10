'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, Video, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserVideo {
  id: string
  created_at: string
  video_path: string
  title: string
  description: string
}

export default function MesVideosPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<UserVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/auth/login')
      return
    }
    
    setUser(session.user)
    fetchVideos(session.user.id)
  }

  const fetchVideos = async (userId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/user-videos?userId=${userId}`)
      const data = await response.json()
      
      if (response.ok) {
        setVideos(data.videos || [])
      } else {
        console.error('Failed to fetch videos:', data.error)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
            <ArrowLeft className="w-5 h-5 text-text-soft hover:text-text-main transition-colors" />
            <div className="flex items-center gap-3">
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
                <div className="text-[11px] text-text-muted">Mes vidéos</div>
              </div>
            </div>
          </Link>
          <Link
            href="/"
            className="text-text-soft text-sm hover:text-text-main transition-colors"
          >
            Retour à l'accueil
          </Link>
        </nav>
      </header>

      <main className="py-8 md:py-12">
        <div className="max-w-[1120px] mx-auto px-5">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-extrabold mb-2">Mes vidéos</h1>
            <p className="text-sm text-text-soft">Vidéos uploadées pour vous par notre équipe</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <Loader2 className="w-12 h-12 text-accent-orange-soft animate-spin" />
              <p className="text-text-soft text-sm">Chargement de vos vidéos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <div className="w-16 h-16 rounded-full bg-[rgba(255,138,31,0.2)] flex items-center justify-center">
                <Video className="w-8 h-8 text-accent-orange-soft" />
              </div>
              <p className="text-text-main text-xl font-semibold">Aucune vidéo pour le moment</p>
              <p className="text-text-soft text-sm max-w-md text-center">
                Notre équipe n'a pas encore uploadé de vidéos pour vous. Revenez bientôt !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {videos.map((video) => {
                // Handle both old format (full URL) and new format (path only)
                const videoUrl = video.video_path.startsWith('http') 
                  ? video.video_path 
                  : supabase.storage.from('videos').getPublicUrl(video.video_path).data.publicUrl
                
                return (
                  <div
                    key={video.id}
                    className="bg-[rgba(6,9,22,0.98)] rounded-xl p-2.5 border border-[rgba(252,211,77,0.6)] shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:border-[rgba(252,211,77,0.9)] transition-all duration-200 hover:-translate-y-1"
                    style={{
                      background: `
                        radial-gradient(circle at top, rgba(255, 138, 31, 0.15), transparent 60%),
                        rgba(6, 9, 22, 0.98)
                      `
                    }}
                  >
                    <div className="relative aspect-[9/16] rounded-lg overflow-hidden mb-2 bg-[#020617]">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  <div className="space-y-1">
                    {video.title && (
                      <p className="text-xs text-text-main truncate font-medium">{video.title}</p>
                    )}
                    {video.description && (
                      <p className="text-[10px] text-text-muted line-clamp-2">{video.description}</p>
                    )}
                    <div className="text-[9px] text-text-muted">
                      {new Date(video.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
