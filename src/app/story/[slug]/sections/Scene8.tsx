// src/app/story/[slug]/sections/Scene8.tsx - Song Part 2 (Hope & Resilience)
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Music, Heart, Sparkles, Play, Pause } from 'lucide-react'

interface SceneProps {
  sceneRef: (el: HTMLDivElement | null) => void
}

export default function Scene8({ sceneRef }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lyricsRef = useRef<HTMLImageElement>(null)
  const [currentLyric, setCurrentLyric] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const songLyrics = [
    "Through the darkness, a light begins to grow",
    "Whispers of hope in the ocean's gentle flow",
    "Memories of laughter, echoes of the past",
    "A future worth fighting for, a love that will last",
    "Rising from the ashes, stronger than before",
    "The ocean's song continues, forevermore"
  ]

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 40%",
          toggleActions: "play none none reverse",
          onEnter: () => setIsPlaying(true),
          onLeaveBack: () => setIsPlaying(false)
        }
      })

      // Left flowers staggered entrance
      timeline.fromTo('.left-flower-1',
        { x: -200, opacity: 0, rotation: -15 },
        { x: 0, opacity: 0.4, rotation: 0, duration: 2.5, ease: "power2.out" }
      )

      timeline.fromTo('.left-flower-2',
        { x: -180, opacity: 0, rotation: -10 },
        { x: 0, opacity: 0.35, rotation: 0, duration: 2.5, ease: "power2.out" },
        "-=2"
      )

      timeline.fromTo('.left-flower-3',
        { x: -160, opacity: 0, rotation: -5 },
        { x: 0, opacity: 0.3, rotation: 0, duration: 2.5, ease: "power2.out" },
        "-=2"
      )

      // Right flowers staggered entrance
      timeline.fromTo('.right-flower-1',
        { x: 200, opacity: 0, rotation: 15 },
        { x: 0, opacity: 0.4, rotation: 0, duration: 2.5, ease: "power2.out" },
        "-=2.5"
      )

      timeline.fromTo('.right-flower-2',
        { x: 180, opacity: 0, rotation: 10 },
        { x: 0, opacity: 0.35, rotation: 0, duration: 2.5, ease: "power2.out" },
        "-=2"
      )

      timeline.fromTo('.right-flower-3',
        { x: 160, opacity: 0, rotation: 5 },
        { x: 0, opacity: 0.3, rotation: 0, duration: 2.5, ease: "power2.out" },
        "-=2"
      )

      // Lyrics dramatic entrance with hope theme
      timeline.fromTo(lyricsRef.current,
        { scale: 0.6, opacity: 0, rotationY: 90, y: 80 },
        { 
          scale: 1, 
          opacity: 1, 
          rotationY: 0, 
          y: 0, 
          duration: 3, 
          ease: "back.out(1.8)" 
        },
        "-=2"
      )

      // Text lyrics sequential reveal
      timeline.fromTo('.lyric-line',
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.5, 
          stagger: 2,
          ease: "power2.out",
          onStart: function() {
            const index = this.targets()[0].dataset.index
            if (index !== undefined) {
              setCurrentLyric(parseInt(index))
            }
          }
        },
        "-=1"
      )

      // Lyrics gentle floating with hope
      gsap.to(lyricsRef.current, {
        y: -15,
        rotationZ: 2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      // Character portraits hopeful entrance
      timeline.fromTo('.character-portrait',
        { scale: 0, opacity: 0, y: 60 },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0, 
          duration: 2, 
          stagger: 0.4,
          ease: "back.out(2)" 
        },
        "-=1.5"
      )

      // Music notes with hope theme
      gsap.to('.music-note', {
        y: -40,
        x: 8,
        rotation: 12,
        opacity: 0.9,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.6
      })

      // Sparkles for hope theme
      gsap.to('.sparkle', {
        y: -25,
        rotation: 180,
        opacity: 0.7,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.8
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
        background: 'linear-gradient(180deg, #020204 0%, #1a2d3d 50%, #020204 100%)'
      }}
    >
      {/* Left Side Flowers */}
      <img
        src="/013-021/song-pt2-left-flower-01.png"
        alt="Left Flower 1"
        className="left-flower-1 absolute left-0 top-0 h-3/4 object-contain opacity-0 z-5"
      />
      <img
        src="/013-021/song-pt2-left-flower-02.png"
        alt="Left Flower 2"
        className="left-flower-2 absolute left-4 top-10 h-2/3 object-contain opacity-0 z-5"
      />
      <img
        src="/013-021/song-pt2-left-flower-03.png"
        alt="Left Flower 3"
        className="left-flower-3 absolute left-8 top-20 h-1/2 object-contain opacity-0 z-5"
      />

      {/* Right Side Flowers */}
      <img
        src="/013-021/song-pt2-right-flower-01.png"
        alt="Right Flower 1"
        className="right-flower-1 absolute right-0 top-0 h-3/4 object-contain opacity-0 z-5"
      />
      <img
        src="/013-021/song-pt2-right-flower-02.png"
        alt="Right Flower 2"
        className="right-flower-2 absolute right-4 top-10 h-2/3 object-contain opacity-0 z-5"
      />
      <img
        src="/013-021/song-pt2-right-flower-03.png"
        alt="Right Flower 3"
        className="right-flower-3 absolute right-8 top-20 h-1/2 object-contain opacity-0 z-5"
      />

      {/* Atmospheric Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{ 
          background: 'radial-gradient(circle at center, transparent 30%, rgba(26, 45, 61, 0.7) 80%)',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-20 w-full max-w-6xl flex flex-col items-center justify-center gap-12 px-8">
        
        {/* Central Lyrics Image */}
        <img
          ref={lyricsRef}
          src="/013-021/song-pt2-lyrics.png"
          alt="Song Lyrics Part 2"
          className="w-2/3 max-w-2xl opacity-0"
          style={{ 
            filter: 'drop-shadow(0 0 50px rgba(56, 189, 248, 0.5))'
          }}
        />

        {/* Lyrics Text Display */}
        <div className="w-full max-w-4xl text-center space-y-6">
          {songLyrics.map((lyric, index) => (
            <div
              key={index}
              data-index={index}
              className={`lyric-line text-2xl font-light leading-relaxed transition-all duration-1000 ${
                currentLyric === index 
                  ? 'text-cyan-300 scale-105' 
                  : 'text-cyan-200/60 scale-100'
              }`}
              style={{
                opacity: currentLyric === index ? 1 : 0.3,
                textShadow: currentLyric === index 
                  ? '0 0 20px rgba(56, 189, 248, 0.8), 0 0 40px rgba(56, 189, 248, 0.4)'
                  : '0 0 10px rgba(56, 189, 248, 0.3)',
                transform: `scale(${currentLyric === index ? 1.05 : 1})`,
                transition: 'all 0.5s ease-in-out'
              }}
            >
              "{lyric}"
            </div>
          ))}
        </div>

        {/* Music Player Controls */}
        <div className="flex items-center gap-6 mt-8">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(56, 189, 248, 0.2)',
              border: '2px solid rgba(56, 189, 248, 0.4)',
              color: '#e0f2fe'
            }}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            <span className="text-lg font-medium">
              {isPlaying ? 'Pause Song' : 'Play Song'}
            </span>
          </button>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="text-cyan-200 text-sm">
              Verse {currentLyric + 1} of {songLyrics.length}
            </div>
            <div className="flex gap-1">
              {songLyrics.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentLyric === index 
                      ? 'bg-cyan-400 scale-125' 
                      : currentLyric > index 
                      ? 'bg-cyan-600' 
                      : 'bg-cyan-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Character Portraits Surrounding - Hope Theme */}
      <img
        src="/013-021/10.png"
        alt="Character Hope 1"
        className="character-portrait absolute top-24 left-16 w-48 rounded-2xl shadow-2xl z-15 opacity-0"
        style={{ 
          border: '3px solid rgba(56, 189, 248, 0.6)',
          boxShadow: '0 0 40px rgba(56, 189, 248, 0.5)'
        }}
      />
      
      <img
        src="/013-021/11.png"
        alt="Character Hope 2"
        className="character-portrait absolute top-36 right-20 w-44 rounded-2xl shadow-2xl z-15 opacity-0"
        style={{ 
          border: '3px solid rgba(56, 189, 248, 0.6)',
          boxShadow: '0 0 40px rgba(56, 189, 248, 0.5)'
        }}
      />

      <img
        src="/013-021/12.png"
        alt="Character Hope 3"
        className="character-portrait absolute bottom-32 left-20 w-40 rounded-2xl shadow-2xl z-15 opacity-0"
        style={{ 
          border: '3px solid rgba(56, 189, 248, 0.6)',
          boxShadow: '0 0 40px rgba(56, 189, 248, 0.5)'
        }}
      />

      <img
        src="/013-021/13.png"
        alt="Character Hope 4"
        className="character-portrait absolute bottom-28 right-16 w-42 rounded-2xl shadow-2xl z-15 opacity-0"
        style={{ 
          border: '3px solid rgba(56, 189, 248, 0.6)',
          boxShadow: '0 0 40px rgba(56, 189, 248, 0.5)'
        }}
      />

      {/* Floating Music Notes - Hope Theme */}
      <Music 
        className="music-note absolute top-1/4 left-1/4 z-25 opacity-70"
        size={40} 
        color="rgba(56, 189, 248, 0.7)" 
      />
      <Music 
        className="music-note absolute top-1/3 right-1/4 z-25 opacity-70"
        size={36} 
        color="rgba(56, 189, 248, 0.6)" 
      />
      <Heart 
        className="music-note absolute bottom-1/3 left-1/3 z-25 opacity-70"
        size={32} 
        color="rgba(56, 189, 248, 0.5)" 
      />

      {/* Sparkles for Hope Theme */}
      <Sparkles 
        className="sparkle absolute top-40 left-1/2 z-25 opacity-60"
        size={28} 
        color="rgba(56, 189, 248, 0.8)" 
      />
      <Sparkles 
        className="sparkle absolute bottom-40 right-1/3 z-25 opacity-60"
        size={24} 
        color="rgba(56, 189, 248, 0.6)" 
      />

      {/* Title Overlay - Hope Theme */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 text-center">
        <h2 
          className="text-4xl font-bold flex items-center gap-3 justify-center mb-4"
          style={{ 
            color: 'rgba(56, 189, 248, 0.9)',
            textShadow: '0 0 30px rgba(56, 189, 248, 0.6)'
          }}
        >
          <Sparkles size={36} />
          <span>A Song of Hope</span>
          <Sparkles size={36} />
        </h2>
        <p 
          className="text-lg text-cyan-200/80"
          style={{ textShadow: '0 0 15px rgba(56, 189, 248, 0.4)' }}
        >
          From the depths of loss, resilience emerges
        </p>
      </div>

      {/* Scene Indicator */}
      <div 
        className="absolute bottom-10 right-10 text-lg z-40 px-6 py-3 rounded-full backdrop-blur-md"
        style={{ 
          background: 'rgba(26, 45, 61, 0.9)',
          border: '2px solid rgba(56, 189, 248, 0.5)',
          color: '#e0f2fe'
        }}
      >
        Scene 8: Song - Part II
      </div>

      {/* Song Information */}
      <div 
        className="absolute bottom-10 left-10 z-35 px-4 py-2 rounded-lg backdrop-blur-md text-sm"
        style={{
          background: 'rgba(26, 45, 61, 0.8)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: '#e0f2fe'
        }}
      >
        <div className="font-medium">"Ocean's Resilience"</div>
        <div className="text-cyan-300/70">Part 2 of 3</div>
      </div>
    </section>
  )
}