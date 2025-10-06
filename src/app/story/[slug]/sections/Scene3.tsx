'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface SceneProps {
  sceneRef: (el: HTMLDivElement | null) => void
}

interface Particle {
  width: number
  height: number
  left: number
  top: number
  delay: number
  duration: number
}

export default function Scene3({ sceneRef }: SceneProps) {
  const [visibleSections, setVisibleSections] = useState<number[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [smallParticles, setSmallParticles] = useState<Particle[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const titleRef = useRef<HTMLImageElement>(null)

  // Generate particles only on client after mount to avoid hydration mismatch
  useEffect(() => {
    const generateParticles = (count: number): Particle[] =>
      Array.from({ length: count }, () => ({
        width: Math.random() * 5 + 2,
        height: Math.random() * 5 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 6 + Math.random() * 4,
      }))

    const generateSmallParticles = (count: number): Particle[] =>
      Array.from({ length: count }, () => ({
        width: Math.random() * 6 + 3,
        height: Math.random() * 6 + 3,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 6,
      }))

    setParticles(generateParticles(25))
    setSmallParticles(generateSmallParticles(12))
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
    if (!containerRef.current) return

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

      // Fast image animations - slide in from alternating sides with impact
      imageRefs.current.forEach((image, index) => {
        if (!image) return
        
        const direction = index % 2 === 0 ? -150 : 150
        
        gsap.from(image, {
          x: direction,
          opacity: 0,
          scale: 0.8,
          duration: 0.7,
          ease: "power3.out",
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
          y: 40,
          opacity: 0,
          duration: 0.5,
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
          scale: 0.9,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse"
          }
        })
      })

      // Parallax effects
      gsap.utils.toArray<HTMLElement>('.parallax-image').forEach((img) => {
        gsap.to(img, {
          yPercent: -25,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const sections = [
    {
      id: 'intro',
      title: "PARADISE LOST",
      subtitle: "When carelessness meets consequence",
      description: "What begins as innocent celebration becomes an ocean's nightmare. The team's journey takes a dark turn as human impact reveals its devastating toll.",
      image: null,
      color: "red",
      stats: [
        { label: "Pollution Level", value: "CRITICAL", color: "red" },
        { label: "Marine Life", value: "-60%", color: "orange" },
        { label: "Coral Health", value: "DYING", color: "gray" }
      ]
    },
    {
      id: 'carefree',
      title: "CAREFREE BEGINNINGS",
      subtitle: "Oblivious to the damage below",
      description: "Dining on deck, they laugh and feast, never noticing the waste trailing behind their vessel into pristine waters. The joy above masks the destruction below.",
      image: "/10 Carefree_Deck_Dining_Pollution.png",
      color: "yellow"
    },
    {
      id: 'party',
      title: "ISLAND CELEBRATION",
      subtitle: "Plastic paradise",
      description: "The beach party rages on, plastic cups and bottles scattered like confetti across the sand. Every moment of human pleasure leaves a lasting scar.",
      image: "/11Island_Party_Plastic_Pollution_Anime.png",
      color: "orange"
    },
    {
      id: 'underwater',
      title: "BENEATH THE SURFACE",
      subtitle: "The ocean's silent scream",
      description: "Below the surface, coral reefs choke on plastic debris. Marine life struggles through murky destruction as the underwater world transforms into a graveyard.",
      image: "/12 Underwater_Pollution_Coral_Anime.png",
      color: "blue"
    },
    {
      id: 'contrast',
      title: "TWO WORLDS COLLIDE",
      subtitle: "Joy and devastation",
      description: "Smiling faces above, dying ocean below—the cruel contrast of human pleasure and environmental devastation becomes impossible to ignore.",
      image: "/15 Joy_Ocean_Plastic_Contrast.png",
      color: "cyan"
    },
    {
      id: 'storm',
      title: "NATURE'S FURY",
      subtitle: "The ocean strikes back",
      description: "A massive storm brews over polluted waters, as if the ocean itself rages against the destruction. Nature's revenge begins.",
      image: "/27 Polluted_Ocean_Storm_Anime.png",
      color: "gray"
    },
    {
      id: 'bleach',
      title: "CORAL DEATH",
      subtitle: "Witnessing the horror",
      description: "Mahir and Ishita stare in horror at bleached coral. Once vibrant reefs now appear as ghostly white skeletons—a monument to human carelessness.",
      image: "/28 Coral_Bleach_Horror_Mahir_Ishita.png",
      color: "white"
    },
    {
      id: 'climate',
      title: "GLOBAL IMPACT",
      subtitle: "The bigger picture",
      description: "Climate change accelerates, revealing the interconnected nature of ocean health and planetary survival. The crisis extends beyond what they imagined.",
      image: "/32 Climate_Change_Global_Montage.png",
      color: "red"
    },
    {
      id: 'terror',
      title: "TANYA'S TERROR",
      subtitle: "Facing the truth",
      description: "Terror grips Tanya as the full weight of the crisis becomes clear. The storm intensifies, matching the horror of what they've discovered.",
      image: "/33 Tanya_Storm_Terror.png",
      color: "purple"
    },
    {
      id: 'collapse',
      title: "ECOSYSTEM COLLAPSE",
      subtitle: "Point of no return",
      description: "The underwater ecosystem collapses before their eyes. What took millennia to build crumbles in mere moments of human impact.",
      image: "/33 Underwater_Ecocollapse_Anime_Tragedy.png",
      color: "red"
    },
    {
      id: 'ruins',
      title: "COASTAL DEVASTATION",
      subtitle: "Communities flee",
      description: "Coastal communities abandon their homes as pollution and climate impacts make their land uninhabitable. Refugees flee from what was once paradise.",
      image: "/34 Coastal_Ruins_Refugee_Flight.png",
      color: "gray"
    },
    {
      id: 'tragedy',
      title: "SHIP IN PERIL",
      subtitle: "The storm claims its victims",
      description: "The ship battles against nature's fury. Friends cling to hope as waves crash over the deck. The ocean demands payment for humanity's crimes.",
      image: "/35 Storm_Ship_Friends_Tragedy.png",
      color: "red"
    },
    {
      id: 'underwater-drag',
      title: "PULLED UNDER",
      subtitle: "Desperate struggle",
      description: "Terror underwater as Sangam and Tanya are dragged beneath the waves. The ocean that once inspired wonder now threatens to consume them.",
      image: "/36 Terror_Underwater_Drag_Sangam_Tanya.png",
      color: "blue"
    },
    {
      id: 'desperation',
      title: "FINAL MOMENTS",
      subtitle: "Mahir and Tanya's desperation",
      description: "Underwater desperation as Mahir and Tanya fight for survival. Each breath might be their last in the polluted waters they once studied.",
      image: "/37 Underwater_Desperation_Mahir_Tanya.png",
      color: "cyan"
    },
    {
      id: 'grief',
      title: "OIL SPILL GRIEF",
      subtitle: "The weight of loss",
      description: "Grief overwhelms as an oil spill spreads across the water. The team realizes the full extent of what's been lost—both life and hope.",
      image: "/38 Oil_Spill_Grief_Anime.png",
      color: "black"
    },
    {
      id: 'warning',
      title: "TANYA'S LAST WARNING",
      subtitle: "A final message",
      description: "Underwater, Tanya delivers her last warning: 'We have to save this ocean... don't let it die...' Her words echo through the murky depths.",
      image: "/39 Tanya_s_Last_Warning_Underwater.png",
      color: "blue"
    },
    {
      id: 'lament',
      title: "SEABED LAMENT",
      subtitle: "The ocean mourns",
      description: "On the seabed, a lament for what was lost. The ocean floor tells the story of destruction that will take centuries to heal—if it ever can.",
      image: "/40 Seabed_Lament.png",
      color: "purple"
    },
    {
      id: 'anguish',
      title: "POLLUTED ANGUISH",
      subtitle: "Drowning in despair",
      description: "Despair in polluted water as anguish consumes those who remain. The water that gives life now deals only death and suffering.",
      image: "/41 Despair_Polluted_Water_Anguish.png",
      color: "gray"
    },
    {
      id: 'graveyard',
      title: "CORAL GRAVEYARD",
      subtitle: "Sunken innocence",
      description: "A coral graveyard marks the end of innocence. Where life once flourished, only skeletal remains testify to what humanity destroyed.",
      image: "/42 Sunken_Innocence_Coral_Graveyard.png",
      color: "white"
    },
    {
      id: 'realization',
      title: "SANGAM'S REALIZATION",
      subtitle: "The weight of survival",
      description: "Sangam's ocean realization: survival comes with an unbearable burden. He alone remains to carry the message of what was lost.",
      image: "/43 Sangam_Ocean_Realization.png",
      color: "blue"
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { text: string; border: string; glow: string; bg: string }> = {
      red: { 
        text: 'text-red-300', 
        border: 'border-red-500', 
        glow: 'shadow-red-500/50',
        bg: 'bg-red-900/40'
      },
      orange: { 
        text: 'text-orange-300', 
        border: 'border-orange-500', 
        glow: 'shadow-orange-500/50',
        bg: 'bg-orange-900/40'
      },
      yellow: { 
        text: 'text-yellow-300', 
        border: 'border-yellow-500', 
        glow: 'shadow-yellow-500/50',
        bg: 'bg-yellow-900/40'
      },
      blue: { 
        text: 'text-blue-300', 
        border: 'border-blue-500', 
        glow: 'shadow-blue-500/50',
        bg: 'bg-blue-900/40'
      },
      cyan: { 
        text: 'text-cyan-300', 
        border: 'border-cyan-500', 
        glow: 'shadow-cyan-500/50',
        bg: 'bg-cyan-900/40'
      },
      gray: { 
        text: 'text-gray-300', 
        border: 'border-gray-500', 
        glow: 'shadow-gray-500/50',
        bg: 'bg-gray-900/40'
      },
      white: { 
        text: 'text-gray-100', 
        border: 'border-gray-400', 
        glow: 'shadow-gray-400/50',
        bg: 'bg-gray-800/40'
      },
      black: { 
        text: 'text-gray-200', 
        border: 'border-gray-600', 
        glow: 'shadow-gray-600/50',
        bg: 'bg-gray-900/60'
      },
      purple: { 
        text: 'text-purple-300', 
        border: 'border-purple-500', 
        glow: 'shadow-purple-500/50',
        bg: 'bg-purple-900/40'
      }
    }
    return colors[color] || colors.red
  }

  return (
    <section
       ref={(el) => {
        sceneRef(el as HTMLDivElement | null)
        containerRef.current = el as HTMLDivElement | null
      }}
      className="relative bg-gradient-to-b from-gray-900 via-red-950 to-black"
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
            opacity: 0.7
          }}
        />

        {/* Heavy Rain Layers */}
        <div 
          className="absolute inset-0 opacity-40 animate-rain-fall-1"
          style={{
            backgroundImage: 'url(/rain/rain-light-pot.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat-y',
            height: '200%'
          }}
        />
        <div 
          className="absolute inset-0 opacity-35 animate-rain-fall-2"
          style={{
            backgroundImage: 'url(/rain/rain-light-pot.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat-y',
            height: '200%'
          }}
        />
        <div 
          className="absolute inset-0 opacity-30 animate-rain-fall-3"
          style={{
            backgroundImage: 'url(/rain/rain-light-pot.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat-y',
            height: '200%'
          }}
        />

        {/* Floating Debris */}
        <div className="absolute top-1/4 left-8 w-16 h-16 rounded-lg bg-red-400/20 opacity-60 animate-bubble-float rotate-45" />
        <div className="absolute top-1/3 right-8 w-12 h-12 rounded-lg bg-orange-400/30 opacity-60 animate-bubble-float rotate-12" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-14 h-14 rounded-lg bg-gray-400/25 opacity-50 animate-bubble-float rotate-30" style={{ animationDelay: '2s' }} />

        {/* Atmospheric Particles - hydration-safe (generated on client) */}
        {particles.map((p, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full bg-red-400/30 animate-float-particle"
            style={{
              width: `${p.width}px`,
              height: `${p.height}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`
            }}
          />
        ))}

        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-400 rounded-full opacity-20 filter blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-orange-400 rounded-full opacity-15 filter blur-3xl animate-glow-pulse" />
        
        {/* Additional Small Particles - hydration-safe (generated on client) */}
        {smallParticles.map((sp, i) => (
          <div
            key={`small-particle-${i}`}
            className="absolute rounded-full border border-red-300/20 animate-bubble-float-small"
            style={{
              width: `${sp.width}px`,
              height: `${sp.height}px`,
              left: `${sp.left}%`,
              top: `${sp.top}%`,
              animationDelay: `${sp.delay}s`,
              animationDuration: `${sp.duration}s`
            }}
          />
        ))}
      </div>

      {/* Scrolling Content */}
      <div className="relative z-20">
        {/* Chapter Title */}

        {/* Scene Indicator */}
        <div className="absolute top-8 right-8 z-50 bg-gradient-to-r from-red-900/90 to-red-800/90 px-6 py-3 rounded-xl backdrop-blur-lg border-2 border-red-400/60">
          <div className="text-red-300 text-xl font-bold">SCENE 3</div>
          <div className="text-red-200 text-sm">PARADISE LOST</div>
        </div>

        <div className="relative h-28 md:h-40 flex items-center justify-center">
          <div className="relative w-1/3 max-w-md">
            <img
              ref={titleRef}
              src="/chapter-headings/chapter-3.png"
              alt="Chapter 3"
              className="w-full scale-in mix-blend-screen opacity-90"
              style={{ filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.9))' }}
            />
            <div className="absolute inset-0 bg-gray-200 mix-blend-color" />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 md:translate-x-0 md:top-8 md:left-8 z-50 bg-black/80 backdrop-blur-md px-3 py-2 md:px-4 md:py-3 rounded-xl border-2 border-red-500/50">
          <div className="text-red-300 text-xs md:text-sm font-bold mb-1 md:mb-2 text-center md:text-left">CRISIS PROGRESS</div>
          <div className="flex gap-1.5 md:gap-2 justify-center md:justify-start">
            {['Pollution', 'Storm', 'Collapse', 'Tragedy', 'Awakening'].map((phase, i) => (
              <div 
                key={phase}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
                  visibleSections.length > i * 4 ? 'bg-red-400 scale-125' : 'bg-gray-600'
                }`}
                title={phase}
              />
            ))}
          </div>
        </div>

        {/* Warning Badge */}
        <div className="absolute bottom-8 right-8 z-50 bg-red-600 px-6 py-4 rounded-xl border-2 border-red-300 animate-pulse scale-in">
          <div className="text-white text-2xl font-bold flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            CRITICAL
          </div>
          <div className="text-red-100 text-sm mt-1">Pollution Crisis</div>
        </div>

        {sections.map((section, index) => {
          const colorClasses = getColorClasses(section.color)

          return (
            <div
              key={section.id}
               ref={(el) => {
                sceneRef(el as HTMLDivElement | null)
                containerRef.current = el as HTMLDivElement | null
              }}
              className="min-h-[80vh] flex items-center justify-center px-4 md:px-8 py-12 md:py-16 relative"
            >
              <div className="max-w-6xl w-full">
                {/* Intro Section */}
                {section.id === 'intro' && (
                  <div className="text-center">
                    <h1 className={`text-6xl md:text-8xl font-bold ${colorClasses.text} mb-8 drop-shadow-2xl text-reveal`}>
                      {section.title}
                    </h1>
                    <p className="text-2xl md:text-3xl text-white italic leading-relaxed mb-12 text-reveal">
                      {section.subtitle}
                    </p>
                    <div className={`bg-black/80 backdrop-blur-lg border-2 ${colorClasses.border} rounded-3xl p-8 md:p-12 max-w-3xl mx-auto scale-in`}>
                      <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 text-reveal">
                        {section.description}
                      </p>
                      {section.stats && (
                        <div className="grid grid-cols-3 gap-4">
                          {section.stats.map((stat) => {
                            const statColor = getColorClasses(stat.color)
                            return (
                              <div key={stat.label} className={`${statColor.bg} px-4 py-3 rounded-xl border ${statColor.border} scale-in`}>
                                <div className={`${statColor.text} text-xs md:text-sm`}>{stat.label}</div>
                                <div className={`${statColor.text} text-xl md:text-2xl font-bold mt-1`}>{stat.value}</div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Image Sections */}
                {section.image && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
                    {/* Image column (top aligned) */}
                    <div className={`${index % 2 === 1 ? 'md:order-2' : 'md:order-1'} flex justify-center md:justify-start`}>
                      <div className="relative group self-start w-full">
                        <img
                          ref={(el) => {
                            sceneRef(el as HTMLDivElement | null)
                            containerRef.current = el as HTMLDivElement | null
                          }}
                          src={section.image}
                          alt={section.title}
                          className={`parallax-image w-full max-w-md md:max-w-xl lg:max-w-2xl rounded-2xl shadow-2xl ${colorClasses.border} border-2 transition-all duration-300 group-hover:scale-[1.03]`}
                          style={{ 
                            filter: `drop-shadow(0 15px 40px rgba(220, 38, 38, 0.45))`,
                            boxShadow: `0 0 30px ${colorClasses.glow}`
                          }}
                        />
                        <div className="absolute inset-0 border-4 border-white/10 rounded-2xl pointer-events-none" />
                        <div className="absolute inset-2 border-2 border-white/5 rounded-xl pointer-events-none" />
                      </div>
                    </div>

                    {/* Text column (bottom aligned) */}
                    <div className={`${index % 2 === 1 ? 'md:order-1 md:text-right' : 'md:order-2'} flex flex-col justify-end self-end`}>
                      <div className="text-center md:text-inherit mb-4 md:mb-6 text-reveal">
                        <h2 className={`text-4xl md:text-5xl font-bold ${colorClasses.text} mb-3 md:mb-4`}>
                          {section.title}
                        </h2>
                        <p className="text-xl md:text-2xl text-white/90 italic">
                          {section.subtitle}
                        </p>
                      </div>
                      <div className={`bg-black/70 backdrop-blur-md ${colorClasses.border} border-2 rounded-2xl p-5 md:p-6 max-w-2xl ${index % 2 === 1 ? 'ml-auto' : ''} scale-in`}>
                        <p className="text-base md:text-xl text-white leading-relaxed text-center md:text-left text-reveal">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

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
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          25% { transform: translateY(-20px) translateX(10px) rotate(10deg); opacity: 0.8; }
          50% { transform: translateY(-35px) translateX(-8px) rotate(-5deg); opacity: 0.7; }
          75% { transform: translateY(-20px) translateX(5px) rotate(5deg); opacity: 0.75; }
        }

        @keyframes bubble-float-small {
          0% { transform: translateY(100vh) translateX(0) scale(0.8); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.15; }
          100% { transform: translateY(-100px) translateX(30px) scale(1.2); opacity: 0; }
        }

        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.2; }
          100% { transform: translateY(-120px) translateX(40px); opacity: 0; }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.2); }
        }

        .animate-rain-fall-1 { animation: rain-fall-1 1.8s linear infinite; }
        .animate-rain-fall-2 { animation: rain-fall-2 2.2s linear infinite; }
        .animate-rain-fall-3 { animation: rain-fall-3 1.5s linear infinite; }
        .animate-bubble-float { animation: bubble-float 5s ease-in-out infinite; }
        .animate-bubble-float-small { animation: bubble-float-small linear infinite; }
        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
      `}</style>
    </section>
  )
}
