'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

type GtagFunction = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    gtag?: GtagFunction
  }
}

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const query = searchParams?.toString()
    const pagePath = query ? `${pathname}?${query}` : pathname
    const pageLocation = window.location.href
    const pageTitle = document.title

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_location: pageLocation,
        page_title: pageTitle,
      })
    }

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'page_view',
      page_path: pagePath,
      page_location: pageLocation,
      page_title: pageTitle,
    })
  }, [pathname, searchParams])

  return null
}
