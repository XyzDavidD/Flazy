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
    const formData = await request.formData()
    const videoFile = formData.get('video') as File
    const userId = formData.get('userId') as string
    const title = formData.get('title') as string || ''
    const description = formData.get('description') as string || ''

    if (!videoFile) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Verify user exists
    const { data: userData, error: userError } = await client.auth.admin.getUserById(userId)
    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Upload video to Supabase Storage
    const fileExt = videoFile.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    
    const arrayBuffer = await videoFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data: uploadData, error: uploadError } = await client
      .storage
      .from('videos')
      .upload(fileName, buffer, {
        contentType: videoFile.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload video', details: uploadError.message },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = client
      .storage
      .from('videos')
      .getPublicUrl(fileName)

    // Save to database
    const { data: dbData, error: dbError } = await client
      .from('user_videos')
      .insert({
        user_id: userId,
        video_path: urlData.publicUrl,
        title,
        description,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Try to delete the uploaded file
      await client.storage.from('videos').remove([fileName])
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

    // Extract file path from URL
    const url = new URL(video.video_path)
    const pathParts = url.pathname.split('/videos/')
    const filePath = pathParts[1]

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
