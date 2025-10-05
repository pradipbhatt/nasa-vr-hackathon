// src/app/story/[slug]/sections/Scene6.tsx - Grief & Remembrance
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flower2, Sparkles, Wind } from 'lucide-react'

interface SceneProps {
  sceneRef: (el: HTMLDivElement | null) => void
}

export default function Scene6({ sceneRef }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sangamRef = useRef<HTMLImageElement>(null)
  const [showMemorial, setShowMemorial] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Memorial fade in
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            setTimeout(() => setShowMemorial(true), 1000)
          }
        }
      })

      // Background incense smoke effect
      timeline.fromTo('.incense-bg',
        { opacity: 0, scale: 1.1 },
        { opacity: 0.4, scale: 1, duration: 3, ease: "power2.out" }
      )

      // Parallax on incense background
      gsap.to('.incense-bg', {
        y: 80,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      })

      // Sangam's grief - centered portrait
      timeline.fromTo(sangamRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 2.5, ease: "power2.out" }
      )

      // Gentle floating animation
      gsap.to(sangamRef.current, {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      // Left flowers cascade entrance
      timeline.fromTo('.left-flowers',
        { x: -100, opacity: 0, rotation: -20 },
        { 
          x: 0, 
          opacity: 0.9, 
          rotation: 0, 
          duration: 2,
          stagger: 0.3,
          ease: "back.out(1.2)"
        },
        "-=2"
      )

      // Right flowers cascade entrance
      timeline.fromTo('.right-flowers',
        { x: 100, opacity: 0, rotation: 20 },
        { 
          x: 0, 
          opacity: 0.9, 
          rotation: 0, 
          duration: 2,
          stagger: 0.3,
          ease: "back.out(1.2)"
        },
        "-=2"
      )

      // Flower floating animations with parallax
      gsap.to('.flower-float', {
        y: -20,
        x: 10,
        rotation: 5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5
      })

      // Left leaves gentle sway
      gsap.to('.left-leaf', {
        rotation: 8,
        x: 5,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.4
      })

      // Right leaves gentle sway
      gsap.to('.right-leaf', {
        rotation: -8,
        x: -5,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.4
      })

      // Memorial photos fade in
      if (showMemorial) {
        gsap.fromTo('.memorial-photo',
          { scale: 0, opacity: 0, rotationY: 90 },
          {
            scale: 1,
            opacity: 1,
            rotationY: 0,
            duration: 1.5,
            stagger: 0.3,
            ease: "back.out(1.5)"
          }
        )

        // Gentle pulse on memorial photos
        gsap.to('.memorial-photo', {
          scale: 1.05,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.2
        })
      }

      // Sparkle effects
      gsap.to('.sparkle-effect', {
        opacity: 0.8,
        scale: 1.2,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3
      })

    }, containerRef)

    return () => ctx.revert()
  }, [showMemorial])

  return (
    <section 
      ref={(el) => {
        sceneRef(el as HTMLDivElement | null)
        containerRef.current = el as HTMLDivElement | null
      }}
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #020204 0%, #1a1a1f 50%, #020204 100%)'
      }}
    >
      {/* Incense Background */}
      <img
        src="/013-021/bg-incense-01.png"
        alt="Incense Background"
        className="incense-bg absolute inset-0 w-full h-full object-cover opacity-0"
      />

      {/* Atmospheric Overlay */}
      <div 
        className="absolute inset-0 z-5"
        style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(2, 2, 4, 0.7) 100%)' }}
      />

      {/* Left Decorative Flowers */}
      <img
        src="/013-021/song-pt2-left-flower-01.png"
        alt="Left Flower"
        className="left-flowers flower-float absolute top-20 left-10 w-32 z-15"
      />
      <img
        src="/013-021/song-pt2-left-flower-02.png"
        alt="Left Flower"
        className="left-flowers flower-float absolute top-40 left-5 w-28 z-15"
      />
      <img
        src="/013-021/song-pt2-left-flower-03.png"
        alt="Left Flower"
        className="left-flowers flower-float absolute top-60 left-12 w-24 z-15"
      />

      {/* Left Leaves */}
      <img
        src="/013-021/song-pt2-left-leaf-01.png"
        alt="Left Leaf"
        className="left-leaf absolute top-1/3 left-20 w-20 z-12 opacity-70"
      />
      <img
        src="/013-021/song-pt2-left-leaf-02.png"
        alt="Left Leaf"
        className="left-leaf absolute top-2/3 left-16 w-24 z-12 opacity-70"
      />

      {/* Right Decorative Flowers */}
      <img
        src="/013-021/song-pt2-right-flower-01.png"
        alt="Right Flower"
        className="right-flowers flower-float absolute top-20 right-10 w-32 z-15"
      />
      <img
        src="/013-021/song-pt2-right-flower-02.png"
        alt="Right Flower"
        className="right-flowers flower-float absolute top-40 right-5 w-28 z-15"
      />
      <img
        src="/013-021/song-pt2-right-flower-03.png"
        alt="Right Flower"
        className="right-flowers flower-float absolute top-60 right-12 w-24 z-15"
      />

      {/* Right Leaves */}
      <img
        src="/013-021/song-pt2-right-leaf-01.png"
        alt="Right Leaf"
        className="right-leaf absolute top-1/3 right-20 w-20 z-12 opacity-70"
      />
      <img
        src="/013-021/song-pt2-right-leaf-02.png"
        alt="Right Leaf"
        className="right-leaf absolute top-1/2 right-24 w-22 z-12 opacity-70"
      />
      <img
        src="/013-021/song-pt2-right-leaf-03.png"
        alt="Right Leaf"
        className="right-leaf absolute top-2/3 right-16 w-24 z-12 opacity-70"
      />

      {/* Central Sangam Portrait */}
      <img
        ref={sangamRef}
        src="/013-021/01.png"
        alt="Sangam in Grief"
        className="relative z-20 w-2/5 max-w-2xl rounded-3xl shadow-2xl"
        style={{ 
          border: '4px solid rgba(139, 92, 246, 0.4)',
          boxShadow: '0 0 50px rgba(139, 92, 246, 0.3)'
        }}
      />

      {/* Memorial Photos */}
      {showMemorial && (
        <>
          <img
            src="/013-021/02.png"
            alt="Memory"
            className="memorial-photo absolute top-1/4 left-1/4 w-48 rounded-xl shadow-xl z-18"
            style={{ 
              border: '3px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
            }}
          />
          <img
            src="/013-021/04.png"
            alt="Memory"
            className="memorial-photo absolute top-1/3 right-1/4 w-48 rounded-xl shadow-xl z-18"
            style={{ 
              border: '3px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
            }}
          />
          <img
            src="/013-021/05.png"
            alt="Memory"
            className="memorial-photo absolute bottom-1/4 left-1/3 w-44 rounded-xl shadow-xl z-18"
            style={{ 
              border: '3px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
            }}
          />
        </>
      )}

      {/* Sparkle Effects */}
      <Sparkles 
        className="sparkle-effect absolute top-1/4 left-1/2 z-25 opacity-0"
        size={32} 
        color="rgba(139, 92, 246, 0.6)" 
      />
      <Sparkles 
        className="sparkle-effect absolute bottom-1/3 right-1/3 z-25 opacity-0"
        size={28} 
        color="rgba(139, 92, 246, 0.5)" 
      />

      {/* Title */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 text-center">
        <h2 
          className="text-5xl font-bold mb-4 flex items-center gap-3 justify-center"
          style={{ 
            color: 'rgba(139, 92, 246, 0.9)',
            textShadow: '0 0 30px rgba(139, 92, 246, 0.5)'
          }}
        >
          <Flower2 size={40} />
          <span>In Loving Memory</span>
        </h2>
        <p className="text-xl italic" style={{ color: 'rgba(186, 186, 184, 0.8)' }}>
          "Their spirits live on in every wave..."
        </p>
      </div>

      {/* Scene Indicator */}
      <div 
        className="absolute bottom-10 right-10 text-lg z-40 px-6 py-3 rounded-full backdrop-blur-md"
        style={{ 
          background: 'rgba(26, 26, 31, 0.9)',
          border: '2px solid rgba(139, 92, 246, 0.4)',
          color: '#babab8'
        }}
      >
        Scene 6: Remembrance
      </div>
    </section>
  )
}