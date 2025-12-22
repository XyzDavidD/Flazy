import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// Helper to create server-side Supabase client with service role (if needed)
// For now, using the regular client - adjust if you need admin privileges
function getSupabaseClient() {
  // If you have a service role key for admin operations, use it here
  // For storage operations, the anon key should work if RLS policies allow
  return supabase
}

export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient()
    
    const { data, error } = await client
      .from('carousel_videos')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching carousel videos:', error)
      return NextResponse.json(
        { error: 'Failed to fetch videos', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ videos: data || [] }, { status: 200 })
  } catch (error) {
    console.error('GET /api/admin/videos error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
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

    const client = getSupabaseClient()
    
    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const videoPath = `admin/${timestamp}-${sanitizedFileName}`

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer()
    const { data: uploadData, error: uploadError } = await client.storage
      .from('videos')
      .upload(videoPath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Error uploading video:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload video', details: uploadError.message },
        { status: 500 }
      )
    }

    // Insert into carousel_videos table
    const { data: insertData, error: insertError } = await client
      .from('carousel_videos')
      .insert([
        {
          video_path: videoPath,
          is_published: true,
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting carousel video:', insertError)
      // Try to clean up uploaded file if insert fails
      await client.storage.from('videos').remove([videoPath])
      return NextResponse.json(
        { error: 'Failed to save video record', details: insertError.message },
        { status: 500 }
      )
    }

    console.log('Video uploaded successfully:', videoPath)
    return NextResponse.json({ video: insertData }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/videos error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    const client = getSupabaseClient()

    // Fetch the video record to get video_path
    const { data: videoData, error: fetchError } = await client
      .from('carousel_videos')
      .select('video_path')
      .eq('id', id)
      .single()

    if (fetchError || !videoData) {
      console.error('Error fetching video for deletion:', fetchError)
      return NextResponse.json(
        { error: 'Video not found', details: fetchError?.message },
        { status: 404 }
      )
    }

    const videoPath = videoData.video_path

    // Delete from storage
    const { error: storageError } = await client.storage
      .from('videos')
      .remove([videoPath])

    if (storageError) {
      console.error('Error deleting video from storage:', storageError)
      // Continue with DB deletion even if storage deletion fails
      console.warn('Storage deletion failed, but continuing with DB deletion')
    }

    // Delete from database
    const { error: deleteError } = await client
      .from('carousel_videos')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting video record:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete video record', details: deleteError.message },
        { status: 500 }
      )
    }

    console.log('Video deleted successfully:', id)
    return NextResponse.json({ success: true, message: 'Video deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('DELETE /api/admin/videos error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

