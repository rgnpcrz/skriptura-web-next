'use client'

import { useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function ClientShell({ children }) {
  const [konamiActive, setKonamiActive] = useState(false)

  const handleKonami = () => {
    setKonamiActive(true)
    setTimeout(() => setKonamiActive(false), 3000)
  }

  useEffect(() => {
    document.body.style.filter = konamiActive ? 'invert(1)' : ''
    return () => { document.body.style.filter = '' }
  }, [konamiActive])

  return (
    <div className="flex flex-col min-h-screen">
      <Header onKonami={handleKonami} />
      {konamiActive && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="bg-accent border-4 border-black shadow-card px-8 py-4 font-mono font-bold text-xl text-black animate-bounce">
            ↑↑↓↓←→←→BA · CHEAT ACTIVATED
          </div>
        </div>
      )}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {children}
      </main>
      <Footer />
    </div>
  )
}
