// src/app/story/[slug]/page.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AOS from 'aos'
import 'aos/dist/aos.css'

import Scene1 from './sections/Scene1'
import Scene2 from './sections/Scene2'
import Scene3 from './sections/Scene3'
import Scene4 from './sections/Scene4'
import Scene5 from './sections/Scene5'
import Scene6 from './sections/Scene6'
import Scene7 from './sections/Scene7'
import Scene8 from './sections/Scene8'
import Scene9 from './sections/Scene9'
import Scene10 from './sections/Scene10'
import Scene11 from './sections/Scene11'
import Scene12 from './sections/Scene12'

gsap.registerPlugin(ScrollTrigger)

export default function Page() {
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioVolume, setAudioVolume] = useState(0.35)

  useEffect(() => {
    AOS.init({ 
      duration: 1200, 
      once: false, 
      offset: 100,
      easing: 'ease-out-cubic'
    })
    
    // Global parallax effect
    gsap.to('.parallax-bg', {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: "main",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  const toggleAudio = async () => {
    if (!audioRef.current) return
    try {
      if (audioPlaying) {
        audioRef.current.pause()
        setAudioPlaying(false)
      } else {
        audioRef.current.volume = audioVolume
        await audioRef.current.play()
        setAudioPlaying(true)
      }
    } catch {}
  }

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setAudioVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  return (
    <main className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="parallax-bg fixed inset-0 bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900 z-0" />

      {/* Background Audio (Rain) */}
      <audio ref={audioRef} loop preload="auto" src="/Rain(chosic.com).mp3" />
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 px-3 py-2 rounded-full backdrop-blur-md md:gap-4 md:px-4 md:py-3"
        style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)' }}>
        <button onClick={toggleAudio} className="text-white text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full"
          style={{ background: audioPlaying ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)', border: '1px solid rgba(255,255,255,0.25)' }}>
          {audioPlaying ? 'Pause rain' : 'Play rain'}
        </button>
        <input aria-label="Music volume" type="range" min="0" max="1" step="0.01" value={audioVolume} onChange={onVolumeChange} className="w-20 md:w-28" />
      </div>
      
      <Scene1 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[0] = el)} />
      <Scene2 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[1] = el)} />
      <Scene3 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[2] = el)} />
      <Scene4 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[3] = el)} />
      <Scene5 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[4] = el)} />
      <Scene6 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[5] = el)} />
      <Scene7 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[6] = el)} />
      <Scene8 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[7] = el)} />
      <Scene9 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[8] = el)} />
      <Scene10 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[9] = el)} />
      <Scene11 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[10] = el)} />
      <Scene12 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[11] = el)} />
    </main>
  )
}