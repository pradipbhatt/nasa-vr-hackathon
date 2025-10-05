'use client'

import React, { useEffect, useRef, useState } from 'react'

interface SceneProps {
  sceneRef: (el: HTMLDivElement | null) => void
}

export default function Scene12({ sceneRef }: SceneProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [visibleSections, setVisibleSections] = useState<number[]>([])
  const [scrollProgress, setScrollProgress] = useState(0)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const characterCardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = (scrollTop / docHeight) * 100
        setScrollProgress(progress)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
        { threshold: 0.3 }
      )

      observer.observe(section)
      observers.push(observer)
    })

    // Character card observers for scroll animations
    characterCardsRef.current.forEach((card, index) => {
      if (!card) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              card.style.animation = `cardSlideIn 0.8s ease-out ${index * 0.2}s both`
            }
          })
        },
        { threshold: 0.5 }
      )

      observer.observe(card)
      observers.push(observer)
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [])

  const sections = [
    {
      id: 'intro',
      title: "THE LAST WAVE",
      subtitle: "Their sacrifice became the ocean's eternal memory",
      color: "cyan",
      description: "In the deepest trenches where light fears to tread, a final stand was made. Their legacy echoes in every wave, their courage etched in the currents forever."
    },
    {
      id: 'voyage',
      title: "THE FINAL VOYAGE",
      subtitle: "Into the heart of darkness they sailed",
      color: "cyan",
      description: "With determined hearts and unwavering resolve, they charted a course toward the abyss. Each wave carried them closer to their destiny, each star above bearing witness to their courage."
    },
    {
      id: 'bonds',
      title: "BONDS OF SACRIFICE",
      subtitle: "United by purpose, divided by fate",
      color: "blue",
      description: "On the deck under stormy skies, they shared their final moments. Laughter mixed with tears, hope intertwined with fear, as they prepared to give everything for the ocean they loved."
    },
    {
      id: 'memory',
      title: "OCEAN'S MEMORY",
      subtitle: "The deep remembers what the surface forgets",
      color: "green",
      description: "In the silent cathedrals of coral and the dancing schools of fish, their story lives on. The ocean cradles their memory in its eternal embrace, never to be forgotten."
    },
    {
      id: 'sacrifice',
      title: "THE SACRIFICE",
      subtitle: "When heroes become legends",
      color: "purple",
      description: "As the storm raged and the abyss called, they made their choice. Not for glory, not for fame, but for the whispered promise of a future where the ocean would thrive once more."
    },
    {
      id: 'legacy',
      title: "ETERNAL LEGACY",
      subtitle: "Their wave continues forever",
      color: "cyan",
      description: "Though their bodies returned to the sea, their spirit became the tide. In every sunrise over calm waters, in every storm that cleanses, in every life the ocean nurtures - they remain."
    }
  ]

  const characters = [
    { 
      name: "Captain Elara", 
      role: "The Visionary", 
      color: "green", 
      quote: "The ocean gave us life. It's time we return the favor.",
      flower: "/013-021/song-pt3-flower-01.png"
    },
    { 
      name: "Dr. Kael", 
      role: "The Scientist", 
      color: "blue", 
      quote: "In the deep, we find both our past and our future.",
      flower: "/013-021/song-pt3-flower-02.png"
    },
    { 
      name: "Luna", 
      role: "The Heart", 
      color: "purple", 
      quote: "Every creature here has a story. We're just adding ours to the chorus.",
      flower: "/013-021/song-pt3-flower-03.png"
    },
    { 
      name: "Orion", 
      role: "The Guardian", 
      color: "cyan", 
      quote: "Some waves crash, some waves caress. Our wave will change everything.",
      flower: "/013-021/song-pt3-flower-04.png"
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { text: string; border: string; bg: string; glow: string; gradient: string }> = {
      cyan: { 
        text: 'text-cyan-300', 
        border: 'border-cyan-400', 
        bg: 'bg-cyan-900/40', 
        glow: 'shadow-cyan-400',
        gradient: 'from-cyan-900/60 to-blue-900/40'
      },
      blue: { 
        text: 'text-blue-300', 
        border: 'border-blue-400', 
        bg: 'bg-blue-900/40', 
        glow: 'shadow-blue-400',
        gradient: 'from-blue-900/60 to-purple-900/40'
      },
      green: { 
        text: 'text-green-300', 
        border: 'border-green-400', 
        bg: 'bg-green-900/40', 
        glow: 'shadow-green-400',
        gradient: 'from-green-900/60 to-cyan-900/40'
      },
      purple: { 
        text: 'text-purple-300', 
        border: 'border-purple-400', 
        bg: 'bg-purple-900/40', 
        glow: 'shadow-purple-400',
        gradient: 'from-purple-900/60 to-blue-900/40'
      }
    }
    return colors[color] || colors.cyan
  }

  const renderFlowers = () => (
    <>
      {/* Left Side Flowers */}
      <img
        src="/013-021/song-pt2-left-flower-01.png"
        alt="Flower"
        className="absolute left-4 top-1/4 w-32 opacity-70 animate-float-slow"
        style={{ animationDelay: '0.5s' }}
      />
      <img
        src="/013-021/song-pt2-left-flower-02.png"
        alt="Flower"
        className="absolute left-8 top-2/3 w-28 opacity-60 animate-float-medium"
        style={{ animationDelay: '1.2s' }}
      />
      <img
        src="/013-021/song-pt2-left-flower-03.png"
        alt="Flower"
        className="absolute left-12 top-1/2 w-24 opacity-80 animate-float-fast"
        style={{ animationDelay: '0.8s' }}
      />

      {/* Right Side Flowers */}
      <img
        src="/013-021/song-pt2-right-flower-01.png"
        alt="Flower"
        className="absolute right-4 top-1/3 w-36 opacity-75 animate-float-medium"
        style={{ animationDelay: '1s' }}
      />
      <img
        src="/013-021/song-pt2-right-flower-02.png"
        alt="Flower"
        className="absolute right-8 top-3/4 w-30 opacity-65 animate-float-slow"
        style={{ animationDelay: '1.5s' }}
      />
      <img
        src="/013-021/song-pt2-right-flower-03.png"
        alt="Flower"
        className="absolute right-12 top-1/5 w-26 opacity-85 animate-float-fast"
        style={{ animationDelay: '0.3s' }}
      />

      {/* Background Flower Layers */}
      <img
        src="/013-021/song-pt1-bg-flowers-white-left.png"
        alt="Background Flowers"
        className="absolute left-0 top-0 w-1/3 opacity-40 animate-fade-in-out"
        style={{ animationDelay: '2s' }}
      />
      <img
        src="/013-021/song-pt1-bg-flowers-white-right.png"
        alt="Background Flowers"
        className="absolute right-0 top-0 w-1/3 opacity-40 animate-fade-in-out"
        style={{ animationDelay: '2.5s' }}
      />

      {/* Floating Leaves */}
      <img
        src="/013-021/song-pt2-left-leaf-01.png"
        alt="Leaf"
        className="absolute left-20 top-10 w-16 opacity-50 animate-leaf-float-1"
      />
      <img
        src="/013-021/song-pt2-left-leaf-02.png"
        alt="Leaf"
        className="absolute left-32 top-40 w-20 opacity-60 animate-leaf-float-2"
      />
      <img
        src="/013-021/song-pt2-right-leaf-01.png"
        alt="Leaf"
        className="absolute right-24 top-20 w-18 opacity-55 animate-leaf-float-3"
      />
      <img
        src="/013-021/song-pt2-right-leaf-02.png"
        alt="Leaf"
        className="absolute right-16 top-60 w-14 opacity-45 animate-leaf-float-4"
      />
      <img
        src="/013-021/song-pt2-right-leaf-03.png"
        alt="Leaf"
        className="absolute right-40 top-80 w-22 opacity-65 animate-leaf-float-5"
      />
    </>
  )

  return (
    <section
      ref={(el) => {
        sceneRef(el as HTMLDivElement | null)
        containerRef.current = el as HTMLDivElement | null
      }}
      className="relative bg-gradient-to-b from-blue-950 via-purple-950 to-black"
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
            opacity: 0.6
          }}
        />

        {/* Heavy Rain Layers */}
        <div 
          className="absolute inset-0 opacity-50 animate-rain-fall-1"
          style={{
            backgroundImage: 'url(/rain/rain-light-pot.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat-y',
            height: '200%'
          }}
        />
        <div 
          className="absolute inset-0 opacity-40 animate-rain-fall-2"
          style={{
            backgroundImage: 'url(/rain/rain-light-pot.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat-y',
            height: '200%'
          }}
        />
        <div 
          className="absolute inset-0 opacity-35 animate-rain-fall-3"
          style={{
            backgroundImage: 'url(/rain/rain-light-pot.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat-y',
            height: '200%'
          }}
        />

        {/* Flower Decorations */}
        {renderFlowers()}

        {/* Floating Bubbles */}
        <div className="absolute top-1/4 left-8 w-20 h-20 rounded-full border-2 border-cyan-400/30 opacity-60 animate-bubble-float" />
        <div className="absolute top-1/3 right-8 w-20 h-20 rounded-full border-2 border-blue-400/40 opacity-60 animate-bubble-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 rounded-full border border-purple-400/50 opacity-50 animate-bubble-float" style={{ animationDelay: '2s' }} />

        {/* Atmospheric Particles */}
        {isMounted && [...Array(30)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full bg-cyan-400/30 animate-float-particle"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}

        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400 rounded-full opacity-20 filter blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-purple-400 rounded-full opacity-20 filter blur-3xl animate-glow-pulse" />
        
        {/* Additional Small Bubbles */}
        {isMounted && [...Array(12)].map((_, i) => (
          <div
            key={`small-bubble-${i}`}
            className="absolute rounded-full border border-cyan-300/20 animate-bubble-float-small"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${12 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Scrolling Content */}
      <div className="relative z-20">
        {sections.map((section, index) => {
          const isVisible = visibleSections.includes(index)
          const colorClasses = getColorClasses(section.color)

          return (
            <div
              key={section.id}
               ref={(el) => {
        sceneRef(el as HTMLDivElement | null)
        containerRef.current = el as HTMLDivElement | null
      }}
              className="min-h-screen flex items-center justify-center px-8 py-20"
            >
              <div 
                className={`max-w-6xl w-full transition-all duration-1000 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-20'
                }`}
              >
                {/* Intro Section */}
                {section.id === 'intro' && (
                  <div className="text-center">
                    <h1 className={`text-7xl md:text-8xl font-bold ${colorClasses.text} mb-8 drop-shadow-2xl animate-text-glow-cyan`}>
                      {section.title}
                    </h1>
                    <p className="text-3xl text-white italic leading-relaxed mb-12">
                      {section.subtitle}
                    </p>
                    <div className={`bg-black/80 backdrop-blur-lg ${colorClasses.border} border-2 rounded-3xl p-12 max-w-3xl mx-auto`}>
                      <p className="text-xl text-white/90 leading-relaxed">
                        {section.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Regular Sections */}
                {section.id !== 'intro' && section.id !== 'legacy' && (
                  <div className="text-center space-y-12">
                    <div>
                      <h2 className={`text-5xl md:text-6xl font-bold ${colorClasses.text} mb-4 animate-text-glow`}>
                        {section.title}
                      </h2>
                      <p className="text-2xl text-white/90 italic">
                        {section.subtitle}
                      </p>
                    </div>
                    
                    <div className={`bg-black/70 backdrop-blur-md ${colorClasses.border} border-2 rounded-2xl p-8 max-w-4xl mx-auto`}>
                      <p className="text-xl text-white leading-relaxed">
                        {section.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Legacy Section */}
                {section.id === 'legacy' && (
                  <div>
                    <div className="text-center mb-16">
                      <h2 className={`text-5xl md:text-6xl font-bold ${colorClasses.text} mb-4 animate-text-glow-cyan`}>
                        {section.title}
                      </h2>
                      <p className="text-2xl text-white/90 italic">
                        {section.subtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                      {characters.map((character, index) => {
                        const charColor = getColorClasses(character.color)
                        return (
                          <div 
                            key={character.name}
                             ref={(el) => {
        sceneRef(el as HTMLDivElement | null)
        containerRef.current = el as HTMLDivElement | null
      }}
                            className={`bg-gradient-to-br from-white/10 to-transparent p-8 rounded-2xl border-2 ${charColor.border} transition-all duration-500 group relative overflow-hidden card-scroll-animate`}
                            style={{ animationDelay: `${index * 0.2}s` }}
                          >
                            {/* Character Flower */}
                            <img
                              src={character.flower}
                              alt=""
                              className="absolute top-4 right-4 w-16 h-16 opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                            />
                            
                            <div className={`w-4 h-4 rounded-full ${charColor.bg} border ${charColor.border} mb-4 group-hover:scale-110 transition-transform duration-300`} />
                            <h3 className="text-3xl font-bold text-white mb-3">{character.name}</h3>
                            <p className="text-xl text-gray-300 mb-4">{character.role}</p>
                            <p className="text-lg text-white/80 italic relative z-10">"{character.quote}"</p>
                            
                            {/* Hover effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${charColor.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl`} />
                          </div>
                        )
                      })}
                    </div>

                    <div className="bg-gradient-to-br from-cyan-900/90 to-blue-900/90 backdrop-blur-lg rounded-3xl p-12 border-2 border-cyan-400/60 text-center relative overflow-hidden">
                      {/* Final Flower */}
                      <img
                        src="/013-021/song-pt3-flower-05.png"
                        alt="Memorial Flower"
                        className="absolute top-4 right-8 w-24 opacity-60 animate-float-slow"
                      />
                      <img
                        src="/013-021/16.png"
                        alt="Additional Flower"
                        className="absolute bottom-4 left-8 w-20 opacity-50 animate-float-medium"
                        style={{ animationDelay: '1s' }}
                      />
                      
                      <h3 className="text-5xl font-bold text-cyan-300 mb-8 animate-text-glow-cyan relative z-10">
                        THE LAST WAVE
                      </h3>
                      <p className="text-2xl text-white mb-6 leading-relaxed relative z-10">
                        "The ocean never forgets those who give everything to save it"
                      </p>
                      <p className="text-xl text-cyan-200 mb-10 relative z-10">A Story of Sacrifice and Redemption</p>
                      <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-2xl font-bold py-6 px-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-white/40 animate-button-pulse relative z-10">
                        Continue Their Legacy
                      </button>
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
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          25% { transform: translateY(-20px) translateX(10px) scale(1.1); opacity: 0.8; }
          50% { transform: translateY(-40px) translateX(-5px) scale(1.05); opacity: 0.7; }
          75% { transform: translateY(-20px) translateX(5px) scale(1.08); opacity: 0.75; }
        }

        @keyframes bubble-float-small {
          0% { transform: translateY(100vh) translateX(0) scale(0.8); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-100px) translateX(30px) scale(1.2); opacity: 0; }
        }

        @keyframes text-glow-cyan {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.4); 
          }
          50% { 
            text-shadow: 0 0 30px rgba(6, 182, 212, 1), 0 0 60px rgba(6, 182, 212, 0.6); 
          }
        }

        @keyframes text-glow {
          0%, 100% { 
            text-shadow: 0 0 20px currentColor, 0 0 40px currentColor; 
          }
          50% { 
            text-shadow: 0 0 30px currentColor, 0 0 60px currentColor; 
          }
        }

        @keyframes button-pulse {
          0%, 100% { 
            box-shadow: 0 10px 40px rgba(6, 182, 212, 0.4), 0 0 0 0 rgba(6, 182, 212, 0.2);
          }
          50% { 
            box-shadow: 0 15px 50px rgba(6, 182, 212, 0.6), 0 0 0 10px rgba(6, 182, 212, 0);
          }
        }

        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-120px) translateX(30px); opacity: 0; }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.2); }
        }

        /* Flower Animations */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }

        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }

        @keyframes fade-in-out {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes leaf-float-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -15px) rotate(2deg); }
          50% { transform: translate(5px, -25px) rotate(4deg); }
          75% { transform: translate(-5px, -15px) rotate(2deg); }
        }

        @keyframes leaf-float-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-8px, -12px) rotate(-3deg); }
          50% { transform: translate(-12px, -20px) rotate(-6deg); }
          75% { transform: translate(-4px, -12px) rotate(-3deg); }
        }

        @keyframes leaf-float-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(6px, -18px) rotate(1deg); }
          50% { transform: translate(10px, -30px) rotate(2deg); }
          75% { transform: translate(3px, -18px) rotate(1deg); }
        }

        @keyframes leaf-float-4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-5px, -10px) rotate(-2deg); }
          50% { transform: translate(-8px, -15px) rotate(-4deg); }
          75% { transform: translate(-3px, -10px) rotate(-2deg); }
        }

        @keyframes leaf-float-5 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(7px, -22px) rotate(3deg); }
          50% { transform: translate(12px, -35px) rotate(6deg); }
          75% { transform: translate(4px, -22px) rotate(3deg); }
        }

        /* Card Scroll Animations */
        @keyframes cardSlideIn {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .card-scroll-animate {
          opacity: 0;
          transform: translateY(50px) scale(0.9);
        }

        .animate-rain-fall-1 { animation: rain-fall-1 2s linear infinite; }
        .animate-rain-fall-2 { animation: rain-fall-2 2.5s linear infinite; }
        .animate-rain-fall-3 { animation: rain-fall-3 1.8s linear infinite; }
        .animate-bubble-float { animation: bubble-float 6s ease-in-out infinite; }
        .animate-bubble-float-small { animation: bubble-float-small linear infinite; }
        .animate-text-glow-cyan { animation: text-glow-cyan 3s ease-in-out infinite; }
        .animate-text-glow { animation: text-glow 3s ease-in-out infinite; }
        .animate-button-pulse { animation: button-pulse 2s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-glow-pulse { animation: glow-pulse 4s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
        .animate-fade-in-out { animation: fade-in-out 8s ease-in-out infinite; }
        .animate-leaf-float-1 { animation: leaf-float-1 15s ease-in-out infinite; }
        .animate-leaf-float-2 { animation: leaf-float-2 12s ease-in-out infinite; }
        .animate-leaf-float-3 { animation: leaf-float-3 18s ease-in-out infinite; }
        .animate-leaf-float-4 { animation: leaf-float-4 14s ease-in-out infinite; }
        .animate-leaf-float-5 { animation: leaf-float-5 16s ease-in-out infinite; }
      `}</style>
    </section>
  )
}