'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Move GSAP registration outside component to avoid hydration issues
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface SceneProps {
  sceneRef: (el: HTMLDivElement | null) => void
}

export default function Scene2({ sceneRef }: SceneProps) {
  const [visibleSections, setVisibleSections] = useState<number[]>([])
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const titleRef = useRef<HTMLImageElement>(null)

  // Set client-side flag to avoid hydration mismatches
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sectionRefs.current.forEach((section, index) => {
      if (!section) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSections(prev => [...new Set([...prev, index])])
            }
          })
        },
        { threshold: 0.1 }
      )

      observer.observe(section)
      observers.push(observer)
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || !isClient) return

    const ctx = gsap.context(() => {
      // Chapter title animation
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          opacity: 0,
          y: -50,
          scale: 0.8,
          duration: 1.2,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse"
          }
        })
      }

      // Fast image animations - slide in from alternating sides
      imageRefs.current.forEach((image, index) => {
        if (!image) return
        
        const direction = index % 2 === 0 ? -100 : 100
        
        gsap.from(image, {
          x: direction,
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: image,
            start: "top 90%",
            end: "top 50%",
            toggleActions: "play none none reverse"
          }
        })
      })

      // Text animations
      gsap.utils.toArray<HTMLElement>('.text-reveal').forEach((text) => {
        gsap.from(text, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: text,
            start: "top 85%",
            end: "top 60%",
            toggleActions: "play none none reverse"
          }
        })
      })

      // Scale animations for containers
      gsap.utils.toArray<HTMLElement>('.scale-in').forEach((el) => {
        gsap.from(el, {
          scale: 0.95,
          opacity: 0,
          duration: 0.7,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse"
          }
        })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [isClient]) // Add isClient dependency

  const sections = [
    {
      title: "PRISTINE PARADISE",
      subtitle: "Before the fall",
      image: "/3 Coral_Reef_Paradise_Anime.png",
      description: "Crystal clear waters teeming with vibrant marine life, untouched coral reefs glowing with natural beauty.",
      color: "emerald"
    },
    {
      title: "FRIENDS AT SEA",
      subtitle: "United by purpose",
      image: "/2 Deck_Friends_Ocean_Anime.png",
      description: "The research team bonds on deck, sharing dreams of preserving this underwater paradise for future generations.",
      color: "blue"
    },
    {
      title: "SCIENTIFIC WONDER",
      subtitle: "Discovery awaits",
      image: "/4 Ocean_Research_Team_Anime.png",
      description: "Cutting-edge technology meets human passion as the team documents the ocean's incredible biodiversity.",
      color: "purple"
    },
    {
      title: "BIOLUMINESCENT MAGIC",
      subtitle: "Nature's light show",
      image: "/5 Bioluminescent_Coral_Reef_Anime.png",
      description: "As night falls, the reef transforms into an ethereal wonderland of glowing corals and luminescent creatures.",
      color: "cyan"
    },
    {
      title: "JOYFUL ENCOUNTER",
      subtitle: "Life celebrates",
      image: "/6 Dolphins_Friends_Joyful_Leap.png",
      description: "Dolphins leap alongside the research vessel, a reminder of the joy and vitality worth protecting.",
      color: "teal"
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { text: string; border: string; glow: string; bg: string }> = {
      emerald: { 
        text: 'text-emerald-300', 
        border: 'border-emerald-400', 
        glow: 'shadow-emerald-400',
        bg: 'bg-emerald-900/40'
      },
      blue: { 
        text: 'text-blue-300', 
        border: 'border-blue-400', 
        glow: 'shadow-blue-400',
        bg: 'bg-blue-900/40'
      },
      purple: { 
        text: 'text-purple-300', 
        border: 'border-purple-400', 
        glow: 'shadow-purple-400',
        bg: 'bg-purple-900/40'
      },
      cyan: { 
        text: 'text-cyan-300', 
        border: 'border-cyan-400', 
        glow: 'shadow-cyan-400',
        bg: 'bg-cyan-900/40'
      },
      teal: { 
        text: 'text-teal-300', 
        border: 'border-teal-400', 
        glow: 'shadow-teal-400',
        bg: 'bg-teal-900/40'
      }
    }
    return colors[color] || colors.blue
  }

  return (
    <section
       ref={(el) => {
        sceneRef(el as HTMLDivElement | null)
        containerRef.current = el as HTMLDivElement | null
      }}
      className="relative bg-gradient-to-b from-blue-950 via-teal-900 to-emerald-950"
    >
      {/* Fixed Background Layers */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(/044-bodies/bg4.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Black Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/044-bodies/black-gradient.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.4
          }}
        />

        {/* Heavy Rain Layers */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(/rain/rain-light-pot.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat-y',
            height: '200%'
          }}
        />
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'url(/rain/rain-light-pot.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat-y',
            height: '200%'
          }}
        />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/rain/rain-light-pot.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat-y',
            height: '200%'
          }}
        />

        {/* Floating Bubbles - Only render on client */}
        {isClient && (
          <>
            <div className="absolute top-1/4 left-8 w-16 h-16 rounded-full border-2 border-emerald-400/30 opacity-60" />
            <div className="absolute top-1/3 right-8 w-16 h-16 rounded-full border-2 border-teal-400/40 opacity-60" />
            <div className="absolute bottom-1/3 left-1/4 w-12 h-12 rounded-full border border-cyan-400/50 opacity-50" />

            {/* Atmospheric Particles */}
            {[...Array(20)].map((_, i) => (
              <div
                key={`particle-${i}`}
                className="absolute rounded-full bg-cyan-400/20"
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}

            {/* Glow Effects */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-400 rounded-full opacity-15 filter blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-teal-400 rounded-full opacity-15 filter blur-3xl" />
            
            {/* Additional Small Bubbles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`small-bubble-${i}`}
                className="absolute rounded-full border border-cyan-300/20"
                style={{
                  width: `${Math.random() * 6 + 3}px`,
                  height: `${Math.random() * 6 + 3}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Scrolling Content */}
      <div className="relative z-20">
        {/* Chapter Title */}
        <div className="relative h-40 flex items-center justify-center">
          <img
            ref={titleRef}
            src="/chapter-headings/chapter-2.png"
            alt="Chapter 2"
            className="w-1/3 max-w-md"
            style={{ filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.9))' }}
          />
        </div>

        {/* Intro Section */}
        <div 
           ref={(el) => {
        sceneRef(el as HTMLDivElement | null)
        containerRef.current = el as HTMLDivElement | null
      }}
          className="min-h-screen flex items-center justify-center px-8 py-20"
        >
          <div className="max-w-4xl text-center">
            <h1 className="text-7xl md:text-8xl font-bold text-emerald-300 mb-8 drop-shadow-2xl text-reveal">
              DISCOVERY
            </h1>
            <p className="text-3xl text-white italic leading-relaxed mb-12 text-reveal">
              A world of wonder beneath the waves
            </p>
            <div className="bg-black/80 backdrop-blur-lg border-2 border-emerald-400 rounded-3xl p-12 max-w-3xl mx-auto scale-in">
              <p className="text-xl text-white/90 leading-relaxed text-reveal">
                Before humanity's carelessness would bring destruction, there was paradise. 
                A team of passionate researchers embarked on a mission to document and protect 
                the ocean's most precious treasures.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        {sections.map((section, index) => {
          const colorClasses = getColorClasses(section.color)

          return (
            <div
              key={section.title}
               ref={(el) => {
        sceneRef(el as HTMLDivElement | null)
        containerRef.current = el as HTMLDivElement | null
      }}
              className="min-h-[80vh] flex items-center justify-center px-4 md:px-8 py-12 md:py-16"
              data-aos="fade-up"
            >
              <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
                {/* Image column */}
                <div className={`${index % 2 === 1 ? 'md:order-2' : 'md:order-1'} flex justify-center md:justify-start`}>
                  <div className="relative group self-start w-full">
                    <img
                       ref={(el) => {
        sceneRef(el as HTMLDivElement | null)
        containerRef.current = el as HTMLDivElement | null
      }}
                      src={section.image}
                      alt={section.title}
                      className={`w-full max-w-md md:max-w-xl lg:max-w-2xl rounded-2xl shadow-2xl ${colorClasses.border} border-2 transition-all duration-300 group-hover:scale-[1.03]`}
                      style={{ 
                        filter: `drop-shadow(0 15px 40px rgba(16, 185, 129, 0.35))` 
                      }}
                    />
                    <div className="absolute inset-0 border-4 border-white/10 rounded-2xl pointer-events-none" />
                    <div className="absolute inset-2 border-2 border-white/5 rounded-xl pointer-events-none" />
                  </div>
                </div>

                {/* Text column */}
                <div className={`${index % 2 === 1 ? 'md:order-1 md:text-right' : 'md:order-2'} flex flex-col justify-end self-end`}>
                  <div className="text-center md:text-inherit mb-4 md:mb-6 text-reveal" data-aos="fade-up">
                    <h2 className={`text-4xl md:text-5xl font-bold ${colorClasses.text} mb-3 md:mb-4`}>
                      {section.title}
                    </h2>
                    <p className="text-xl md:text-2xl text-white/90 italic">
                      {section.subtitle}
                    </p>
                  </div>
                  <div className={`bg-black/70 backdrop-blur-md ${colorClasses.border} border-2 rounded-2xl p-5 md:p-6 max-w-2xl ${index % 2 === 1 ? 'ml-auto' : ''} scale-in`} data-aos="fade-up" data-aos-delay="100">
                    <p className="text-base md:text-xl text-white leading-relaxed text-center md:text-left text-reveal">
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Scene Indicator */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50 bg-gradient-to-r from-emerald-900/90 to-teal-800/90 px-3 py-2 md:px-6 md:py-3 rounded-xl backdrop-blur-lg border-2 border-emerald-400/60">
        <div className="text-emerald-300 text-sm md:text-xl font-bold">SCENE 2</div>
        <div className="text-emerald-200 text-xs md:text-sm">DISCOVERY</div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 md:translate-x-0 md:top-8 md:left-8 z-50 bg-black/80 backdrop-blur-md px-3 py-2 md:px-4 md:py-3 rounded-xl border-2 border-emerald-500/50">
        <div className="text-emerald-300 text-xs md:text-sm font-bold mb-1 md:mb-2 text-center md:text-left">EXPLORATION PROGRESS</div>
        <div className="flex gap-1.5 md:gap-2 justify-center md:justify-start">
          {['Reefs', 'Team', 'Research', 'Night', 'Life'].map((phase, i) => (
            <div 
              key={phase}
              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
                visibleSections.length > i + 1 ? 'bg-emerald-400 scale-125' : 'bg-gray-600'
              }`}
              title={phase}
            />
          ))}
        </div>
      </div>

      {/* Add CSS animations only on client side */}
      {isClient && (
        <style jsx>{`
          @keyframes rain-fall-1 {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(0); }
          }

          @keyframes rain-fall-2 {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(0); }
          }

          @keyframes rain-fall-3 {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(0); }
          }

          @keyframes bubble-float {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
            25% { transform: translateY(-15px) translateX(8px) scale(1.1); opacity: 0.8; }
            50% { transform: translateY(-25px) translateX(-4px) scale(1.05); opacity: 0.7; }
            75% { transform: translateY(-15px) translateX(4px) scale(1.08); opacity: 0.75; }
          }

          @keyframes bubble-float-small {
            0% { transform: translateY(100vh) translateX(0) scale(0.8); opacity: 0; }
            10% { opacity: 0.3; }
            90% { opacity: 0.15; }
            100% { transform: translateY(-80px) translateX(20px) scale(1.2); opacity: 0; }
          }

          @keyframes text-glow-emerald {
            0%, 100% { 
              text-shadow: 0 0 20px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.4); 
            }
            50% { 
              text-shadow: 0 0 30px rgba(16, 185, 129, 1), 0 0 60px rgba(16, 185, 129, 0.6); 
            }
          }

          @keyframes float-particle {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            20% { opacity: 0.4; }
            80% { opacity: 0.2; }
            100% { transform: translateY(-100px) translateX(25px); opacity: 0; }
          }

          @keyframes glow-pulse {
            0%, 100% { opacity: 0.1; transform: scale(1); }
            50% { opacity: 0.2; transform: scale(1.1); }
          }

          .animate-rain-fall-1 { animation: rain-fall-1 2s linear infinite; }
          .animate-rain-fall-2 { animation: rain-fall-2 2.5s linear infinite; }
          .animate-rain-fall-3 { animation: rain-fall-3 1.8s linear infinite; }
          .animate-bubble-float { animation: bubble-float 6s ease-in-out infinite; }
          .animate-bubble-float-small { animation: bubble-float-small linear infinite; }
          .animate-text-glow-emerald { animation: text-glow-emerald 3s ease-in-out infinite; }
          .animate-float-particle { animation: float-particle linear infinite; }
          .animate-glow-pulse { animation: glow-pulse 4s ease-in-out infinite; }
        `}</style>
      )}
    </section>
  )
}