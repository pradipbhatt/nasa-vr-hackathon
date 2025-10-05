// src/app/story/[slug]/sections/Scene9.tsx - Song Part 3 (Resolution & Legacy)
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Music, Heart, Sparkles, Star, Award, Users } from 'lucide-react'

interface SceneProps {
  sceneRef: (el: HTMLDivElement | null) => void
}

export default function Scene9({ sceneRef }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lyricsRef = useRef<HTMLImageElement>(null)
  const [currentLyric, setCurrentLyric] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const songLyrics = [
    "The journey ends where it began",
    "In the heart of the ocean, a new plan",
    "Their sacrifice now woven deep",
    "In waves of promise we will keep",
    "A legacy of hope and grace",
    "In every time, in every place",
    "The song continues, never dies",
    "Reflected in the endless skies"
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

      // Final flowers elegant entrance
      timeline.fromTo('.final-flower-1',
        { x: -150, y: -50, opacity: 0, rotation: -10, scale: 0.8 },
        { x: 0, y: 0, opacity: 0.5, rotation: 0, scale: 1, duration: 2.5, ease: "power2.out" }
      )

      timeline.fromTo('.final-flower-2',
        { x: 150, y: -50, opacity: 0, rotation: 10, scale: 0.8 },
        { x: 0, y: 0, opacity: 0.45, rotation: 0, scale: 1, duration: 2.5, ease: "power2.out" },
        "-=2.5"
      )

      timeline.fromTo('.final-flower-3',
        { x: -120, y: 50, opacity: 0, rotation: -8, scale: 0.8 },
        { x: 0, y: 0, opacity: 0.4, rotation: 0, scale: 1, duration: 2.5, ease: "power2.out" },
        "-=2"
      )

      timeline.fromTo('.final-flower-4',
        { x: 120, y: 50, opacity: 0, rotation: 8, scale: 0.8 },
        { x: 0, y: 0, opacity: 0.35, rotation: 0, scale: 1, duration: 2.5, ease: "power2.out" },
        "-=2"
      )

      timeline.fromTo('.final-flower-5',
        { x: 0, y: 100, opacity: 0, scale: 0.7 },
        { x: 0, y: 0, opacity: 0.3, scale: 1, duration: 2.5, ease: "back.out(1.5)" },
        "-=1.5"
      )

      // Final lyrics majestic entrance
      timeline.fromTo(lyricsRef.current,
        { scale: 0.5, opacity: 0, rotationY: 180, y: 100 },
        { 
          scale: 1, 
          opacity: 1, 
          rotationY: 0, 
          y: 0, 
          duration: 3.5, 
          ease: "elastic.out(1, 0.8)" 
        },
        "-=2"
      )

      // Legacy characters grand entrance
      timeline.fromTo('.legacy-character',
        { scale: 0, opacity: 0, y: 80, rotationZ: -180 },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0, 
          rotationZ: 0, 
          duration: 2, 
          stagger: 0.5,
          ease: "back.out(2)" 
        },
        "-=2"
      )

      // Text lyrics sequential reveal for finale
      timeline.fromTo('.final-lyric-line',
        { opacity: 0, y: 40, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 2, 
          stagger: 2.5,
          ease: "power2.out",
          onStart: function() {
            const index = this.targets()[0].dataset.index
            if (index !== undefined) {
              setCurrentLyric(parseInt(index))
            }
          }
        },
        "-=1.5"
      )

      // Final glow effects
      timeline.fromTo('.final-glow',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.6,
          duration: 3,
          stagger: 0.8,
          ease: "power2.out"
        },
        "-=3"
      )

      // Lyrics majestic floating
      gsap.to(lyricsRef.current, {
        y: -20,
        rotationZ: 1,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      // Legacy characters gentle movement
      gsap.to('.legacy-character', {
        y: -25,
        rotation: 1,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3
      })

      // Final music notes celebration
      gsap.to('.final-music-note', {
        y: -50,
        x: 15,
        rotation: 20,
        opacity: 1,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.7
      })

      // Celebration sparkles
      gsap.to('.celebration-sparkle', {
        scale: 1.3,
        opacity: 0.9,
        rotation: 360,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 1
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const legacyStats = [
    { icon: Users, label: "Lives Touched", value: "10,000+", color: "text-green-400" },
    { icon: Award, label: "Oceans Protected", value: "5", color: "text-blue-400" },
    { icon: Heart, label: "Communities Engaged", value: "150+", color: "text-pink-400" },
    { icon: Sparkles, label: "Legacy Projects", value: "27", color: "text-purple-400" }
  ]

  return (
    <section 
       ref={(el) => {
        sceneRef(el as HTMLDivElement | null)
        containerRef.current = el as HTMLDivElement | null
      }}
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #020204 0%, #2d1b69 30%, #1b693d 70%, #020204 100%)'
      }}
    >
      {/* Final Flowers Arrangement */}
      <img
        src="/013-021/song-pt3-flower-01.png"
        alt="Final Flower 1"
        className="final-flower-1 absolute top-10 left-10 h-64 object-contain opacity-0 z-5"
      />
      <img
        src="/013-pt3-flower-02.png"
        alt="Final Flower 2"
        className="final-flower-2 absolute top-10 right-10 h-60 object-contain opacity-0 z-5"
      />
      <img
        src="/013-021/song-pt3-flower-03.png"
        alt="Final Flower 3"
        className="final-flower-3 absolute bottom-20 left-16 h-56 object-contain opacity-0 z-5"
      />
      <img
        src="/013-021/song-pt3-flower-04.png"
        alt="Final Flower 4"
        className="final-flower-4 absolute bottom-24 right-16 h-52 object-contain opacity-0 z-5"
      />
      <img
        src="/013-021/song-pt3-flower-05.png"
        alt="Final Flower 5"
        className="final-flower-5 absolute bottom-10 left-1/2 transform -translate-x-1/2 h-48 object-contain opacity-0 z-5"
      />

      {/* Final Glow Effects */}
      <div className="final-glow absolute top-1/4 left-1/4 w-32 h-32 bg-purple-400 rounded-full opacity-0 filter blur-2xl z-4" />
      <div className="final-glow absolute top-1/3 right-1/4 w-28 h-28 bg-green-400 rounded-full opacity-0 filter blur-xl z-4" />
      <div className="final-glow absolute bottom-1/3 left-1/3 w-24 h-24 bg-blue-400 rounded-full opacity-0 filter blur-lg z-4" />

      {/* Atmospheric Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{ 
          background: 'radial-gradient(circle at center, transparent 40%, rgba(45, 27, 105, 0.6) 80%)',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-20 w-full max-w-7xl flex flex-col items-center justify-center gap-16 px-8">
        
        {/* Central Final Lyrics */}
        <img
          ref={lyricsRef}
          src="/013-021/song-pt3-lyrics.png"
          alt="Song Lyrics Final Part"
          className="w-1/2 max-w-xl opacity-0"
          style={{ 
            filter: 'drop-shadow(0 0 60px rgba(168, 85, 247, 0.6))'
          }}
        />

        {/* Final Lyrics Text Display */}
        <div className="w-full max-w-5xl text-center space-y-8">
          {songLyrics.map((lyric, index) => (
            <div
              key={index}
              data-index={index}
              className={`final-lyric-line text-3xl font-light leading-relaxed transition-all duration-1000 ${
                currentLyric === index 
                  ? 'text-white scale-110' 
                  : 'text-white/50 scale-100'
              }`}
              style={{
                opacity: currentLyric === index ? 1 : 0.4,
                textShadow: currentLyric === index 
                  ? '0 0 25px rgba(255, 255, 255, 0.9), 0 0 50px rgba(168, 85, 247, 0.6), 0 0 75px rgba(168, 85, 247, 0.3)'
                  : '0 0 15px rgba(168, 85, 247, 0.4)',
                transform: `scale(${currentLyric === index ? 1.1 : 1})`,
                transition: 'all 0.6s ease-in-out'
              }}
            >
              "{lyric}"
            </div>
          ))}
        </div>

        {/* Legacy Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl mt-8">
          {legacyStats.map((stat, index) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center p-6 rounded-2xl backdrop-blur-md transition-all duration-500 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <stat.icon 
                size={32} 
                className="mb-3"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              />
              <div className={`text-2xl font-bold mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-white/70 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Final Music Controls */}
        <div className="flex items-center gap-8 mt-12">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-4 px-8 py-4 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(79, 70, 229, 0.3))',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff'
            }}
          >
            {isPlaying ? (
              <>
                <Music size={28} />
                <span className="text-xl font-semibold">Pause Finale</span>
              </>
            ) : (
              <>
                <Music size={28} />
                <span className="text-xl font-semibold">Play Finale</span>
              </>
            )}
          </button>

          {/* Final Progress */}
          <div className="flex items-center gap-6">
            <div className="text-white/80 text-lg">
              Final Verse {currentLyric + 1} of {songLyrics.length}
            </div>
            <div className="flex gap-2">
              {songLyrics.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    currentLyric === index 
                      ? 'bg-white scale-150' 
                      : currentLyric > index 
                      ? 'bg-purple-400' 
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legacy Characters - Final Arrangement */}
      <img
        src="/013-021/song-pt3-mai.png"
        alt="Mai's Legacy"
        className="legacy-character absolute top-20 left-20 w-52 rounded-2xl shadow-2xl z-15 opacity-0"
        style={{ 
          border: '3px solid rgba(168, 85, 247, 0.7)',
          boxShadow: '0 0 50px rgba(168, 85, 247, 0.6)'
        }}
      />
      
      <img
        src="/013-021/14.png"
        alt="Character Legacy 1"
        className="legacy-character absolute top-32 right-24 w-48 rounded-2xl shadow-2xl z-15 opacity-0"
        style={{ 
          border: '3px solid rgba(34, 197, 94, 0.7)',
          boxShadow: '0 0 50px rgba(34, 197, 94, 0.6)'
        }}
      />

      <img
        src="/013-021/15.png"
        alt="Character Legacy 2"
        className="legacy-character absolute bottom-28 left-24 w-44 rounded-2xl shadow-2xl z-15 opacity-0"
        style={{ 
          border: '3px solid rgba(59, 130, 246, 0.7)',
          boxShadow: '0 0 50px rgba(59, 130, 246, 0.6)'
        }}
      />

      <img
        src="/013-021/16.png"
        alt="Character Legacy 3"
        className="legacy-character absolute bottom-32 right-20 w-46 rounded-2xl shadow-2xl z-15 opacity-0"
        style={{ 
          border: '3px solid rgba(236, 72, 153, 0.7)',
          boxShadow: '0 0 50px rgba(236, 72, 153, 0.6)'
        }}
      />

      {/* Final Music Notes - Celebration */}
      <Music 
        className="final-music-note absolute top-1/5 left-1/5 z-25 opacity-70"
        size={44} 
        color="rgba(168, 85, 247, 0.8)" 
      />
      <Heart 
        className="final-music-note absolute top-1/4 right-1/5 z-25 opacity-70"
        size={40} 
        color="rgba(34, 197, 94, 0.8)" 
      />
      <Star 
        className="final-music-note absolute bottom-1/3 left-1/4 z-25 opacity-70"
        size={36} 
        color="rgba(59, 130, 246, 0.8)" 
        fill="currentColor"
      />

      {/* Celebration Sparkles */}
      <Sparkles 
        className="celebration-sparkle absolute top-40 left-1/2 z-25 opacity-60"
        size={32} 
        color="rgba(255, 255, 255, 0.9)" 
      />
      <Sparkles 
        className="celebration-sparkle absolute bottom-44 right-1/3 z-25 opacity-60"
        size={28} 
        color="rgba(255, 255, 255, 0.8)" 
      />

      {/* Final Title Overlay */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-30 text-center">
        <h2 
          className="text-5xl font-bold flex items-center gap-4 justify-center mb-4"
          style={{ 
            color: 'rgba(255, 255, 255, 0.95)',
            textShadow: '0 0 40px rgba(168, 85, 247, 0.8), 0 0 80px rgba(168, 85, 247, 0.4)'
          }}
        >
          <Award size={42} />
          <span>The Legacy Continues</span>
          <Award size={42} />
        </h2>
        <p 
          className="text-xl text-white/80"
          style={{ textShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
        >
          A story that echoes through generations
        </p>
      </div>

      {/* Final Scene Indicator */}
      <div 
        className="absolute bottom-10 right-10 text-xl z-40 px-8 py-4 rounded-full backdrop-blur-md"
        style={{ 
          background: 'rgba(45, 27, 105, 0.9)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          color: '#ffffff',
          fontWeight: '600'
        }}
      >
        Scene 9: Song - Finale
      </div>

      {/* Trilogy Completion Badge */}
      <div 
        className="absolute bottom-10 left-10 z-35 px-6 py-3 rounded-2xl backdrop-blur-md text-center"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          color: '#ffffff'
        }}
      >
        <div className="font-bold text-lg">Song Trilogy Complete</div>
        <div className="text-white/70 text-sm">Part 3 of 3</div>
        <div className="flex justify-center gap-1 mt-2">
          {[1, 2, 3].map((part) => (
            <div
              key={part}
              className={`w-2 h-2 rounded-full ${
                part === 3 ? 'bg-green-400' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}