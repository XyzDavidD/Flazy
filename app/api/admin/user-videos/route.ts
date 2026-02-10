import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for large file uploads

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Get videos for a specific user
export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await client
      .from('user_videos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user videos:', error)
      return NextResponse.json(
        { error: 'Failed to fetch videos', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ videos: data || [] })
  } catch (error) {
    console.error('Error in user videos GET:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Upload video for a specific user
export async function POST(request: NextRequest) {
  try {
    const client = getSupabaseClient()
    
    // Check if request is JSON (direct upload) or FormData (fallback)
    const contentType = request.headers.get('content-type') || ''
    let videoPath: string
    let userId: string
    let title: string
    let description: string
    let file: File | null = null

    if (contentType.includes('application/json')) {
      // Direct upload: video_path is provided, file already uploaded
      const body = await request.json()
      videoPath = body.video_path
      userId = body.userId
      title = body.title || ''
      description = body.description || ''

      if (!videoPath || !userId) {
        return NextResponse.json(
          { error: 'Missing required fields: video_path, userId' },
          { status: 400 }
        )
      }
    } else {
      // Fallback: file is provided, need to upload
      const formData = await request.formData()
      file = formData.get('video') as File
      userId = formData.get('userId') as string
      title = formData.get('title') as string || ''
      description = formData.get('description') as string || ''

      if (!file || !userId) {
        return NextResponse.json(
          { error: 'Missing required fields: video, userId' },
          { status: 400 }
        )
      }

      // Validate file type
      if (!file.type.startsWith('video/')) {
        return NextResponse.json(
          { error: 'File must be a video' },
          { status: 400 }
        )
      }

      // Generate unique filename
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      videoPath = `${userId}/${timestamp}-${sanitizedFileName}`

      // Upload video to Supabase Storage
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { data: uploadData, error: uploadError } = await client
        .storage
        .from('videos')
        .upload(videoPath, buffer, {
          contentType: file.type,
          upsert: false,
          cacheControl: '3600',
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload video', details: uploadError.message },
          { status: 500 }
        )
      }
    }

    // Verify user exists
    const { data: userData, error: userError } = await client.auth.admin.getUserById(userId)
    if (userError || !userData) {
      // Clean up uploaded file if user doesn't exist
      await client.storage.from('videos').remove([videoPath])
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Save to database - use video_path directly (not full URL)
    const { data: dbData, error: dbError } = await client
      .from('user_videos')
      .insert({
        user_id: userId,
        video_path: videoPath,
        title,
        description,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Try to delete the uploaded file
      await client.storage.from('videos').remove([videoPath])
      return NextResponse.json(
        { error: 'Failed to save video metadata', details: dbError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      video: dbData,
      message: 'Video uploaded successfully' 
    })
  } catch (error) {
    console.error('Error in user videos POST:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Delete a user video
export async function DELETE(request: NextRequest) {
  try {
    const client = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('videoId')

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    // Get video data first to delete from storage
    const { data: video, error: fetchError } = await client
      .from('user_videos')
      .select('video_path')
      .eq('id', videoId)
      .single()

    if (fetchError || !video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // Handle both old format (full URL) and new format (path only)
    let filePath: string
    if (video.video_path.startsWith('http')) {
      // Old format: extract path from URL
      const url = new URL(video.video_path)
      const pathParts = url.pathname.split('/videos/')
      filePath = pathParts[1]
    } else {
      // New format: already a path
      filePath = video.video_path
    }

    // Delete from storage
    if (filePath) {
      await client.storage.from('videos').remove([filePath])
    }

    // Delete from database
    const { error: deleteError } = await client
      .from('user_videos')
      .delete()
      .eq('id', videoId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete video', details: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Video deleted successfully' 
    })
  } catch (error) {
    console.error('Error in user videos DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
