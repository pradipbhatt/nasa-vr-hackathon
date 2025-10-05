// src/app/story/[slug]/sections/Scene10.tsx - Awareness & Call to Action
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Heart, Shield, Users, Globe, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react'

interface SceneProps {
  sceneRef: (el: HTMLDivElement | null) => void
}

export default function Scene10({ sceneRef }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeMessage, setActiveMessage] = useState(0)
  const [showActions, setShowActions] = useState(false)

  const awarenessMessages = [
    {
      icon: AlertTriangle,
      title: "Plastic Pollution Crisis",
      message: "Over 8 million tons of plastic enter our oceans each year, threatening marine life and ecosystems.",
      stat: "8M+ tons yearly",
      color: "text-red-400",
      bgColor: "rgba(239, 68, 68, 0.1)"
    },
    {
      icon: Heart,
      title: "Coral Bleaching",
      message: "Rising ocean temperatures have caused 50% of the world's coral reefs to die in the last 30 years.",
      stat: "50% lost",
      color: "text-pink-400",
      bgColor: "rgba(236, 72, 153, 0.1)"
    },
    {
      icon: Users,
      title: "Marine Life Impact",
      message: "Over 1 million seabirds and 100,000 marine mammals die annually from plastic pollution.",
      stat: "1M+ animals",
      color: "text-blue-400",
      bgColor: "rgba(59, 130, 246, 0.1)"
    },
    {
      icon: Globe,
      title: "Ocean Acidification",
      message: "CO2 absorption has increased ocean acidity by 30% since the industrial revolution.",
      stat: "30% increase",
      color: "text-green-400",
      bgColor: "rgba(34, 197, 94, 0.1)"
    }
  ]

  const actionSteps = [
    {
      icon: CheckCircle,
      title: "Reduce Plastic Use",
      actions: ["Use reusable bags", "Avoid single-use plastics", "Choose products with less packaging"],
      color: "text-green-400"
    },
    {
      icon: Shield,
      title: "Support Conservation",
      actions: ["Donate to ocean charities", "Volunteer for beach cleanups", "Support sustainable seafood"],
      color: "text-blue-400"
    },
    {
      icon: Users,
      title: "Spread Awareness",
      actions: ["Share on social media", "Educate friends and family", "Join local environmental groups"],
      color: "text-purple-400"
    },
    {
      icon: Globe,
      title: "Make Sustainable Choices",
      actions: ["Reduce carbon footprint", "Choose eco-friendly products", "Support green businesses"],
      color: "text-cyan-400"
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
          onEnter: () => setShowActions(true)
        }
      })

      // Background flowers gentle entrance
      timeline.fromTo('.awareness-flower-1',
        { x: -200, opacity: 0, rotation: -15 },
        { x: 0, opacity: 0.4, rotation: 0, duration: 2.5, ease: "power2.out" }
      )

      timeline.fromTo('.awareness-flower-2',
        { x: 200, opacity: 0, rotation: 15 },
        { x: 0, opacity: 0.35, rotation: 0, duration: 2.5, ease: "power2.out" },
        "-=2.5"
      )

      // Main title entrance
      timeline.fromTo('.awareness-title',
        { y: -50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 2, ease: "back.out(1.7)" },
        "-=2"
      )

      // Messages sequential reveal
      timeline.fromTo('.awareness-message',
        { x: -100, opacity: 0, scale: 0.8 },
        { 
          x: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 1.5, 
          stagger: 1.5,
          ease: "power2.out",
          onStart: function() {
            const index = this.targets()[0].dataset.index
            if (index !== undefined) {
              setActiveMessage(parseInt(index))
            }
          }
        },
        "-=1.5"
      )

      // Action steps reveal
      timeline.fromTo('.action-step',
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          stagger: 0.3,
          ease: "back.out(1.5)" 
        },
        "-=1"
      )

      // Floating elements
      gsap.to('.floating-element', {
        y: -20,
        rotation: 3,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5
      })

      // Gentle background pulse
      gsap.to('.bg-pulse', {
        opacity: 0.3,
        duration: 3,
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
        background: 'linear-gradient(180deg, #020204 0%, #1e3a8a 30%, #065f46 70%, #020204 100%)'
      }}
    >
      {/* Background Flowers */}
      <img
        src="/013-021/song-pt2-left-flower-01.png"
        alt="Awareness Flower Left"
        className="awareness-flower-1 absolute left-0 top-0 h-3/4 object-contain opacity-0 z-5"
      />
      <img
        src="/013-021/song-pt2-right-flower-01.png"
        alt="Awareness Flower Right"
        className="awareness-flower-2 absolute right-0 top-0 h-3/4 object-contain opacity-0 z-5"
      />

      {/* Additional Floral Elements */}
      <img
        src="/013-021/song-pt3-flower-03.png"
        alt="Floral Accent 1"
        className="floating-element absolute top-20 left-20 h-32 object-contain opacity-40 z-5"
      />
      <img
        src="/013-021/song-pt3-flower-04.png"
        alt="Floral Accent 2"
        className="floating-element absolute bottom-20 right-20 h-28 object-contain opacity-35 z-5"
      />

      {/* Pulse Background */}
      <div 
        className="bg-pulse absolute inset-0 z-2"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Atmospheric Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{ 
          background: 'radial-gradient(circle at center, transparent 40%, rgba(30, 58, 138, 0.6) 80%)',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-20 w-full max-w-7xl flex flex-col items-center justify-center gap-12 px-8 py-12">
        
        {/* Main Title */}
        <div className="awareness-title text-center opacity-0">
          <h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ 
              color: 'rgba(255, 255, 255, 0.95)',
              textShadow: '0 0 30px rgba(59, 130, 246, 0.7), 0 0 60px rgba(59, 130, 246, 0.4)'
            }}
          >
            The Ocean Needs You
          </h1>
          <p 
            className="text-xl text-white/80 max-w-2xl mx-auto"
            style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
          >
            Our story shows what's at stake. Now it's time to act.
          </p>
        </div>

        {/* Awareness Messages Carousel */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {awarenessMessages.map((message, index) => (
            <div
              key={message.title}
              data-index={index}
              className={`awareness-message p-8 rounded-2xl backdrop-blur-md transition-all duration-500 cursor-pointer ${
                activeMessage === index ? 'scale-105' : 'scale-100'
              }`}
              style={{
                background: activeMessage === index ? message.bgColor : 'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${activeMessage === index ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                opacity: activeMessage === index ? 1 : 0.7
              }}
              onMouseEnter={() => setActiveMessage(index)}
            >
              <div className="flex items-start gap-4">
                <message.icon 
                  size={32} 
                  className={`mt-1 ${message.color}`}
                />
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-3 ${message.color}`}>
                    {message.title}
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed mb-4">
                    {message.message}
                  </p>
                  <div 
                    className="text-xl font-semibold px-4 py-2 rounded-full inline-block"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: message.color
                    }}
                  >
                    {message.stat}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        {showActions && (
          <div className="w-full max-w-6xl text-center">
            <h2 
              className="text-4xl font-bold mb-12"
              style={{ 
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '0 0 25px rgba(34, 197, 94, 0.7)'
              }}
            >
              Your Action Matters
            </h2>

            {/* Action Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {actionSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="action-step p-6 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <step.icon 
                    size={40} 
                    className={`mx-auto mb-4 ${step.color}`}
                  />
                  <h3 className={`text-xl font-bold mb-4 ${step.color}`}>
                    {step.title}
                  </h3>
                  <ul className="space-y-2 text-left">
                    {step.actions.map((action, actionIndex) => (
                      <li 
                        key={actionIndex}
                        className="flex items-center gap-2 text-white/80 text-sm"
                      >
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Main Call to Action Button */}
            <button
              className="group flex items-center gap-4 mx-auto px-8 py-4 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 hover:gap-6"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(59, 130, 246, 0.3))',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff'
              }}
            >
              <span className="text-xl font-semibold">Join the Movement Today</span>
              <ArrowRight 
                size={24} 
                className="transition-transform duration-300 group-hover:translate-x-1" 
              />
            </button>

            {/* Additional Resources */}
            <div className="mt-8 text-white/70 text-sm">
              Every small action contributes to a larger change. Start today.
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex items-center gap-6 mt-8">
          <div className="text-white/80 text-lg">
            Issue {activeMessage + 1} of {awarenessMessages.length}
          </div>
          <div className="flex gap-2">
            {awarenessMessages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeMessage === index 
                    ? 'bg-blue-400 scale-125' 
                    : activeMessage > index 
                    ? 'bg-green-400' 
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Awareness Icons */}
      <Heart 
        className="floating-element absolute top-1/4 left-1/5 z-25 opacity-60"
        size={32} 
        color="rgba(236, 72, 153, 0.7)" 
      />
      <Shield 
        className="floating-element absolute top-1/3 right-1/5 z-25 opacity-60"
        size={28} 
        color="rgba(59, 130, 246, 0.7)" 
      />
      <Globe 
        className="floating-element absolute bottom-1/3 left-1/4 z-25 opacity-60"
        size={36} 
        color="rgba(34, 197, 94, 0.7)" 
      />

      {/* Scene Indicator */}
      <div 
        className="absolute bottom-10 right-10 text-lg z-40 px-6 py-3 rounded-full backdrop-blur-md"
        style={{ 
          background: 'rgba(30, 58, 138, 0.9)',
          border: '2px solid rgba(59, 130, 246, 0.5)',
          color: '#e0f2fe'
        }}
      >
        Scene 10: Time for Action
      </div>

      {/* Impact Counter */}
      <div 
        className="absolute top-10 left-10 z-35 px-6 py-4 rounded-2xl backdrop-blur-md text-center"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          color: '#ffffff'
        }}
      >
        <div className="text-2xl font-bold text-green-400">2,847</div>
        <div className="text-white/70 text-sm">Actions Taken Today</div>
      </div>

      {/* Urgency Message */}
      <div 
        className="absolute top-10 right-10 z-35 px-6 py-3 rounded-xl backdrop-blur-md text-center max-w-xs"
        style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fecaca'
        }}
      >
        <AlertTriangle size={20} className="mx-auto mb-2" />
        <div className="text-sm font-medium">Immediate Action Required</div>
      </div>
    </section>
  )
}