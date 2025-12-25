'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

interface UseCreditsReturn {
  credits: number | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useCredits(): UseCreditsReturn {
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const fetchCredits = useCallback(async (userId: string) => {
    try {
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', userId)
        .single()

      if (fetchError) {
        // If row doesn't exist, credits are 0
        if (fetchError.code === 'PGRST116') {
          setCredits(0)
        } else {
          console.error('Error fetching credits:', fetchError)
          setError(fetchError.message)
        }
      } else {
        setCredits(data?.credits ?? 0)
      }
    } catch (err) {
      console.error('Error fetching credits:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    if (user) {
      setLoading(true)
      await fetchCredits(user.id)
      // Dispatch global event so other instances can refresh too
      window.dispatchEvent(new CustomEvent('credits-refresh'))
    }
  }, [user, fetchCredits])

  // Listen for global refresh events from other instances
  useEffect(() => {
    const handleRefresh = () => {
      if (user) {
        fetchCredits(user.id)
      }
    }
    window.addEventListener('credits-refresh', handleRefresh)
    return () => {
      window.removeEventListener('credits-refresh', handleRefresh)
    }
  }, [user, fetchCredits])

  // Get current user and set up auth listener
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchCredits(session.user.id)
      } else {
        setUser(null)
        setCredits(null)
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchCredits(session.user.id)
      } else {
        setUser(null)
        setCredits(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchCredits])

  // Set up realtime subscription for user_credits
  useEffect(() => {
    if (!user) {
      return
    }

    const channel = supabase
      .channel(`user_credits:${user.id}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'user_credits',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Realtime credits update:', payload)
          // Update credits immediately when DB changes
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const newCredits = (payload.new as { credits: number })?.credits ?? 0
            setCredits(newCredits)
            setLoading(false)
          } else if (payload.eventType === 'DELETE') {
            setCredits(0)
            setLoading(false)
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status)
        if (status === 'SUBSCRIBED') {
          // Once subscribed, fetch current credits to ensure we have the latest
          fetchCredits(user.id)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchCredits])

  return { credits, loading, error, refresh }
}

