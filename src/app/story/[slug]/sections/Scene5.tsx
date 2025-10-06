// src/app/story/[slug]/sections/Scene5.tsx - Song Introduction (Awakening)
'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Music, Heart, Star } from 'lucide-react'

interface SceneProps {
  sceneRef: (el: HTMLDivElement | null) => void
}

export default function Scene5({ sceneRef }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lyricsRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      })

      // Background elements gentle entrance
      timeline.fromTo('.bg-element-1',
        { x: -100, opacity: 0, scale: 1.1 },
        { x: 0, opacity: 0.25, scale: 1, duration: 2.5, ease: "power2.out" }
      )

      timeline.fromTo('.bg-element-2',
        { x: 100, opacity: 0, scale: 1.1 },
        { x: 0, opacity: 0.2, scale: 1, duration: 2.5, ease: "power2.out" },
        "-=2.5"
      )

      // Character introduction sequence
      timeline.fromTo('.main-character',
        { scale: 0.8, opacity: 0, y: 50, rotationX: 30 },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0, 
          rotationX: 0, 
          duration: 2, 
          ease: "back.out(1.7)" 
        },
        "-=2"
      )

      // Supporting characters staggered entrance
      timeline.fromTo('.support-character',
        { scale: 0, opacity: 0, y: 30 },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0, 
          duration: 1.5, 
          stagger: 0.3,
          ease: "back.out(2)" 
        },
        "-=1.5"
      )

      // Lyrics introduction with gentle reveal
      timeline.fromTo(lyricsRef.current,
        { scale: 0.5, opacity: 0, rotationY: 60 },
        { 
          scale: 1, 
          opacity: 1, 
          rotationY: 0, 
          duration: 2.5, 
          ease: "power3.out" 
        },
        "-=1"
      )

      // Lyrics gentle floating
      gsap.to(lyricsRef.current, {
        y: -10,
        rotationZ: 1,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      // Character floating animations
      gsap.to('.main-character', {
        y: -15,
        rotation: 1,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      gsap.to('.support-character', {
        y: -12,
        rotation: 0.5,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2
      })

      // Music notes introduction
      gsap.to('.music-note', {
        y: -25,
        x: 5,
        rotation: 8,
        opacity: 0.8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.4
      })

      // Stars twinkling effect
      gsap.to('.star', {
        scale: 1.2,
        opacity: 0.9,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.5
      })

      // Parallax effects
      gsap.to('.bg-element-1', {
        x: -30,
        y: 20,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      })

      gsap.to('.bg-element-2', {
        x: 30,
        y: 20,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      })

      // Gentle background pulse
      gsap.to('.bg-pulse', {
        opacity: 0.3,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
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
        background: 'linear-gradient(180deg, #020204 0%, #3d1b2d 30%, #1b3d2d 70%, #020204 100%)'
      }}
    >
      {/* Background Elements */}
      <img
        src="/013-021/01.png"
        alt="Background Element 1"
        className="bg-element-1 absolute left-0 top-0 h-full object-cover opacity-0 z-5"
      />

      <img
        src="/013-021/02.png"
        alt="Background Element 2"
        className="bg-element-2 absolute right-0 top-0 h-full object-cover opacity-0 z-5"
      />

      {/* Background Pulse Elements */}
      <img
        src="/013-021/04.png"
        alt="Background Pulse"
        className="bg-pulse absolute inset-0 w-full h-full object-cover opacity-0 z-4"
      />

      {/* Atmospheric Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{ 
          background: 'radial-gradient(circle at center, transparent 40%, rgba(59, 27, 45, 0.5) 80%)',
          mixBlendMode: 'multiply'
        }}
      />

      {/* Central Lyrics - Introduction */}
      <img
        ref={lyricsRef}
        src="/013-021/song-pt1-lyrics.png" // Using Part 1 lyrics for introduction
        alt="Song Introduction Lyrics"
        className="relative z-20 w-2/3 max-w-3xl opacity-0"
        style={{ 
          filter: 'drop-shadow(0 0 30px rgba(168, 85, 247, 0.4))'
        }}
      />

      {/* Main Character */}
      <img
        src="/013-021/05.png"
        alt="Main Character"
        className="main-character absolute top-32 left-24 w-56 rounded-2xl shadow-xl z-15 opacity-0"
        style={{ 
          border: '3px solid rgba(168, 85, 247, 0.5)',
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)'
        }}
      />

      {/* Supporting Characters */}
      <img
        src="/013-021/06.png"
        alt="Support Character 1"
        className="support-character absolute top-20 right-28 w-48 rounded-xl shadow-lg z-15 opacity-0"
        style={{ 
          border: '2px solid rgba(168, 85, 247, 0.4)',
          boxShadow: '0 0 25px rgba(168, 85, 247, 0.3)'
        }}
      />
      
      <img
        src="/013-021/07.png"
        alt="Support Character 2"
        className="support-character absolute bottom-28 left-28 w-44 rounded-xl shadow-lg z-15 opacity-0"
        style={{ 
          border: '2px solid rgba(168, 85, 247, 0.4)',
          boxShadow: '0 0 25px rgba(168, 85, 247, 0.3)'
        }}
      />

      <img
        src="/013-021/08.png"
        alt="Support Character 3"
        className="support-character absolute bottom-32 right-24 w-46 rounded-xl shadow-lg z-15 opacity-0"
        style={{ 
          border: '2px solid rgba(168, 85, 247, 0.4)',
          boxShadow: '0 0 25px rgba(168, 85, 247, 0.3)'
        }}
      />

      {/* Additional Character for Balance */}
      <img
        src="/013-021/09.png"
        alt="Support Character 4"
        className="support-character absolute top-40 left-1/2 transform -translate-x-1/2 w-40 rounded-xl shadow-lg z-15 opacity-0"
        style={{ 
          border: '2px solid rgba(168, 85, 247, 0.4)',
          boxShadow: '0 0 25px rgba(168, 85, 247, 0.3)'
        }}
      />

      {/* Floating Music Notes */}
      <Music 
        className="music-note absolute top-1/4 left-1/3 z-25 opacity-70"
        size={32} 
        color="rgba(168, 85, 247, 0.7)" 
      />
      <Music 
        className="music-note absolute top-1/3 right-1/3 z-25 opacity-70"
        size={28} 
        color="rgba(168, 85, 247, 0.6)" 
      />
      <Heart 
        className="music-note absolute bottom-1/3 left-1/2 z-25 opacity-70"
        size={24} 
        color="rgba(168, 85, 247, 0.5)" 
      />

      {/* Twinkling Stars */}
      <Star 
        className="star absolute top-28 right-32 z-25 opacity-60"
        size={20} 
        color="rgba(168, 85, 247, 0.8)" 
        fill="currentColor"
      />
      <Star 
        className="star absolute bottom-36 left-32 z-25 opacity-60"
        size={18} 
        color="rgba(168, 85, 247, 0.7)" 
        fill="currentColor"
      />
      <Star 
        className="star absolute top-44 left-36 z-25 opacity-60"
        size={16} 
        color="rgba(168, 85, 247, 0.6)" 
        fill="currentColor"
      />

      {/* Title Overlay - Introduction Theme */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 text-center">
        <h2 
          className="text-4xl font-bold flex items-center gap-3 justify-center"
          style={{ 
            color: 'rgba(168, 85, 247, 0.9)',
            textShadow: '0 0 25px rgba(168, 85, 247, 0.5)'
          }}
        >
          <Music size={36} />
          <span>The Song Begins</span>
          <Music size={36} />
        </h2>
        <p 
          className="text-lg mt-3 opacity-80"
          style={{ 
            color: 'rgba(168, 85, 247, 0.7)',
            textShadow: '0 0 15px rgba(168, 85, 247, 0.3)'
          }}
        >
          A story told through melody and memory
        </p>
      </div>

      {/* Story Introduction Text */}
      <div 
        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 text-center max-w-2xl px-8"
        style={{ 
          background: 'rgba(59, 27, 45, 0.8)',
          border: '2px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          backdropFilter: 'blur(10px)'
        }}
      >
        <p 
          className="text-lg leading-relaxed"
          style={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
          }}
        >
          "In the quiet moments between waves, a melody begins to form..."
        </p>
      </div>

      {/* Scene Indicator */}
      <div 
        className="absolute bottom-10 right-10 text-lg z-40 px-6 py-3 rounded-full backdrop-blur-md"
        style={{ 
          background: 'rgba(59, 27, 45, 0.9)',
          border: '2px solid rgba(168, 85, 247, 0.4)',
          color: '#e9d5ff'
        }}
      >
        Scene 5: Song - Introduction
      </div>

      {/* Progress Indicator */}
      <div 
        className="absolute bottom-10 left-10 z-35 flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md"
        style={{ 
          background: 'rgba(59, 27, 45, 0.8)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          color: '#e9d5ff'
        }}
      >
        <div className="flex gap-1">
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                dot === 1 
                  ? 'bg-purple-400 scale-125' 
                  : 'bg-purple-600'
              }`}
            />
          ))}
        </div>
        <span className="text-sm ml-2">Song Part 1 of 3</span>
      </div>
    </section>
  )
}