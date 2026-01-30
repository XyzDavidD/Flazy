import React from 'react'

interface FlagIconProps {
  countryCode: 'fr' | 'en' | 'es'
  className?: string
}

export const FlagIcon: React.FC<FlagIconProps> = ({ countryCode, className = '' }) => {
  const flags = {
    fr: (
      <svg className={className} viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
        <rect width="900" height="600" fill="#ED2939"/>
        <rect width="600" height="600" fill="#fff"/>
        <rect width="300" height="600" fill="#002395"/>
      </svg>
    ),
    en: (
      <svg className={className} viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
        <clipPath id="s">
          <path d="M0,0 v30 h60 v-30 z"/>
        </clipPath>
        <clipPath id="t">
          <path d="M30,15 h30 v15 z v-30 h-30 z h-30 v15 z v-30 h30 z"/>
        </clipPath>
        <g clipPath="url(#s)">
          <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
        </g>
      </svg>
    ),
    es: (
      <svg className={className} viewBox="0 0 750 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="750" height="500" fill="#c60b1e"/>
        <rect width="750" height="250" y="125" fill="#ffc400"/>
      </svg>
    ),
  }

  return flags[countryCode] || null
}
