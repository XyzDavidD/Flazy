import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FLAZY - Générateur de Vidéos IA Virales',
  description: 'Créez des vidéos virales et monétisables avec l\'IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}

