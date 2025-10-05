'use client'

import React, { useEffect, useRef, useState } from 'react'

interface SceneProps {
  sceneRef: (el: HTMLDivElement | null) => void
}

export default function Scene1({ sceneRef }: SceneProps) {
  const boatRef = useRef<HTMLImageElement>(null)
  const wavesRef = useRef<HTMLImageElement>(null)
  const titleRef = useRef<HTMLImageElement>(null)
  const lightningRef = useRef<HTMLDivElement>(null)
  const preloaderRef = useRef<HTMLDivElement>(null)
  const mainSectionRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showScene, setShowScene] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activePage, setActivePage] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)


  useEffect(() => {
    const lightningIntervals: NodeJS.Timeout[] = []
    
    const createPreloaderLightning = () => {
      const strikes = [400, 900, 1400, 2000, 2600, 3200, 3800]
      strikes.forEach(delay => {
        const timeout = setTimeout(() => {
          if (lightningRef.current) {
            lightningRef.current.style.opacity = '1'
            setTimeout(() => {
              if (lightningRef.current) lightningRef.current.style.opacity = '0'
            }, 80)
            setTimeout(() => {
              if (lightningRef.current) lightningRef.current.style.opacity = '0.8'
              setTimeout(() => {
                if (lightningRef.current) lightningRef.current.style.opacity = '0'
              }, 60)
            }, 150)
          }
        }, delay)
        lightningIntervals.push(timeout)
      })
    }

    createPreloaderLightning()

    const preloaderTimeout = setTimeout(() => {
      if (preloaderRef.current) {
        preloaderRef.current.style.opacity = '0'
        preloaderRef.current.style.pointerEvents = 'none'
      }
      setTimeout(() => {
        setIsLoading(false)
        setTimeout(() => {
          setShowScene(true)
        }, 200)
      }, 1000)
    }, 4500)

    return () => {
      lightningIntervals.forEach(clearTimeout)
      clearTimeout(preloaderTimeout)
    }
  }, [])

  useEffect(() => {
    if (!showScene) return

    const handleScroll = () => {
      if (!mainSectionRef.current) return
      
      const rect = mainSectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const sectionHeight = rect.height
      
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + sectionHeight)))
      setScrollProgress(progress)
      
      // Determine active page based on scroll progress
      if (progress < 0.33) setActivePage(0)
      else if (progress < 0.66) setActivePage(1)
      else setActivePage(2)
      
      if (boatRef.current) {
        const boatMove = progress * 100
        boatRef.current.style.transform = `translateY(${-boatMove}px) scale(${1 + progress * 0.2})`
      }
      
      if (titleRef.current) {
        const titleMove = progress * 150
        titleRef.current.style.transform = `translateY(${-titleMove}px)`
        titleRef.current.style.opacity = String(1 - progress * 0.5)
      }
      
      if (wavesRef.current) {
        const waveMove = progress * 50
        wavesRef.current.style.transform = `translateY(${waveMove}px) translateX(${progress * 30}px)`
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    const timeouts: NodeJS.Timeout[] = []

    const createAmbientLightning = () => {
      const flash = () => {
        const randomDelay = 4000 + Math.random() * 6000
        const randomIntensity = 0.25 + Math.random() * 0.45
        
        const timeout = setTimeout(() => {
          if (lightningRef.current) {
            lightningRef.current.style.opacity = String(randomIntensity)
            setTimeout(() => {
              if (lightningRef.current) {
                lightningRef.current.style.opacity = '0'
              }
            }, 60 + Math.random() * 180)
          }
          flash()
        }, randomDelay)
        timeouts.push(timeout)
      }
      flash()
    }

    createAmbientLightning()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      timeouts.forEach(clearTimeout)
    }
  }, [showScene])

  const pages = [
    {
      title: "The Journey Begins",
      subtitle: "A pristine ocean awaits exploration",
      color: "blue"
    },
    {
      title: "Research Expedition",
      subtitle: "Scientists venture into unknown waters",
      color: "cyan"
    },
    {
      title: "Approaching Storm",
      subtitle: "Dark clouds gather on the horizon",
      color: "indigo"
    }
  ]

  return (
    <>
      {/* ENHANCED PRELOADER */}
      <div
        ref={preloaderRef}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-1000"
        style={{ display: isLoading ? 'flex' : 'none' }}
      >
        {/* Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950" />
        
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(/007-storm-arrived/bg-pot-02.jpg)' }}
        />
        
        {/* Floral Background Elements */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(/013-021/song-pt2-left-flower-01.png), url(/013-021/song-pt2-right-flower-01.png)',
            backgroundPosition: 'left top, right top',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'auto 70%'
          }}
        />
        
        <div
          ref={lightningRef}
          className="absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-100 mix-blend-screen"
          style={{ 
            zIndex: 105,
            backgroundImage: 'url(/007-storm-arrived/lightning.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Enhanced Rain System */}
        <div className="absolute inset-0 opacity-80 pointer-events-none overflow-hidden" style={{ zIndex: 103 }}>
          <div 
            className="absolute inset-0 animate-rain-vertical-1"
            style={{
              backgroundImage: 'url(/rain/rain-light-pot.png)',
              backgroundSize: 'cover',
              backgroundRepeat: 'repeat',
              opacity: 0.7
            }}
          />
          <div 
            className="absolute inset-0 animate-rain-vertical-2"
            style={{
              backgroundImage: 'url(/rain/rain-light-pot.png)',
              backgroundSize: '150%',
              backgroundRepeat: 'repeat',
              opacity: 0.4
            }}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-[110] text-center px-8">
          <div className="mb-8 animate-pulse-slow">
            <div className="text-white text-5xl md:text-7xl font-bold mb-6 tracking-wider animate-flicker" 
                 style={{ textShadow: '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(100,150,255,0.3)' }}>
              THE STORM AWAITS
            </div>
            <div className="text-blue-300 text-xl md:text-3xl font-light tracking-wide animate-fade-pulse"
                 style={{ textShadow: '0 0 20px rgba(100,150,255,0.4)' }}>
              A Journey Through Chaos and Redemption
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4 mt-12">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin-slow" />
            <div className="text-blue-200 text-sm tracking-widest animate-pulse">
              LOADING EXPERIENCE...
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-[120] flex gap-3">
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{ animationDelay: `${dot * 0.3}s` }}
            />
          ))}
        </div>
      </div>

      {/* ENHANCED MAIN SCENE - Multi-page sections */}
      <section 
        ref={(el) => {
        sceneRef(el as HTMLDivElement | null)
        containerRef.current = el as HTMLDivElement | null
      }}
        className="relative"
      >
        {/* Page 1: Title Introduction */}
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-black">
          <div className={`absolute inset-0 transition-opacity duration-2000 ${showScene ? 'opacity-100' : 'opacity-0'}`}>
            {/* Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center transform scale-110"
              style={{ backgroundImage: 'url(/001-landing/bg.png)' }}
            />
            
            {/* Floral Overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'url(/013-021/song-pt3-flower-01.png), url(/013-021/song-pt3-flower-02.png)',
                backgroundPosition: 'left top, right top',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'auto 60%'
              }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 via-indigo-950/40 to-slate-900/60 mix-blend-multiply" />
            
            <div
              ref={lightningRef}
              className="absolute inset-0 bg-gradient-to-b from-blue-100 via-white to-blue-200 opacity-0 pointer-events-none z-30 mix-blend-screen transition-opacity duration-100"
            />
            
            {/* Enhanced Rain */}
            <div className="absolute inset-0 opacity-40 pointer-events-none z-25 overflow-hidden">
              <div 
                className="absolute inset-0 animate-rain-scene-1"
                style={{
                  backgroundImage: 'url(/rain/rain-light-pot.png)',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'repeat',
                  opacity: 0.6
                }}
              />
              <div 
                className="absolute inset-0 animate-rain-scene-2"
                style={{
                  backgroundImage: 'url(/rain/rain-light-pot.png)',
                  backgroundSize: '120%',
                  backgroundRepeat: 'repeat',
                  opacity: 0.3
                }}
              />
            </div>
            
            {/* Title */}
            <img
              ref={titleRef}
              src="/chapter-headings/chapter-1.png"
              alt="The Last Wave"
              className="absolute top-20 z-40 w-1/3 max-w-md opacity-0 animate-title"
              style={{ filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.9))' }}
            />

            {/* Page Content */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-35 text-center">
              <div className={`transition-all duration-1000 ${activePage === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <h2 className="text-4xl font-bold text-white mb-4" style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.7)' }}>
                  {pages[0].title}
                </h2>
                <p className="text-xl text-blue-200" style={{ textShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}>
                  {pages[0].subtitle}
                </p>
              </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-20 left-10 z-30 opacity-0 animate-scroll-indicator">
              <img
                src="/001-landing/text-scroll.png"
                alt="Scroll to continue"
                className="w-32"
              />
            </div>

            {/* Scene Indicator */}
            <div className="absolute bottom-10 right-10 z-40 opacity-0 animate-fade-in-late">
              <div className="bg-gradient-to-r from-blue-900/90 to-indigo-900/90 backdrop-blur-md px-8 py-4 rounded-full border-2 border-blue-400/40 shadow-2xl">
                <div className="text-white text-xl font-bold">Scene 1</div>
                <div className="text-blue-200 text-sm">Pristine Beginning</div>
              </div>
            </div>

            {/* Page Progress */}
            <div className="absolute top-10 left-10 z-35 flex gap-2">
              {pages.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    activePage === index 
                      ? 'bg-blue-400 scale-125' 
                      : 'bg-blue-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Page 2: Boat Entrance */}
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-black">
          <div className={`absolute inset-0 transition-opacity duration-2000 ${showScene ? 'opacity-100' : 'opacity-0'}`}>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/001-landing/bg.png)' }}
            />
            
            {/* Floral Elements */}
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'url(/013-021/song-pt3-flower-03.png), url(/013-021/song-pt3-flower-04.png)',
                backgroundPosition: 'left bottom, right bottom',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'auto 50%'
              }}
            />
            
            <img
              ref={boatRef}
              src="/001-landing/boat-01.png"
              alt="Research Ship in Storm"
              className="relative z-20 w-1/2 max-w-2xl transform transition-transform duration-1000 hover:scale-105 opacity-0 animate-boat"
              style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.95))' }}
            />
            
            <img
              ref={wavesRef}
              src="/001-landing/waves-pot.png"
              alt="Stormy Ocean Waves"
              className="absolute bottom-0 w-full opacity-0 z-15 animate-waves"
              style={{ filter: 'contrast(1.3) brightness(0.85)' }}
            />

            {/* Page Content */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-35 text-center">
              <div className={`transition-all duration-1000 ${activePage === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <h2 className="text-4xl font-bold text-white mb-4" style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.7)' }}>
                  {pages[1].title}
                </h2>
                <p className="text-xl text-cyan-200" style={{ textShadow: '0 0 15px rgba(34, 211, 238, 0.5)' }}>
                  {pages[1].subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Page 3: Storm Clouds */}
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-black">
          <div className={`absolute inset-0 transition-opacity duration-2000 ${showScene ? 'opacity-100' : 'opacity-0'}`}>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/001-landing/bg.png)' }}
            />
            
            {/* Enhanced Floral Background */}
            <div 
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: 'url(/013-021/song-pt3-flower-05.png), url(/013-021/song-pt2-left-flower-01.png)',
                backgroundPosition: 'center top, left center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'auto 40%, auto 60%'
              }}
            />
            
            <img
              src="/001-landing/cloud-pot-01.png"
              alt="Storm Clouds"
              className="absolute top-10 left-10 w-1/3 opacity-0 mix-blend-multiply z-5 animate-cloud-left"
            />
            <img
              src="/001-landing/foreground-clouds-pot.png"
              alt="Foreground Storm Clouds"
              className="absolute top-20 right-10 w-1/3 opacity-0 mix-blend-multiply z-5 animate-cloud-right"
            />

            {/* Page Content */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-35 text-center">
              <div className={`transition-all duration-1000 ${activePage === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <h2 className="text-4xl font-bold text-white mb-4" style={{ textShadow: '0 0 20px rgba(129, 140, 248, 0.7)' }}>
                  {pages[2].title}
                </h2>
                <p className="text-xl text-indigo-200" style={{ textShadow: '0 0 15px rgba(129, 140, 248, 0.5)' }}>
                  {pages[2].subtitle}
                </p>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/70 pointer-events-none z-50" />

            {/* Final Navigation */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-40 text-center">
              <div className="flex items-center gap-6 text-white/70">
                <span>Continue to Scene 2</span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes rain-vertical-1 {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        @keyframes rain-vertical-2 {
          0% { transform: translateY(-150%); }
          100% { transform: translateY(50%); }
        }

        @keyframes rain-scene-1 {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        @keyframes rain-scene-2 {
          0% { transform: translateY(-120%); }
          100% { transform: translateY(80%); }
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
          75% { opacity: 1; }
        }

        @keyframes fade-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes cloud-left {
          0% { transform: translateX(-120px); opacity: 0; }
          20% { opacity: 0.75; }
          100% { transform: translateX(40px); opacity: 0.75; }
        }

        @keyframes cloud-right {
          0% { transform: translateX(120px); opacity: 0; }
          20% { opacity: 0.7; }
          100% { transform: translateX(-50px); opacity: 0.7; }
        }

        @keyframes waves {
          0% { transform: translateY(150px) scale(1.15); opacity: 0; }
          30% { opacity: 0.8; }
          100% { transform: translateY(-50px) translateX(25px) scale(1); opacity: 0.8; }
        }

        @keyframes boat {
          0% { transform: translateX(-400px) translateY(80px) rotate(-8deg) scale(0.8); opacity: 0; }
          100% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); opacity: 1; }
        }

        @keyframes title {
          0% { transform: translateY(-150px) scale(0.3) rotate(-15deg); opacity: 0; filter: blur(10px); }
          100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; filter: blur(0); }
        }

        @keyframes scroll-indicator {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(15px); opacity: 1; }
        }

        @keyframes fade-in-late {
          0% { opacity: 0; transform: translateY(20px); }
          70% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-rain-vertical-1 { animation: rain-vertical-1 0.8s linear infinite; }
        .animate-rain-vertical-2 { animation: rain-vertical-2 1.2s linear infinite; }
        .animate-rain-scene-1 { animation: rain-scene-1 1s linear infinite; }
        .animate-rain-scene-2 { animation: rain-scene-2 1.4s linear infinite; }
        .animate-flicker { animation: flicker 2s ease-in-out infinite; }
        .animate-fade-pulse { animation: fade-pulse 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 2s linear infinite; }
        .animate-cloud-left { animation: cloud-left 16s ease-in-out infinite alternate; }
        .animate-cloud-right { animation: cloud-right 20s ease-in-out infinite alternate; }
        .animate-waves { animation: waves 3.5s ease-out forwards; }
        .animate-boat { animation: boat 3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-title { animation: title 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1.5s forwards; }
        .animate-scroll-indicator { animation: scroll-indicator 2s ease-in-out 2.5s infinite; }
        .animate-fade-in-late { animation: fade-in-late 4s ease-out forwards; }
      `}</style>
    </>
  )
}