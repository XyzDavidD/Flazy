'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

type Language = 'fr' | 'en' | 'es'

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isLoading: boolean
  retranslate?: () => void
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
  const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout for faster failure

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
          
          // Preserve brand name "Flazy" / "FLAZY" - prevent translation to "Flazo"
          translatedText = translatedText.replace(/Flazo/gi, 'Flazy')
          translatedText = translatedText.replace(/FLAZO/gi, 'FLAZY')
          
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
      await new Promise(resolve => setTimeout(resolve, 500)) // Faster retry
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

  // Translate uncached texts with optimized batching for maximum speed
  // Increased batch size for faster parallel processing
  const batchSize = 5 // Process 5 at a time for better speed
  let processed = 0

  for (let i = 0; i < uncached.length; i += batchSize) {
    const batch = uncached.slice(i, i + batchSize)
    
    // Process batch in parallel for speed
    const batchPromises = batch.map(async (text) => {
      try {
        const translated = await translateText(text, targetLang, sourceLang)
        results[text] = translated
        processed++
        
        if (onProgress) {
          onProgress(processed, uncached.length)
        }
        return { text, translated }
      } catch (error) {
        console.error('Failed to translate:', text.substring(0, 50), error)
        results[text] = text // Fallback to original
        processed++
        if (onProgress) {
          onProgress(processed, uncached.length)
        }
        return { text, translated: text }
      }
    })
    
    await Promise.all(batchPromises)
    
    // Minimal delay between batches for faster overall translation
    if (i + batchSize < uncached.length) {
      await new Promise(resolve => setTimeout(resolve, 50))
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

  // Listen for re-translation requests (e.g., when FAQ answers open)
  useEffect(() => {
    const handleRetranslate = async () => {
      if (language !== 'fr' && !isTranslatingRef.current) {
        // Re-translate HTML content that might have been hidden (like FAQ answers)
        // Use a longer delay to ensure DOM is fully ready
        setTimeout(async () => {
          if (!isTranslatingRef.current && language !== 'fr') {
            isTranslatingRef.current = true
            setIsLoading(true)
            
            try {
              // Find ALL elements with data-translate-html, even if hidden
              const htmlElements = document.querySelectorAll('[data-translate-html="true"]')
              if (htmlElements.length === 0) {
                setIsLoading(false)
                isTranslatingRef.current = false
                return
              }
              
              const htmlTextsToTranslate = new Set<string>()
              const htmlElementsData = new Map<Element, string>()
              
              // Process ALL FAQ answers, even if hidden
              htmlElements.forEach(el => {
                // Always use data-original-html if available, otherwise use current innerHTML
                let originalHtml = el.getAttribute('data-original-html')
                if (!originalHtml) {
                  // If no original stored, get current content and store it
                  originalHtml = el.innerHTML
                  el.setAttribute('data-original-html', originalHtml)
                }
                
                if (!originalHtml || originalHtml.trim() === '') return
                
                // Extract all text content from HTML
                const tempDiv = document.createElement('div')
                tempDiv.innerHTML = originalHtml
                const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null)
                
                let node
                while ((node = walker.nextNode())) {
                  const text = node.textContent?.trim() || ''
                  if (text.length > 1 && text.length < 500 && !/^[\d\s\.,;:!?\-_=+*\/\\()\[\]{}|@#$%^&~`"']+$/.test(text)) {
                    htmlTextsToTranslate.add(text)
                  }
                }
                
                if (htmlTextsToTranslate.size > 0) {
                  htmlElementsData.set(el, originalHtml)
                }
              })
              
              if (htmlTextsToTranslate.size > 0) {
                console.log(`Re-translating ${htmlTextsToTranslate.size} HTML texts for FAQ answers...`)
                const htmlTextsArray = Array.from(htmlTextsToTranslate)
                const htmlTranslations = await translateBatch(htmlTextsArray, language, 'fr')
                
                // Apply translations to each HTML element
                htmlElementsData.forEach((originalHtml, el) => {
                  const tempDiv = document.createElement('div')
                  tempDiv.innerHTML = originalHtml
                  const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null)
                  
                  let node
                  while ((node = walker.nextNode())) {
                    const text = node.textContent?.trim() || ''
                    if (htmlTranslations[text]) {
                      const fullText = node.textContent || ''
                      const leadingSpaces = fullText.match(/^\s*/)?.[0] || ''
                      const trailingSpaces = fullText.match(/\s*$/)?.[0] || ''
                      let translatedText = htmlTranslations[text]
                      
                      // Preserve brand name "Flazy" / "FLAZY" - prevent translation to "Flazo"
                      translatedText = translatedText.replace(/Flazo/gi, 'Flazy')
                      translatedText = translatedText.replace(/FLAZO/gi, 'FLAZY')
                      
                      node.textContent = leadingSpaces + translatedText + trailingSpaces
                    }
                  }
                  
                  // Update the element with translated HTML
                  el.innerHTML = tempDiv.innerHTML
                  // Keep the original HTML stored for future translations
                  if (!el.getAttribute('data-original-html')) {
                    el.setAttribute('data-original-html', originalHtml)
                  }
                })
                
                console.log(`Successfully re-translated ${htmlElementsData.size} FAQ answer elements`)
              }
            } catch (error) {
              console.error('Error re-translating HTML content:', error)
            } finally {
              setIsLoading(false)
              isTranslatingRef.current = false
            }
          }
        }, 300) // Increased delay to ensure DOM is ready
      }
    }
    
    window.addEventListener('retranslate-content', handleRetranslate)
    return () => window.removeEventListener('retranslate-content', handleRetranslate)
  }, [language])

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
      }, 20000) // 20 second max for faster feedback

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

        // Wait for DOM to be ready after restoring French - optimized delay for faster translation
        await new Promise(resolve => setTimeout(resolve, 150))

        // Collect all text nodes to translate (now in French)
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              const text = node.textContent?.trim() || ''
              const parent = node.parentElement
              
              // Skip if:
              // - Too short (but allow single words that are meaningful)
              // - Too long
              // - Just numbers or special characters only
              // - In script/style tags
              // - Already marked as no-translate
              // - In code blocks
              // - In input/textarea VALUE (but allow labels!)
              if (
                text.length < 1 ||
                text.length > 500 ||
                /^[\d\s\.,;:!?\-_=+*\/\\()\[\]{}|@#$%^&~`"']+$/.test(text) ||
                !parent ||
                parent.closest('script, style, [data-no-translate], code, pre') ||
                (parent.tagName === 'INPUT' || parent.tagName === 'TEXTAREA') ||
                (parent.closest('nav, header') && parent.closest('[data-no-translate]'))
              ) {
                return NodeFilter.FILTER_REJECT
              }
              
              // Explicitly allow LABEL elements to be translated
              if (parent.tagName === 'LABEL') {
                return NodeFilter.FILTER_ACCEPT
              }

              // Translate all elements in the DOM, even if hidden (like FAQ answers that will be shown)
              // Only reject if parent is display:none or visibility:hidden
              const style = window.getComputedStyle(parent)
              if (style.display === 'none' || style.visibility === 'hidden') {
                return NodeFilter.FILTER_REJECT
              }
              // Allow elements with opacity:0 or max-height:0 (they're still in DOM and will be shown)

              return NodeFilter.FILTER_ACCEPT
            }
          }
        )

        const textNodes: Node[] = []
        const uniqueTexts = new Set<string>()
        let node

        while ((node = walker.nextNode())) {
          const fullText = node.textContent || ''
          const text = fullText.trim()
          if (text && !uniqueTexts.has(text)) {
            uniqueTexts.add(text)
            textNodes.push(node)
            // ALWAYS store the French original text (preserve leading/trailing spaces)
            if (!originalTextsRef.current.has(node)) {
              // Store both trimmed (for translation) and full (for space preservation)
              originalTextsRef.current.set(node, fullText)
            }
          }
        }

        // Get unique texts to translate (these are in French) - increased limit for better coverage
        // Process all unique texts for complete translation
        const textsToTranslate = Array.from(uniqueTexts).slice(0, 300)

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
          const originalFullText = originalTextsRef.current.get(textNode) || textNode.textContent || ''
          const originalTrimmed = originalFullText.trim()
          
          if (translations[originalTrimmed] && translations[originalTrimmed] !== originalTrimmed) {
            // Preserve leading and trailing spaces from original
            const leadingSpaces = originalFullText.match(/^\s*/)?.[0] || ''
            const trailingSpaces = originalFullText.match(/\s*$/)?.[0] || ''
            let translatedText = translations[originalTrimmed]
            
            // Preserve brand name "Flazy" / "FLAZY" - prevent translation to "Flazo"
            // Replace any incorrect translations of Flazy back to Flazy
            translatedText = translatedText.replace(/Flazo/gi, 'Flazy')
            translatedText = translatedText.replace(/FLAZO/gi, 'FLAZY')
            
            // Remove trailing periods from titles (h2, h3, h4, etc.)
            const parent = textNode.parentElement
            if (parent && (parent.tagName === 'H2' || parent.tagName === 'H3' || parent.tagName === 'H4')) {
              // Remove trailing period if it exists
              translatedText = translatedText.replace(/\.$/, '')
            }
            
            textNode.textContent = leadingSpaces + translatedText + trailingSpaces
            appliedCount++
          }
        })

        // Additional cleanup: Remove trailing periods from all title elements
        const titleElements = document.querySelectorAll('h2, h3, h4')
        titleElements.forEach((el) => {
          if (el.textContent && el.textContent.trim().endsWith('.')) {
            el.textContent = el.textContent.trim().slice(0, -1) + (el.textContent.match(/\s*$/)?.[0] || '')
          }
        })

        // Translate HTML content in elements marked with data-translate-html
        // This handles FAQ answers and other content using dangerouslySetInnerHTML
        // IMPORTANT: Find ALL elements, even if hidden (opacity-0, max-h-0, etc.)
        const htmlElements = document.querySelectorAll('[data-translate-html="true"]')
        const htmlTextsToTranslate = new Set<string>()
        const htmlElementsData = new Map<Element, string>()
        
        console.log(`Found ${htmlElements.length} HTML elements to translate (including hidden FAQ answers)`)
        
        htmlElements.forEach(el => {
          // Get original HTML - use data-original-html if available, otherwise use current innerHTML
          let originalHtml = el.getAttribute('data-original-html')
          if (!originalHtml) {
            // Store current HTML as original for future translations
            originalHtml = el.innerHTML
            el.setAttribute('data-original-html', originalHtml)
          }
          
          if (!originalHtml || originalHtml.trim() === '') return
          
          // Extract all text content from HTML (preserving structure)
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = originalHtml
          
          // Walk through text nodes to collect texts
          const walker = document.createTreeWalker(
            tempDiv,
            NodeFilter.SHOW_TEXT,
            null
          )
          
          let node
          while ((node = walker.nextNode())) {
            const text = node.textContent?.trim() || ''
            if (text.length > 1 && text.length < 500 && !/^[\d\s\.,;:!?\-_=+*\/\\()\[\]{}|@#$%^&~`"']+$/.test(text)) {
              htmlTextsToTranslate.add(text)
            }
          }
          
          if (htmlTextsToTranslate.size > 0) {
            htmlElementsData.set(el, originalHtml)
          }
        })
        
        // Translate HTML content texts
        if (htmlTextsToTranslate.size > 0) {
          console.log(`Translating ${htmlTextsToTranslate.size} unique texts from HTML content (FAQ answers, etc.)`)
          const htmlTextsArray = Array.from(htmlTextsToTranslate)
          const htmlTranslations = await translateBatch(htmlTextsArray, language, 'fr')
          
          // Apply translations to each HTML element
          htmlElementsData.forEach((originalHtml, el) => {
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = originalHtml
            
            // Walk through and translate text nodes
            const walker = document.createTreeWalker(
              tempDiv,
              NodeFilter.SHOW_TEXT,
              null
            )
            
            let node
            while ((node = walker.nextNode())) {
              const text = node.textContent?.trim() || ''
              if (htmlTranslations[text]) {
                // Preserve leading/trailing spaces
                const fullText = node.textContent || ''
                const leadingSpaces = fullText.match(/^\s*/)?.[0] || ''
                const trailingSpaces = fullText.match(/\s*$/)?.[0] || ''
                let translatedText = htmlTranslations[text]
                
                // Preserve brand name "Flazy" / "FLAZY" - prevent translation to "Flazo"
                translatedText = translatedText.replace(/Flazo/gi, 'Flazy')
                translatedText = translatedText.replace(/FLAZO/gi, 'FLAZY')
                
                node.textContent = leadingSpaces + translatedText + trailingSpaces
              }
            }
            
            // Update element with translated HTML
            el.innerHTML = tempDiv.innerHTML
            // Ensure original HTML is stored for future translations
            if (!el.getAttribute('data-original-html')) {
              el.setAttribute('data-original-html', originalHtml)
            }
            appliedCount++
          })
          
          console.log(`Translated ${htmlElementsData.size} HTML elements (FAQ answers)`)
        }

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

  const retranslate = useCallback(() => {
    if (language !== 'fr' && !isTranslatingRef.current) {
      window.dispatchEvent(new CustomEvent('retranslate-content'))
    }
  }, [language])

  return (
    <TranslationContext.Provider value={{ language, setLanguage, isLoading, retranslate }}>
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
