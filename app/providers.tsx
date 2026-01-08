'use client'

import { TranslationProvider } from '@/lib/translations/context'

export function Providers({ children }: { children: React.ReactNode }) {
  return <TranslationProvider>{children}</TranslationProvider>
}
