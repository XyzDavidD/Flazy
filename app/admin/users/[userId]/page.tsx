'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Trash2, Upload, Loader2, X, CheckCircle2, AlertCircle, ArrowLeft, Video, User } from 'lucide-react'

interface UserVideo {
  id: string
  created_at: string
  video_path: string
  title: string
  description: string
}

interface UserData {
  id: string
  email: string
}

export default function UserVideosPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  
  const [user, setUser] = useState<UserData | null>(null)
  const [videos, setVideos] = useState<UserVideo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check if admin is unlocked
    if (typeof window !== 'undefined') {
      const unlocked = sessionStorage.getItem('admin_unlocked') === 'true'
      if (!unlocked) {
        router.push('/admin')
        return
      }
    }
    
    fetchUserData()
    fetchVideos()
  }, [userId])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'User not found')
      }
      
      setUser(data.user)
    } catch (error) {
      console.error('Error fetching user:', error)
      setMessage({ 
        type: 'error', 
        text: 'Utilisateur introuvable' 
      })
      setTimeout(() => router.push('/admin'), 2000)
    }
  }

  const fetchVideos = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/user-videos?userId=${userId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch videos')
      }
      
      setVideos(data.videos || [])
    } catch (error) {
      console.error('Error fetching videos:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors du chargement des vidéos' 
      })
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      setMessage({ type: 'error', text: 'Le fichier doit être une vidéo' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setIsUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('video', file)
      formData.append('userId', userId)
      formData.append('title', file.name)
      formData.append('description', '')

      const response = await fetch('/api/admin/user-videos', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload video')
      }

      setMessage({ type: 'success', text: 'Vidéo uploadée avec succès' })
      setTimeout(() => setMessage(null), 3000)
      
      await fetchVideos()
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error uploading video:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de l\'upload de la vidéo' 
      })
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (videoId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/user-videos?videoId=${videoId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete video')
      }

      setMessage({ type: 'success', text: 'Vidéo supprimée avec succès' })
      setTimeout(() => setMessage(null), 3000)
      
      await fetchVideos()
    } catch (error) {
      console.error('Error deleting video:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la suppression de la vidéo' 
      })
      setTimeout(() => setMessage(null), 5000)
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
          <Link href="/admin" className="flex items-center gap-3">
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
                <div className="text-[11px] text-text-muted">Administration</div>
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
          {/* User Info */}
          {user && (
            <div className="mb-6 bg-[rgba(6,9,22,0.98)] rounded-xl p-4 border border-[rgba(252,211,77,0.6)] shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
              style={{
                background: `
                  radial-gradient(circle at top, rgba(255, 138, 31, 0.15), transparent 60%),
                  rgba(6, 9, 22, 0.98)
                `
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[rgba(255,138,31,0.2)] flex items-center justify-center">
                  <User className="w-6 h-6 text-accent-orange-soft" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-text-main">{user.email}</h1>
                  <p className="text-xs text-text-muted">Gestion des vidéos de cet utilisateur</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Section */}
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">Vidéos de l'utilisateur</h2>
              <p className="text-sm text-text-soft">Gérez les vidéos visibles par cet utilisateur</p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="relative overflow-hidden bg-transparent text-[#111827] shadow-[0_18px_45px_rgba(0,0,0,0.75)] z-0 rounded-full border-none text-[13px] font-semibold px-6 py-3 h-[42px] inline-flex items-center justify-center gap-2 transition-all duration-[0.18s] ease-out hover:-translate-y-px hover:shadow-[0_22px_60px_rgba(0,0,0,0.95)] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  position: 'relative',
                }}
              >
                <span className="absolute inset-0 -z-10 rounded-full" style={{
                  backgroundImage: 'linear-gradient(90deg, #ff6b00 0%, #ffd700 25%, #ff4b2b 50%, #ffd700 75%, #ff6b00 100%)',
                  backgroundSize: '220% 100%',
                  animation: 'flazyTopbar 10s ease-in-out infinite alternate'
                }}></span>
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Upload en cours...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Ajouter une vidéo</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.6)] text-[#86efac]'
                : 'bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.6)] text-[#fecaca]'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm">{message.text}</span>
              <button
                onClick={() => setMessage(null)}
                className="ml-auto text-text-soft hover:text-text-main transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Videos Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
              <Loader2 className="w-10 h-10 text-accent-orange-soft animate-spin" />
              <p className="text-text-soft text-sm">Chargement des vidéos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
              <div className="w-12 h-12 rounded-full bg-[rgba(255,138,31,0.2)] flex items-center justify-center">
                <Upload className="w-6 h-6 text-accent-orange-soft" />
              </div>
              <p className="text-text-main text-lg font-semibold">Aucune vidéo</p>
              <p className="text-text-soft text-xs">Ajoutez une vidéo pour cet utilisateur</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-[rgba(6,9,22,0.98)] rounded-xl p-2 border border-[rgba(252,211,77,0.6)] shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:border-[rgba(252,211,77,0.9)] transition-all duration-200"
                  style={{
                    background: `
                      radial-gradient(circle at top, rgba(255, 138, 31, 0.15), transparent 60%),
                      rgba(6, 9, 22, 0.98)
                    `
                  }}
                >
                  <div className="relative aspect-[9/16] rounded-lg overflow-hidden mb-2 bg-[#020617]">
                    <video
                      src={video.video_path}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    {video.title && (
                      <p className="text-xs text-text-main truncate font-medium">{video.title}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-[9px] text-text-muted truncate">
                        {new Date(video.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="p-1 rounded-md bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.5)] text-[#fecaca] hover:bg-[rgba(239,68,68,0.25)] transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
