// src/app/story/[slug]/sections/Scene7.tsx - Song Part 1 (Grief)
'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Music, Heart } from 'lucide-react'

interface SceneProps {
  sceneRef: (el: HTMLDivElement | null) => void
}

export default function Scene7({ sceneRef }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lyricsRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 40%",
          toggleActions: "play none none reverse"
        }
      })

      // Background flowers fade in
      timeline.fromTo('.bg-flowers-left',
        { x: -150, opacity: 0, scale: 1.2 },
        { x: 0, opacity: 0.3, scale: 1, duration: 3, ease: "power2.out" }
      )

      timeline.fromTo('.bg-flowers-right',
        { x: 150, opacity: 0, scale: 1.2 },
        { x: 0, opacity: 0.3, scale: 1, duration: 3, ease: "power2.out" },
        "-=3"
      )

      // Parallax on background flowers
      gsap.to('.bg-flowers-left', {
        x: -60,
        y: 40,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      })

      gsap.to('.bg-flowers-right', {
        x: 60,
        y: 40,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      })

      // Lyrics dramatic entrance with 3D effect
      timeline.fromTo(lyricsRef.current,
        { scale: 0.7, opacity: 0, rotationX: 45, y: 100 },
        { 
          scale: 1, 
          opacity: 1, 
          rotationX: 0, 
          y: 0, 
          duration: 2.5, 
          ease: "back.out(1.5)" 
        },
        "-=2"
      )

      // Lyrics gentle floating
      gsap.to(lyricsRef.current, {
        y: -20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      // Character portraits staggered entrance
      timeline.fromTo('.character-portrait',
        { scale: 0, opacity: 0, rotationZ: -180 },
        { 
          scale: 1, 
          opacity: 1, 
          rotationZ: 0, 
          duration: 1.5, 
          stagger: 0.3,
          ease: "back.out(2)" 
        },
        "-=1.5"
      )

      // Portrait floating animations
      gsap.to('.character-portrait', {
        y: -15,
        rotation: 3,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.4
      })

      // Music notes floating
      gsap.to('.music-note', {
        y: -30,
        x: 10,
        rotation: 15,
        opacity: 0.8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={(el) => {
        sceneRef(el as HTMLDivElement | null)
        containerRef.current = el as HTMLDivElement | null
      }}
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #020204 0%, #2d1b3d 50%, #020204 100%)'
      }}
    >
      {/* Background Flowers - Left */}
      <img
        src="/013-021/song-pt1-bg-flowers-white-left.png"
        alt="Background Flowers Left"
        className="bg-flowers-left absolute left-0 top-0 h-full object-cover opacity-0 z-5"
      />

      {/* Background Flowers - Right */}
      <img
        src="/013-021/song-pt1-bg-flowers-white-right.png"
        alt="Background Flowers Right"
        className="bg-flowers-right absolute right-0 top-0 h-full object-cover opacity-0 z-5"
      />

      {/* Atmospheric Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{ background: 'radial-gradient(circle at center, transparent 20%, rgba(45, 27, 61, 0.6) 80%)' }}
      />

      {/* Central Lyrics */}
      <img
        ref={lyricsRef}
        src="/013-021/song-pt1-lyrics.png"
        alt="Song Lyrics Part 1"
        className="relative z-20 w-3/5 max-w-4xl"
        style={{ 
          filter: 'drop-shadow(0 0 40px rgba(139, 92, 246, 0.4))'
        }}
      />

      {/* Character Portraits Surrounding */}
      <img
        src="/013-021/06.png"
        alt="Character"
        className="character-portrait absolute top-20 left-20 w-56 rounded-2xl shadow-2xl z-15"
        style={{ 
          border: '3px solid rgba(139, 92, 246, 0.5)',
          boxShadow: '0 0 35px rgba(139, 92, 246, 0.4)'
        }}
      />
      
      <img
        src="/013-021/07.png"
        alt="Character"
        className="character-portrait absolute top-32 right-24 w-52 rounded-2xl shadow-2xl z-15"
        style={{ 
          border: '3px solid rgba(139, 92, 246, 0.5)',
          boxShadow: '0 0 35px rgba(139, 92, 246, 0.4)'
        }}
      />

      <img
        src="/013-021/08.png"
        alt="Character"
        className="character-portrait absolute bottom-28 left-24 w-48 rounded-2xl shadow-2xl z-15"
        style={{ 
          border: '3px solid rgba(139, 92, 246, 0.5)',
          boxShadow: '0 0 35px rgba(139, 92, 246, 0.4)'
        }}
      />

      <img
        src="/013-021/09.png"
        alt="Character"
        className="character-portrait absolute bottom-32 right-20 w-50 rounded-2xl shadow-2xl z-15"
        style={{ 
          border: '3px solid rgba(139, 92, 246, 0.5)',
          boxShadow: '0 0 35px rgba(139, 92, 246, 0.4)'
        }}
      />

      {/* Floating Music Notes */}
      <Music 
        className="music-note absolute top-1/4 left-1/3 z-25 opacity-0"
        size={36} 
        color="rgba(139, 92, 246, 0.6)" 
      />
      <Music 
        className="music-note absolute top-1/3 right-1/3 z-25 opacity-0"
        size={32} 
        color="rgba(139, 92, 246, 0.5)" 
      />
      <Heart 
        className="music-note absolute bottom-1/3 left-1/2 z-25 opacity-0"
        size={28} 
        color="rgba(139, 92, 246, 0.4)" 
      />

      {/* Title Overlay */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 text-center">
        <h2 
          className="text-4xl font-bold flex items-center gap-3 justify-center"
          style={{ 
            color: 'rgba(139, 92, 246, 0.9)',
            textShadow: '0 0 25px rgba(139, 92, 246, 0.5)'
          }}
        >
          <Music size={36} />
          <span>A Song of Loss</span>
        </h2>
      </div>

      {/* Scene Indicator */}
      <div 
        className="absolute bottom-10 right-10 text-lg z-40 px-6 py-3 rounded-full backdrop-blur-md"
        style={{ 
          background: 'rgba(45, 27, 61, 0.9)',
          border: '2px solid rgba(139, 92, 246, 0.4)',
          color: '#babab8'
        }}
      >
        Scene 7: Song - Part I
      </div>
    </section>
  )
}