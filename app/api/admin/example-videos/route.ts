import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for large file uploads

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
    })
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// GET: Fetch all example videos (ordered by position)
export async function GET(request: NextRequest) {
  try {
    let client
    try {
      client = getSupabaseClient()
    } catch (error) {
      console.error('Failed to create Supabase client:', error)
      return NextResponse.json(
        { error: 'Server configuration error', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      )
    }
    
    const { data, error } = await client
      .from('example_videos')
      .select('*')
      .order('position', { ascending: true })

    if (error) {
      console.error('Error fetching example videos:', error)
      return NextResponse.json(
        { error: 'Failed to fetch videos', details: error.message },
        { status: 500 }
      )
    }

    // Ensure we have 4 positions, fill missing ones with null
    const videosByPosition: any[] = [null, null, null, null]
    if (data) {
      data.forEach((video: any) => {
        if (video.position >= 1 && video.position <= 4) {
          videosByPosition[video.position - 1] = video
        }
      })
    }

    return NextResponse.json({ videos: videosByPosition }, { status: 200 })
  } catch (error) {
    console.error('GET /api/admin/example-videos error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// PUT: Replace video at a specific position
export async function PUT(request: NextRequest) {
  try {
    let client
    try {
      client = getSupabaseClient()
    } catch (error) {
      console.error('Failed to create Supabase client:', error)
      return NextResponse.json(
        { error: 'Server configuration error', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const positionStr = formData.get('position') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!file || !positionStr || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: file, position, title, description' },
        { status: 400 }
      )
    }

    const position = parseInt(positionStr, 10)
    if (position < 1 || position > 4) {
      return NextResponse.json(
        { error: 'Position must be between 1 and 4' },
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
    
    // Check if video exists at this position
    const { data: existingVideoData, error: fetchError } = await client
      .from('example_videos')
      .select('id, video_path')
      .eq('position', position)
      .maybeSingle()
    
    const existingVideo = fetchError ? null : existingVideoData

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const videoPath = `examples/${timestamp}-${sanitizedFileName}`

    // File already extends Blob, so we can use it directly
    // Upload new video to Supabase Storage
    const { data: uploadData, error: uploadError } = await client.storage
      .from('videos')
      .upload(videoPath, file, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600',
      })

    if (uploadError) {
      console.error('Error uploading video:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload video', details: uploadError.message },
        { status: 500 }
      )
    }

    // Delete old video from storage if it exists
    if (existingVideo && existingVideo.video_path) {
      const { error: deleteStorageError } = await client.storage
        .from('videos')
        .remove([existingVideo.video_path])
      
      if (deleteStorageError) {
        console.warn('Error deleting old video from storage:', deleteStorageError)
        // Continue anyway
      }
    }

    // Update or insert the video record
    if (existingVideo) {
      // Update existing record
      const { data: updateData, error: updateError } = await client
        .from('example_videos')
        .update({
          video_path: videoPath,
          title: title,
          description: description,
          updated_at: new Date().toISOString(),
        })
        .eq('position', position)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating example video:', updateError)
        // Try to clean up uploaded file if update fails
        await client.storage.from('videos').remove([videoPath])
        return NextResponse.json(
          { error: 'Failed to update video record', details: updateError.message },
          { status: 500 }
        )
      }

      console.log('Example video updated successfully:', position)
      return NextResponse.json({ video: updateData }, { status: 200 })
    } else {
      // Insert new record
      const { data: insertData, error: insertError } = await client
        .from('example_videos')
        .insert([
          {
            video_path: videoPath,
            position: position,
            title: title,
            description: description,
          },
        ])
        .select()
        .single()

      if (insertError) {
        console.error('Error inserting example video:', insertError)
        // Try to clean up uploaded file if insert fails
        await client.storage.from('videos').remove([videoPath])
        return NextResponse.json(
          { error: 'Failed to save video record', details: insertError.message },
          { status: 500 }
        )
      }

      console.log('Example video created successfully:', position)
      return NextResponse.json({ video: insertData }, { status: 201 })
    }
  } catch (error) {
    console.error('PUT /api/admin/example-videos error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

