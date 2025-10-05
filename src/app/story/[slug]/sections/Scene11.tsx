// src/app/story/[slug]/sections/Scene11.tsx - Legacy & Hope
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Heart, Star, Award, Users, Globe, ArrowUp, Calendar, Target, Sparkles } from 'lucide-react'

interface SceneProps {
  sceneRef: (el: HTMLDivElement | null) => void
}

export default function Scene11({ sceneRef }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeTimeline, setActiveTimeline] = useState(0)
  const [showFuture, setShowFuture] = useState(false)

  const legacyTimeline = [
    {
      year: "2024",
      title: "Global Awareness Launch",
      description: "The story reaches millions, sparking international conversation",
      icon: Users,
      color: "text-blue-400",
      achievements: ["10M+ views", "50+ countries", "Media coverage"]
    },
    {
      year: "2025",
      title: "Policy Changes",
      description: "Governments implement new ocean protection laws",
      icon: Award,
      color: "text-green-400",
      achievements: ["5 new laws", "Protected areas", "Funding secured"]
    },
    {
      year: "2026",
      title: "Community Action",
      description: "Local communities lead conservation efforts",
      icon: Heart,
      color: "text-pink-400",
      achievements: ["1000+ volunteers", "Beach cleanups", "Education programs"]
    },
    {
      year: "2027",
      title: "Marine Recovery",
      description: "Visible improvements in ocean health and biodiversity",
      icon: Star,
      color: "text-yellow-400",
      achievements: ["Coral regrowth", "Species return", "Cleaner waters"]
    }
  ]

  const futureVision = [
    {
      icon: Globe,
      title: "Thriving Oceans",
      description: "Marine ecosystems restored to their full glory",
      metrics: "95% healthy",
      color: "text-cyan-400"
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Millions actively protecting our oceans",
      metrics: "50M+ advocates",
      color: "text-purple-400"
    },
    {
      icon: Target,
      title: "Sustainable Future",
      description: "Balance between human needs and ocean health",
      metrics: "100% sustainable",
      color: "text-green-400"
    },
    {
      icon: Sparkles,
      title: "Inspiring Legacy",
      description: "New generations continue the mission",
      metrics: "Perpetual impact",
      color: "text-yellow-400"
    }
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
          onEnter: () => setShowFuture(true)
        }
      })

      // Grand floral entrance
      timeline.fromTo('.legacy-flower-1',
        { x: -300, opacity: 0, rotation: -20, scale: 0.8 },
        { x: 0, opacity: 0.5, rotation: 0, scale: 1, duration: 3, ease: "power2.out" }
      )

      timeline.fromTo('.legacy-flower-2',
        { x: 300, opacity: 0, rotation: 20, scale: 0.8 },
        { x: 0, opacity: 0.45, rotation: 0, scale: 1, duration: 3, ease: "power2.out" },
        "-=3"
      )

      // Title majestic entrance
      timeline.fromTo('.legacy-title',
        { y: -80, opacity: 0, scale: 0.7 },
        { y: 0, opacity: 1, scale: 1, duration: 2.5, ease: "back.out(1.8)" },
        "-=2.5"
      )

      // Timeline items sequential reveal
      timeline.fromTo('.timeline-item',
        { x: -100, opacity: 0, scale: 0.9 },
        { 
          x: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 1.8, 
          stagger: 1,
          ease: "power2.out",
          onStart: function() {
            const index = this.targets()[0].dataset.index
            if (index !== undefined) {
              setActiveTimeline(parseInt(index))
            }
          }
        },
        "-=2"
      )

      // Future vision reveal
      timeline.fromTo('.future-item',
        { y: 50, opacity: 0, rotationX: 45 },
        { 
          y: 0, 
          opacity: 1, 
          rotationX: 0, 
          duration: 2, 
          stagger: 0.4,
          ease: "back.out(1.7)" 
        },
        "-=1"
      )

      // Celebration elements
      timeline.fromTo('.celebration-element',
        { scale: 0, opacity: 0, rotation: 180 },
        {
          scale: 1,
          opacity: 0.8,
          rotation: 0,
          duration: 1.5,
          stagger: 0.3,
          ease: "elastic.out(1, 0.5)"
        },
        "-=1.5"
      )

      // Continuous floating animations
      gsap.to('.floating-legacy', {
        y: -25,
        rotation: 2,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5
      })

      // Background pulse for hope
      gsap.to('.hope-pulse', {
        opacity: 0.4,
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
        background: 'linear-gradient(180deg, #020204 0%, #3730a3 25%, #7e22ce 50%, #0d9488 75%, #020204 100%)'
      }}
    >
      {/* Grand Floral Background */}
      <img
        src="/013-021/song-pt3-flower-01.png"
        alt="Legacy Flower Left"
        className="legacy-flower-1 absolute left-0 top-0 h-4/5 object-contain opacity-0 z-5"
      />
      <img
        src="/013-021/song-pt3-flower-02.png"
        alt="Legacy Flower Right"
        className="legacy-flower-2 absolute right-0 top-0 h-4/5 object-contain opacity-0 z-5"
      />

      {/* Additional Floral Accents */}
      <img
        src="/013-021/song-pt3-flower-03.png"
        alt="Floral Accent 1"
        className="floating-legacy absolute top-32 left-32 h-40 object-contain opacity-50 z-6"
      />
      <img
        src="/013-021/song-pt3-flower-04.png"
        alt="Floral Accent 2"
        className="floating-legacy absolute bottom-32 right-32 h-36 object-contain opacity-45 z-6"
      />
      <img
        src="/013-021/song-pt3-flower-05.png"
        alt="Floral Accent 3"
        className="floating-legacy absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-44 object-contain opacity-40 z-6"
      />

      {/* Hope Pulse Background */}
      <div 
        className="hope-pulse absolute inset-0 z-2"
        style={{
          background: 'radial-gradient(circle at center, rgba(125, 34, 206, 0.2) 0%, transparent 70%)',
        }}
      />

      {/* Atmospheric Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{ 
          background: 'radial-gradient(circle at center, transparent 30%, rgba(55, 48, 163, 0.7) 80%)',
          mixBlendMode: 'soft-light'
        }}
      />

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-8xl flex flex-col items-center justify-center gap-16 px-8 py-16">
        
        {/* Grand Title */}
        <div className="legacy-title text-center opacity-0">
          <h1 
            className="text-6xl md:text-7xl font-bold mb-6"
            style={{ 
              color: 'rgba(255, 255, 255, 0.98)',
              textShadow: '0 0 40px rgba(168, 85, 247, 0.8), 0 0 80px rgba(168, 85, 247, 0.4), 0 0 120px rgba(168, 85, 247, 0.2)'
            }}
          >
            A Legacy of Hope
          </h1>
          <p 
            className="text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            style={{ textShadow: '0 0 25px rgba(168, 85, 247, 0.6)' }}
          >
            From one story emerged a global movement. This is just the beginning.
          </p>
        </div>

        {/* Legacy Timeline */}
        <div className="w-full max-w-6xl">
          <h2 
            className="text-4xl font-bold text-center mb-12"
            style={{ 
              color: 'rgba(255, 255, 255, 0.95)',
              textShadow: '0 0 30px rgba(59, 130, 246, 0.7)'
            }}
          >
            The Journey Forward
          </h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full"
              style={{
                background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.6), rgba(168, 85, 247, 0.6), rgba(34, 197, 94, 0.6))'
              }}
            />
            
            <div className="space-y-12">
              {legacyTimeline.map((item, index) => (
                <div
                  key={item.year}
                  data-index={index}
                  className={`timeline-item relative flex items-center gap-8 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div 
                    className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full z-10 transition-all duration-500"
                    style={{
                      background: activeTimeline >= index 
                        ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                        : 'rgba(255, 255, 255, 0.3)',
                      boxShadow: activeTimeline >= index 
                        ? '0 0 20px rgba(139, 92, 246, 0.8)' 
                        : '0 0 10px rgba(255, 255, 255, 0.2)',
                      scale: activeTimeline === index ? '1.3' : '1'
                    }}
                  />

                  {/* Content Card */}
                  <div 
                    className={`flex-1 p-8 rounded-2xl backdrop-blur-md transition-all duration-500 ${
                      activeTimeline === index ? 'scale-105' : 'scale-100'
                    }`}
                    style={{
                      background: activeTimeline === index 
                        ? 'rgba(255, 255, 255, 0.15)' 
                        : 'rgba(255, 255, 255, 0.08)',
                      border: `2px solid ${activeTimeline === index ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                      opacity: activeTimeline >= index ? 1 : 0.6
                    }}
                  >
                    <div className="flex items-start gap-6">
                      <div className="text-center">
                        <Calendar size={32} className={`mb-2 ${item.color}`} />
                        <div 
                          className="text-2xl font-bold px-4 py-2 rounded-full"
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: item.color
                          }}
                        >
                          {item.year}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`text-3xl font-bold mb-3 ${item.color}`}>
                          {item.title}
                        </h3>
                        <p className="text-white/90 text-lg leading-relaxed mb-4">
                          {item.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-3">
                          {item.achievements.map((achievement, achievementIndex) => (
                            <span
                              key={achievementIndex}
                              className="px-3 py-1 rounded-full text-sm"
                              style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'rgba(255, 255, 255, 0.9)'
                              }}
                            >
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Future Vision */}
        {showFuture && (
          <div className="w-full max-w-6xl text-center mt-16">
            <h2 
              className="text-4xl font-bold mb-12"
              style={{ 
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '0 0 30px rgba(34, 197, 94, 0.7)'
              }}
            >
              Our Shared Future
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {futureVision.map((vision, index) => (
                <div
                  key={vision.title}
                  className="future-item p-8 rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <vision.icon 
                    size={48} 
                    className={`mx-auto mb-4 ${vision.color}`}
                  />
                  <h3 className={`text-2xl font-bold mb-3 ${vision.color}`}>
                    {vision.title}
                  </h3>
                  <p className="text-white/80 text-lg leading-relaxed mb-4">
                    {vision.description}
                  </p>
                  <div 
                    className="text-xl font-bold px-4 py-2 rounded-full"
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: vision.color
                    }}
                  >
                    {vision.metrics}
                  </div>
                </div>
              ))}
            </div>

            {/* Final Call to Action */}
            <div className="mt-16 p-8 rounded-2xl backdrop-blur-md max-w-4xl mx-auto">
              <h3 
                className="text-3xl font-bold mb-4"
                style={{ color: 'rgba(255, 255, 255, 0.95)' }}
              >
                The Story Continues With You
              </h3>
              <p className="text-white/80 text-xl mb-8 leading-relaxed">
                Every action, no matter how small, contributes to this legacy. 
                Together, we're writing the next chapter of ocean conservation.
              </p>
              
              <button
                className="group flex items-center gap-4 mx-auto px-10 py-5 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(34, 197, 94, 0.4))',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: '#ffffff'
                }}
              >
                <span className="text-xl font-semibold">Become Part of the Legacy</span>
                <ArrowUp 
                  size={24} 
                  className="transition-transform duration-300 group-hover:-translate-y-1" 
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Celebration Elements */}
      <Sparkles 
        className="celebration-element absolute top-20 left-20 z-25"
        size={32} 
        color="rgba(168, 85, 247, 0.8)" 
      />
      <Star 
        className="celebration-element absolute top-32 right-24 z-25"
        size={28} 
        color="rgba(34, 197, 94, 0.8)" 
        fill="currentColor"
      />
      <Award 
        className="celebration-element absolute bottom-28 left-24 z-25"
        size={36} 
        color="rgba(59, 130, 246, 0.8)" 
      />

      {/* Scene Indicator */}
      <div 
        className="absolute bottom-10 right-10 text-xl z-40 px-8 py-4 rounded-full backdrop-blur-md"
        style={{ 
          background: 'rgba(55, 48, 163, 0.9)',
          border: '2px solid rgba(168, 85, 247, 0.5)',
          color: '#e9d5ff',
          fontWeight: '600'
        }}
      >
        Scene 11: Eternal Legacy
      </div>

      {/* Legacy Counter */}
      <div 
        className="absolute top-10 left-10 z-35 px-6 py-4 rounded-2xl backdrop-blur-md text-center"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          border: '2px solid rgba(255, 255, 255, 0.25)',
          color: '#ffffff'
        }}
      >
        <div className="text-2xl font-bold text-green-400">∞</div>
        <div className="text-white/80 text-sm">Perpetual Impact</div>
      </div>

      {/* Hope Message */}
      <div 
        className="absolute top-10 right-10 z-35 px-6 py-4 rounded-2xl backdrop-blur-md text-center max-w-sm"
        style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '2px solid rgba(34, 197, 94, 0.3)',
          color: '#bbf7d0'
        }}
      >
        <Heart size={24} className="mx-auto mb-2" />
        <div className="text-lg font-semibold">Hope Lives On</div>
        <div className="text-sm mt-1">Their legacy inspires millions</div>
      </div>
    </section>
  )
}