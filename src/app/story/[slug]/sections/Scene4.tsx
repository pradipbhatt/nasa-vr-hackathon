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
  left: string
  top: string
  size: string
  delay: string
  duration: string
}

interface Section {
  id: string
  title: string
  subtitle: string
  description: string
  image: string | null
  color: string
  type: 'intro' | 'image' | 'dramatic' | 'transition' | 'finale'
  stats?: { label: string; value: string; color: string }[]
}

export default function Scene4({ sceneRef }: SceneProps) {
  const [visibleSections, setVisibleSections] = useState<number[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [smallBubbles, setSmallBubbles] = useState<Particle[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const titleRef = useRef<HTMLImageElement>(null)
  const mounted = useRef(false)

  // Generate particles and bubbles on client
  useEffect(() => {
    const generatedParticles: Particle[] = Array.from({ length: 25 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 5 + 2}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${6 + Math.random() * 4}s`,
    }))
    setParticles(generatedParticles)

    const generatedSmallBubbles: Particle[] = Array.from({ length: 12 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 6 + 3}px`,
      delay: `${Math.random() * 8}s`,
      duration: `${8 + Math.random() * 6}s`,
    }))
    setSmallBubbles(generatedSmallBubbles)
  }, [])

  // IntersectionObserver to track visible sections
  useEffect(() => {
    if (!mounted.current) return
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

    return () => observers.forEach(obs => obs.disconnect())
  }, [mounted.current])

  // GSAP animations
  useEffect(() => {
    if (!containerRef.current) return
    mounted.current = true

    const ctx = gsap.context(() => {
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

      gsap.utils.toArray<HTMLElement>('.text-reveal').forEach(el => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 60%",
            toggleActions: "play none none reverse"
          }
        })
      })

      gsap.utils.toArray<HTMLElement>('.scale-in').forEach(el => {
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

      gsap.utils.toArray<HTMLElement>('.parallax-image').forEach(el => {
        gsap.to(el, {
          yPercent: -25,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const sections: Section[] = [
    {
      id: 'intro',
      title: 'DISASTER UNFOLDS',
      subtitle: "Nature's wrath unleashed",
      description: 'The consequences of environmental destruction manifest in catastrophic storms. What humanity sowed, nature reaps with devastating force. The ocean demands justice.',
      image: null,
      color: 'red',
      type: 'intro',
      stats: [
        { label: 'Hurricane Force', value: 'CAT 5', color: 'red' },
        { label: 'Wave Height', value: '15m+', color: 'orange' },
        { label: 'Casualties', value: 'HIGH', color: 'gray' },
      ],
    },
    {
      id: 'storm-impact',
      title: 'THE STORM STRIKES',
      subtitle: 'Unstoppable force',
      description: 'The polluted ocean storm intensifies beyond prediction. Contaminated waters churn with unnatural fury, as if the ocean itself rebels against its poisoning.',
      image: '/27 Polluted_Ocean_Storm_Anime.png',
      color: 'gray',
      type: 'image',
    },
    {
      id: 'ship-tragedy',
      title: 'FRIENDS IN PERIL',
      subtitle: 'The vessel breaks',
      description: "The research ship splinters under nature's assault. Friends who embarked together now face their final moments as the storm consumes everything.",
      image: '/35 Storm_Ship_Friends_Tragedy.png',
      color: 'red',
      type: 'image',
    },
    {
      id: 'tanya-terror',
      title: "TANYA'S FINAL FEAR",
      subtitle: 'Terror in the tempest',
      description: "Tanya faces the storm's full fury. Her terror reflects the magnitude of what they've unleashed—and what they'll never be able to stop.",
      image: '/33 Tanya_Storm_Terror.png',
      color: 'purple',
      type: 'image',
    },
    {
      id: 'underwater-drag',
      title: 'PULLED INTO DARKNESS',
      subtitle: 'The ocean claims its own',
      description: 'Sangam and Tanya are dragged underwater into the polluted depths. The water that once inspired wonder now becomes a tomb.',
      image: '/36 Terror_Underwater_Drag_Sangam_Tanya.png',
      color: 'blue',
      type: 'image',
    },
    {
      id: 'desperation',
      title: 'DESPERATE STRUGGLE',
      subtitle: 'Fighting the inevitable',
      description: "Mahir and Tanya's underwater desperation intensifies. Every breath could be their last as they fight against water thick with pollution.",
      image: '/37 Underwater_Desperation_Mahir_Tanya.png',
      color: 'cyan',
      type: 'image',
    },
    {
      id: 'tanya-warning',
      title: 'FINAL WORDS',
      subtitle: 'A promise unfulfilled',
      description: "Tanya's last warning echoes through the murky water: 'Sangam... we have to save this ocean... don't let it die...' Her final breath carries an impossible burden.",
      image: '/39 Tanya_s_Last_Warning_Underwater.png',
      color: 'blue',
      type: 'dramatic',
    },
    {
      id: 'transition',
      title: 'AFTERMATH',
      subtitle: 'Silence after the storm',
      description: 'The storm passes, leaving only devastation. The sea calms, but the damage—both environmental and human—cannot be undone. One survivor remains.',
      image: null,
      color: 'gray',
      type: 'transition',
    },
    {
      id: 'desolate-beach',
      title: 'SOLE SURVIVOR',
      subtitle: 'Washed ashore',
      description: 'Sangam awakens on a desolate beach, the only survivor. The weight of survival crashes over him—heavier than any wave that brought him here.',
      image: '/44 Sangam_Hologram_Tragedy_Desolate_Beach.png',
      color: 'gray',
      type: 'image',
    },
    {
      id: 'survivor-guilt',
      title: 'BURDEN OF SURVIVAL',
      subtitle: 'Why did I live?',
      description: "Survivor's guilt overwhelms Sangam on the empty beach. Their faces haunt him. Their voices echo in the crashing waves. Why him? Why not them?",
      image: '/44 Sangam_Survivor_Guilt_Beach.png',
      color: 'blue',
      type: 'image',
    },
    {
      id: 'ocean-realization',
      title: 'THE AWAKENING',
      subtitle: 'Understanding dawns',
      description: "Sangam's ocean realization: he survived for a reason. Their sacrifice cannot be meaningless. He must carry their mission forward, no matter the cost.",
      image: '/43 Sangam_Ocean_Realization.png',
      color: 'cyan',
      type: 'dramatic',
    },
    {
      id: 'determination',
      title: 'RESOLVE AWAKENED',
      subtitle: 'A new purpose born',
      description: 'From the depths of despair, determination crystallizes. Sangam vows to honor their sacrifice. He will restore what they destroyed. He will save the ocean—or die trying.',
      image: null,
      color: 'cyan',
      type: 'transition',
    },
    {
      id: 'restoration-vision',
      title: 'THE PATH FORWARD',
      subtitle: 'Technology meets purpose',
      description: 'A montage of restoration begins to form in his mind. Advanced technology, global cooperation, relentless dedication—the path will be long, but it\'s the only path worth taking.',
      image: '/45 Sangam_Restoration_Montage.png',
      color: 'green',
      type: 'image',
    },
    {
      id: 'first-hope',
      title: 'CORAL RECOVERY BEGINS',
      subtitle: 'Signs of life return',
      description: 'The first hopeful signs emerge. Coral reefs show resilience. With proper care and advanced restoration techniques, life can return to the ocean.',
      image: '/46 Hopeful_Coral_Reef_Recovery.png',
      color: 'teal',
      type: 'image',
    },
    {
      id: 'ocean-memory',
      title: 'THE OCEAN REMEMBERS',
      subtitle: 'Eternal tribute',
      description: 'The ocean remembers Sangam\'s promise. It remembers those who fell. Every restored reef, every cleaned shore, every saved creature—a tribute to their sacrifice.',
      image: '/47 Ocean_Remembers_Sangam_Tribute.png',
      color: 'blue',
      type: 'image',
    },
    {
      id: 'commitment',
      title: 'VOW OF REDEMPTION',
      subtitle: 'A promise to the fallen',
      description: 'Sangam makes his vow to the ocean and to his lost friends: \'I will not let your sacrifice be in vain. I will restore what we destroyed. This is my life\'s mission now.\'',
      image: null,
      color: 'cyan',
      type: 'finale',
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { text: string; border: string; glow: string; bg: string }> = {
      red: { text: 'text-red-300', border: 'border-red-500', glow: 'shadow-red-500/50', bg: 'bg-red-900/50' },
      orange: { text: 'text-orange-300', border: 'border-orange-500', glow: 'shadow-orange-500/50', bg: 'bg-orange-900/50' },
      gray: { text: 'text-gray-300', border: 'border-gray-500', glow: 'shadow-gray-500/50', bg: 'bg-gray-900/50' },
      blue: { text: 'text-blue-300', border: 'border-blue-500', glow: 'shadow-blue-500/50', bg: 'bg-blue-900/50' },
      cyan: { text: 'text-cyan-300', border: 'border-cyan-500', glow: 'shadow-cyan-500/50', bg: 'bg-cyan-900/50' },
      purple: { text: 'text-purple-300', border: 'border-purple-500', glow: 'shadow-purple-500/50', bg: 'bg-purple-900/50' },
      green: { text: 'text-green-300', border: 'border-green-500', glow: 'shadow-green-500/50', bg: 'bg-green-900/50' },
      teal: { text: 'text-teal-300', border: 'border-teal-500', glow: 'shadow-teal-500/50', bg: 'bg-teal-900/50' },
    }
    return colors[color] || colors.gray
  }

  return (
    <section
       ref={(el) => {
        sceneRef(el as HTMLDivElement | null)
        containerRef.current = el as HTMLDivElement | null
      }}
      className="relative bg-gradient-to-b from-gray-900 via-blue-950 to-cyan-950"
    >
      {/* Fixed background layers with particles */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        {/* Background images and rain layers would go here */}

        {/* Floating particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/30 animate-float-particle"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}

        {smallBubbles.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-cyan-300/20 animate-bubble-float-small"
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              top: b.top,
              animationDelay: b.delay,
              animationDuration: b.duration,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-20">
        <div className="relative h-40 flex items-center justify-center">
          <img
            ref={titleRef}
            src="/chapter-headings/chapter-4.png"
            alt="Chapter 4"
            className="w-1/3 max-w-md scale-in"
            style={{ filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.9))' }}
          />
        </div>

        {/* Sections */}
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
              {section.image ? (
                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
                  {/* Image column */}
                  <div className={`${index % 2 === 1 ? 'md:order-2' : 'md:order-1'} flex justify-center md:justify-start`}>
                    <div
                      ref={(el) => {
        sceneRef(el as HTMLDivElement | null)
        containerRef.current = el as HTMLDivElement | null
      }}
                      className="parallax-image relative group self-start w-full md:max-w-xl lg:max-w-2xl"
                    >
                      <img src={section.image} alt={section.title} className="w-full rounded-2xl shadow-2xl" />
                      <div className="absolute inset-0 border-4 border-white/10 rounded-2xl pointer-events-none" />
                      <div className="absolute inset-2 border-2 border-white/5 rounded-xl pointer-events-none" />
                    </div>
                  </div>

                  {/* Text column */}
                  <div className={`${index % 2 === 1 ? 'md:order-1 md:text-right' : 'md:order-2'} flex flex-col justify-end self-end`}>
                    <h2 className={`text-4xl md:text-5xl font-bold mb-2 text-center md:text-inherit text-reveal ${colorClasses.text}`}>
                      {section.title}
                    </h2>
                    <h3 className={`text-lg md:text-2xl mb-3 md:mb-4 text-center md:text-inherit text-reveal ${colorClasses.text}`}>
                      {section.subtitle}
                    </h3>
                    <p className={`max-w-2xl ${index % 2 === 1 ? 'ml-auto' : ''} text-center md:text-left text-base md:text-xl text-gray-300 text-reveal`}>
                      {section.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className={`text-4xl md:text-5xl font-bold mb-2 text-reveal ${colorClasses.text}`}>
                    {section.title}
                  </h2>
                  <h3 className={`text-lg md:text-2xl mb-3 md:mb-4 text-reveal ${colorClasses.text}`}>
                    {section.subtitle}
                  </h3>
                  <p className={`max-w-3xl mx-auto text-base md:text-xl text-gray-300 text-reveal`}>
                    {section.description}
                  </p>
                </div>
              )}
              {section.stats && (
                <div className="flex flex-wrap justify-center mt-6 gap-4">
                  {section.stats.map((stat, i) => {
                    const statColor = getColorClasses(stat.color)
                    return (
                      <div
                        key={i}
                        className={`border ${statColor.border} ${statColor.glow} rounded-lg px-4 py-2 text-center`}
                      >
                        <p className="text-sm">{stat.label}</p>
                        <p className="font-bold text-lg">{stat.value}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <style jsx>{`
        @keyframes float-particle {
          0% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-20px); opacity: 0.8; }
          100% { transform: translateY(0); opacity: 0.5; }
        }
        @keyframes bubble-float-small {
          0% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-30px); opacity: 0.7; }
          100% { transform: translateY(0); opacity: 0.4; }
        }
        .animate-float-particle {
          animation-name: float-particle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        .animate-bubble-float-small {
          animation-name: bubble-float-small;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </section>
  )
}
