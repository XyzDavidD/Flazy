'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Trash2, Upload, Lock, Loader2, X, CheckCircle2, AlertCircle, RefreshCw, Video } from 'lucide-react'

interface CarouselVideo {
  id: string
  created_at: string
  video_path: string
  is_published: boolean
}

interface ExampleVideo {
  id: string
  created_at: string
  updated_at: string
  video_path: string
  position: number
  title: string
  description: string
}

export default function AdminPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [videos, setVideos] = useState<CarouselVideo[]>([])
  const [exampleVideos, setExampleVideos] = useState<(ExampleVideo | null)[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingExamples, setIsLoadingExamples] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isReplacingExample, setIsReplacingExample] = useState<number | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const exampleFileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Check if already unlocked from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unlocked = sessionStorage.getItem('admin_unlocked') === 'true'
      setIsUnlocked(unlocked)
      if (unlocked) {
        fetchVideos()
        fetchExampleVideos()
      }
    }
  }, [])

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/config')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch admin password')
      }
      
      const adminPassword = data.password || ''
      
      if (password === adminPassword) {
        setIsUnlocked(true)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('admin_unlocked', 'true')
        }
        fetchVideos()
        fetchExampleVideos()
        setPassword('')
      } else {
        setMessage({ type: 'error', text: 'Mot de passe incorrect' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      console.error('Error checking password:', error)
      setMessage({ 
        type: 'error', 
        text: 'Erreur lors de la vérification du mot de passe. Veuillez réessayer.' 
      })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const fetchVideos = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/videos')
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
      // For large files, upload directly to Supabase Storage from client
      // This bypasses Vercel's function payload limit
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const videoPath = `admin/${timestamp}-${sanitizedFileName}`

      // Try uploading directly to Supabase Storage from client
      // If this fails due to permissions, fall back to API upload
      let uploadError = null
      const { error: directUploadError } = await supabase.storage
        .from('videos')
        .upload(videoPath, file, {
          contentType: file.type,
          upsert: false,
          cacheControl: '3600',
        })

      if (directUploadError) {
        // If direct upload fails (likely due to RLS), fall back to API upload
        console.log('Direct upload failed, falling back to API upload:', directUploadError)
        
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/admin/videos', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload video')
        }

        // Success with API upload
        setMessage({ type: 'success', text: 'Vidéo uploadée avec succès' })
        setTimeout(() => setMessage(null), 3000)
        await fetchVideos()
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }

      // Direct upload succeeded, now save the record via API
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_path: videoPath,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Clean up uploaded file if record creation fails
        await supabase.storage.from('videos').remove([videoPath])
        throw new Error(data.error || 'Failed to save video record')
      }

      setMessage({ type: 'success', text: 'Vidéo uploadée avec succès' })
      setTimeout(() => setMessage(null), 3000)
      
      // Refresh video list
      await fetchVideos()
      
      // Reset file input
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

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/videos?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete video')
      }

      setMessage({ type: 'success', text: 'Vidéo supprimée avec succès' })
      setTimeout(() => setMessage(null), 3000)
      
      // Refresh video list
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

  const fetchExampleVideos = async () => {
    setIsLoadingExamples(true)
    try {
      const { data, error } = await supabase
        .from('example_videos')
        .select('*')
        .order('position', { ascending: true })

      if (error) {
        throw new Error(error.message || 'Failed to fetch example videos')
      }

      // Create array with 4 positions, fill with null if missing
      const videosByPosition: (ExampleVideo | null)[] = [null, null, null, null]
      if (data) {
        data.forEach((video: any) => {
          if (video.position >= 1 && video.position <= 4) {
            videosByPosition[video.position - 1] = video
          }
        })
      }
      
      setExampleVideos(videosByPosition)
    } catch (error) {
      console.error('Error fetching example videos:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors du chargement des vidéos d\'exemple' 
      })
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setIsLoadingExamples(false)
    }
  }

  const handleReplaceExample = async (position: number, file: File) => {
    if (!file) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un fichier vidéo' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    if (!file.type.startsWith('video/')) {
      setMessage({ type: 'error', text: 'Le fichier doit être une vidéo' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setIsReplacingExample(position)
    setMessage(null)

    try {
      const existingVideo = exampleVideos[position - 1]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('position', position.toString())
      formData.append('title', existingVideo?.title || getDefaultTitle(position))
      formData.append('description', existingVideo?.description || getDefaultDescription(position))

      const response = await fetch('/api/admin/example-videos', {
        method: 'PUT',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to replace video')
      }

      setMessage({ type: 'success', text: `Vidéo d'exemple ${position} remplacée avec succès` })
      setTimeout(() => setMessage(null), 3000)
      
      // Refresh example videos list - wait a bit for DB to be ready
      setTimeout(async () => {
        await fetchExampleVideos()
      }, 500)
    } catch (error) {
      console.error('Error replacing example video:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors du remplacement de la vidéo' 
      })
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setIsReplacingExample(null)
    }
  }

  const handleExampleFileChange = (position: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleReplaceExample(position, file)
    }
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const getDefaultTitle = (position: number): string => {
    const titles = [
      'Interviews & News',
      'UGC & Témoignages',
      'Boost & Publicité',
      'Viral & Divertissement',
    ]
    return titles[position - 1] || `Exemple ${position}`
  }

  const getDefaultDescription = (position: number): string => {
    const descriptions = [
      'Formats réalistes inspirés des médias et de l\'actualité.',
      'Vidéos UGC et témoignages authentiques.',
      'Vidéos publicitaires orientées conversion.',
      'Formats créatifs pensés pour la viralité.',
    ]
    return descriptions[position - 1] || `Description pour l'exemple ${position}`
  }

  const getVideoUrl = (videoPath: string) => {
    const { data } = supabase.storage.from('videos').getPublicUrl(videoPath)
    return data.publicUrl
  }

  if (!isUnlocked) {
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
                <div className="text-[11px] text-text-muted">Administration</div>
              </div>
            </Link>
          </nav>
        </header>

        <main className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-5">
          <div className="w-full max-w-md">
            <div className="bg-[rgba(6,9,22,0.98)] rounded-[22px] p-8 border border-[rgba(252,211,77,0.75)] shadow-[0_18px_40px_rgba(0,0,0,0.8)]"
              style={{
                background: `
                  radial-gradient(circle at top, rgba(255, 138, 31, 0.22), transparent 60%),
                  rgba(6, 9, 22, 0.98)
                `
              }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(255,138,31,0.2)] flex items-center justify-center">
                  <Lock className="w-8 h-8 text-accent-orange-soft" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold mb-2">Accès administrateur</h1>
                <p className="text-sm text-text-soft">Entrez le mot de passe pour accéder</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label htmlFor="password" className="block text-xs text-text-soft mb-2 font-medium">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-[rgba(75,85,99,0.95)] bg-[rgba(15,23,42,0.96)] text-text-main px-4 py-3 text-[13px] outline-none transition-all duration-[0.18s] ease-out placeholder:text-text-muted focus:border-accent-orange-soft focus:shadow-[0_0_0_1px_rgba(248,181,86,0.6)] focus:bg-[rgba(15,23,42,0.98)]"
                    placeholder="••••••••"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full relative overflow-hidden bg-transparent text-[#111827] shadow-[0_18px_45px_rgba(0,0,0,0.75)] z-0 rounded-full border-none text-[13px] font-semibold px-6 py-3 h-[42px] inline-flex items-center justify-center gap-2 transition-all duration-[0.18s] ease-out hover:-translate-y-px hover:shadow-[0_22px_60px_rgba(0,0,0,0.95)]"
                  style={{
                    position: 'relative',
                  }}
                >
                  <span className="absolute inset-0 -z-10 rounded-full" style={{
                    backgroundImage: 'linear-gradient(90deg, #ff6b00 0%, #ffd700 25%, #ff4b2b 50%, #ffd700 75%, #ff6b00 100%)',
                    backgroundSize: '220% 100%',
                    animation: 'flazyTopbar 10s ease-in-out infinite alternate'
                  }}></span>
                  Accéder
                </button>
              </form>

              {message && (
                <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${
                  message.type === 'success' 
                    ? 'bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.6)] text-[#86efac]'
                    : 'bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.6)] text-[#fecaca]'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span className="text-xs">{message.text}</span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    )
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
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold mb-2">Gestion du carrousel</h1>
              <p className="text-sm text-text-soft">Gérez les vidéos affichées sur la page d'accueil</p>
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

          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
              <Loader2 className="w-12 h-12 text-accent-orange-soft animate-spin" />
              <p className="text-text-soft">Chargement des vidéos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <div className="w-16 h-16 rounded-full bg-[rgba(255,138,31,0.2)] flex items-center justify-center">
                <Upload className="w-8 h-8 text-accent-orange-soft" />
              </div>
              <p className="text-text-main text-xl font-semibold">Aucune vidéo</p>
              <p className="text-text-soft text-sm">Ajoutez votre première vidéo pour commencer</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => {
                const videoUrl = getVideoUrl(video.video_path)
                return (
                  <div
                    key={video.id}
                    className="bg-[rgba(6,9,22,0.98)] rounded-[22px] p-4 border border-[rgba(252,211,77,0.75)] shadow-[0_18px_40px_rgba(0,0,0,0.8)]"
                    style={{
                      background: `
                        radial-gradient(circle at top, rgba(255, 138, 31, 0.22), transparent 60%),
                        rgba(6, 9, 22, 0.98)
                      `
                    }}
                  >
                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden mb-4 bg-[#020617]">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-text-muted">
                        {new Date(video.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="p-2 rounded-lg bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.6)] text-[#fecaca] hover:bg-[rgba(239,68,68,0.25)] transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Example Videos Section */}
          <div className="mt-16 pt-16 border-t border-[rgba(51,65,85,0.5)]">
            <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">Gestion des vidéos d'exemple</h2>
              <p className="text-sm text-text-soft">Gérez les 4 vidéos affichées dans la section "Exemples de vidéos virales"</p>
            </div>

            {isLoadingExamples ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
                <Loader2 className="w-12 h-12 text-accent-orange-soft animate-spin" />
                <p className="text-text-soft">Chargement des vidéos d'exemple...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((position) => {
                  const exampleVideo = exampleVideos[position - 1]
                  const videoUrl = exampleVideo ? getVideoUrl(exampleVideo.video_path) : null
                  
                  return (
                    <div
                      key={position}
                      className="bg-[rgba(6,9,22,0.98)] rounded-[22px] p-4 border border-[rgba(252,211,77,0.75)] shadow-[0_18px_40px_rgba(0,0,0,0.8)]"
                      style={{
                        background: `
                          radial-gradient(circle at top, rgba(255, 138, 31, 0.22), transparent 60%),
                          rgba(6, 9, 22, 0.98)
                        `
                      }}
                    >
                      <div className="mb-3">
                        <div className="text-xs text-text-muted mb-1">Position {position}</div>
                        <div className="text-sm font-semibold text-text-main">
                          {exampleVideo?.title || getDefaultTitle(position)}
                        </div>
                        <div className="text-xs text-text-soft mt-1">
                          {exampleVideo?.description || getDefaultDescription(position)}
                        </div>
                      </div>
                      
                      <div className="relative aspect-[9/16] rounded-xl overflow-hidden mb-4 bg-[#020617]">
                        {videoUrl ? (
                          <video
                            src={videoUrl}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[rgba(15,23,42,0.5)] border border-[rgba(252,211,77,0.3)] rounded-xl">
                            <div className="text-center">
                              <Video className="w-8 h-8 text-text-muted mx-auto mb-2" />
                              <p className="text-xs text-text-muted">Aucune vidéo</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <input
                        ref={(el) => {
                          exampleFileInputRefs.current[position - 1] = el
                        }}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleExampleFileChange(position, e)}
                      />
                      <button
                        onClick={() => exampleFileInputRefs.current[position - 1]?.click()}
                        disabled={isReplacingExample === position}
                        className="w-full relative overflow-hidden bg-transparent text-[#111827] shadow-[0_18px_45px_rgba(0,0,0,0.75)] z-0 rounded-full border-none text-[13px] font-semibold px-4 py-2.5 h-[38px] inline-flex items-center justify-center gap-2 transition-all duration-[0.18s] ease-out hover:-translate-y-px hover:shadow-[0_22px_60px_rgba(0,0,0,0.95)] disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          position: 'relative',
                        }}
                      >
                        <span className="absolute inset-0 -z-10 rounded-full" style={{
                          backgroundImage: 'linear-gradient(90deg, #ff6b00 0%, #ffd700 25%, #ff4b2b 50%, #ffd700 75%, #ff6b00 100%)',
                          backgroundSize: '220% 100%',
                          animation: 'flazyTopbar 10s ease-in-out infinite alternate'
                        }}></span>
                        {isReplacingExample === position ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Remplacement...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            <span>{exampleVideo ? 'Remplacer' : 'Ajouter'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

