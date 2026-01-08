'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

type Language = 'fr' | 'en' | 'es'

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isLoading: boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Translation cache stored in localStorage
const CACHE_KEY = 'flazy_translations'
const MAX_CACHE_SIZE = 1000

function getCache(): Record<string, Record<Language, string>> {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    return cached ? JSON.parse(cached) : {}
  } catch {
    return {}
  }
}

function setCache(cache: Record<string, Record<Language, string>>) {
  try {
    // Limit cache size
    const entries = Object.entries(cache)
    if (entries.length > MAX_CACHE_SIZE) {
      const trimmed = Object.fromEntries(entries.slice(-MAX_CACHE_SIZE))
      localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed))
    } else {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    }
  } catch {
    // Ignore storage errors
  }
}

// Google Translate API function with timeout and retry
async function translateText(
  text: string,
  targetLang: Language,
  sourceLang: Language = 'fr',
  retries = 2
): Promise<string> {
  // If same language, return original
  if (targetLang === sourceLang || !text.trim()) {
    return text
  }

  const cache = getCache()
  const cacheKey = `${sourceLang}-${targetLang}-${text}`
  
  // Check cache first
  if (cache[cacheKey]?.[targetLang]) {
    return cache[cacheKey][targetLang]
  }

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

  try {
    // Try multiple endpoints for better reliability
    const endpoints = [
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`,
      `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${sourceLang}&tl=${targetLang}&q=${encodeURIComponent(text)}`,
    ]

    let lastError: Error | null = null

    for (const url of endpoints) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()
        
        // Handle different response formats
        let translatedText = text
        if (Array.isArray(data) && data[0] && Array.isArray(data[0])) {
          // Format: [[["translated text", ...], ...], ...]
          translatedText = data[0]?.[0]?.[0] || text
        } else if (Array.isArray(data) && typeof data[0] === 'string') {
          // Format: ["translated text", ...]
          translatedText = data[0] || text
        } else if (typeof data === 'string') {
          translatedText = data
        }

        // Validate translation (should be different from original for different languages)
        if (translatedText && translatedText !== text && translatedText.trim().length > 0) {
          clearTimeout(timeoutId)
          
          // Update cache
          if (!cache[cacheKey]) {
            cache[cacheKey] = {} as Record<Language, string>
          }
          cache[cacheKey][targetLang] = translatedText
          cache[cacheKey][sourceLang] = text
          setCache(cache)

          return translatedText
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          throw new Error('Translation timeout')
        }
        lastError = error
        // Try next endpoint
        continue
      }
    }

    // If all endpoints failed and we have retries, try again
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return translateText(text, targetLang, sourceLang, retries - 1)
    }

    throw lastError || new Error('All translation endpoints failed')
  } catch (error) {
    clearTimeout(timeoutId)
    console.error('Translation error:', error, 'Text:', text.substring(0, 50))
    // Return original text if translation fails
    return text
  }
}

// Translate multiple texts with rate limiting and progress tracking
async function translateBatch(
  texts: string[],
  targetLang: Language,
  sourceLang: Language = 'fr',
  onProgress?: (current: number, total: number) => void
): Promise<Record<string, string>> {
  const results: Record<string, string> = {}
  const cache = getCache()
  
  // Check cache first
  const uncached: string[] = []
  texts.forEach(text => {
    const cacheKey = `${sourceLang}-${targetLang}-${text}`
    if (cache[cacheKey]?.[targetLang]) {
      results[text] = cache[cacheKey][targetLang]
    } else {
      uncached.push(text)
    }
  })

  // If everything is cached, return immediately
  if (uncached.length === 0) {
    return results
  }

  // Translate uncached texts one by one to avoid rate limiting
  // Smaller batches for better reliability
  const batchSize = 1 // Process one at a time for better reliability
  let processed = 0

  for (let i = 0; i < uncached.length; i += batchSize) {
    const batch = uncached.slice(i, i + batchSize)
    
    // Process sequentially within batch
    for (const text of batch) {
      try {
        const translated = await translateText(text, targetLang, sourceLang)
        results[text] = translated
        processed++
        
        if (onProgress) {
          onProgress(processed, uncached.length)
        }
      } catch (error) {
        console.error('Failed to translate:', text.substring(0, 50), error)
        results[text] = text // Fallback to original
        processed++
      }
      
      // Delay between translations to avoid rate limiting
      if (i + batchSize < uncached.length) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    }
  }
  
  return results
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr')
  const [isLoading, setIsLoading] = useState(false)
  const originalTextsRef = useRef<Map<Node, string>>(new Map())
  const isTranslatingRef = useRef(false)

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('flazy_language') as Language
    if (savedLang && ['fr', 'en', 'es'].includes(savedLang)) {
      setLanguageState(savedLang)
    }
  }, [])

  // Auto-translate page content when language changes
  useEffect(() => {
    if (isTranslatingRef.current) return
    
    const translatePage = async () => {
      isTranslatingRef.current = true
      setIsLoading(true)

      // Set a maximum timeout for the entire translation process
      const overallTimeout = setTimeout(() => {
        if (isTranslatingRef.current) {
          console.warn('Translation timeout - stopping process')
          setIsLoading(false)
          isTranslatingRef.current = false
        }
      }, 30000) // 30 second max

      try {
        // FIRST: Always restore to French original text first
        if (originalTextsRef.current.size > 0) {
          originalTextsRef.current.forEach((originalFrenchText, node) => {
            node.textContent = originalFrenchText
          })
        }

        if (language === 'fr') {
          // If French, we're done - just clear the ref
          originalTextsRef.current.clear()
          clearTimeout(overallTimeout)
          setIsLoading(false)
          isTranslatingRef.current = false
          return
        }

        // Wait for DOM to be ready after restoring French
        await new Promise(resolve => setTimeout(resolve, 200))

        // Collect all text nodes to translate (now in French)
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              const text = node.textContent?.trim() || ''
              const parent = node.parentElement
              
              // Skip if:
              // - Too short or too long
              // - Just numbers
              // - In script/style tags
              // - Already marked as no-translate
              // - In code blocks
              if (
                text.length < 2 ||
                text.length > 200 ||
                /^\d+$/.test(text) ||
                !parent ||
                parent.closest('script, style, [data-no-translate], code, pre') ||
                parent.closest('input, textarea') ||
                parent.closest('nav, header')?.querySelector('[data-no-translate]')
              ) {
                return NodeFilter.FILTER_REJECT
              }

              // Only translate visible elements
              const rect = parent.getBoundingClientRect()
              if (rect.width === 0 && rect.height === 0) {
                return NodeFilter.FILTER_REJECT
              }

              return NodeFilter.FILTER_ACCEPT
            }
          }
        )

        const textNodes: Node[] = []
        const uniqueTexts = new Set<string>()
        let node

        while ((node = walker.nextNode())) {
          const text = node.textContent?.trim() || ''
          if (text && !uniqueTexts.has(text)) {
            uniqueTexts.add(text)
            textNodes.push(node)
            // ALWAYS store the French original text
            if (!originalTextsRef.current.has(node)) {
              originalTextsRef.current.set(node, text)
            }
          }
        }

        // Get unique texts to translate (these are in French)
        const textsToTranslate = Array.from(uniqueTexts).slice(0, 50)

        console.log(`Translating ${textsToTranslate.length} French texts to ${language}...`)

        // ALWAYS translate from French (fr) to target language
        const translations = await translateBatch(
          textsToTranslate,
          language,
          'fr', // Always from French
          (current, total) => {
            console.log(`Translation progress: ${current}/${total}`)
          }
        )

        // Apply translations
        let appliedCount = 0
        textNodes.forEach((textNode) => {
          const originalFrenchText = originalTextsRef.current.get(textNode) || textNode.textContent?.trim() || ''
          if (translations[originalFrenchText] && translations[originalFrenchText] !== originalFrenchText) {
            textNode.textContent = translations[originalFrenchText]
            appliedCount++
          }
        })

        console.log(`Applied ${appliedCount} translations`)
        clearTimeout(overallTimeout)
      } catch (error) {
        console.error('Error translating page:', error)
        clearTimeout(overallTimeout)
      } finally {
        setIsLoading(false)
        isTranslatingRef.current = false
      }
    }

    translatePage()
  }, [language])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('flazy_language', lang)
    // Update HTML lang attribute
    document.documentElement.lang = lang
  }, [])

  return (
    <TranslationContext.Provider value={{ language, setLanguage, isLoading }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}
