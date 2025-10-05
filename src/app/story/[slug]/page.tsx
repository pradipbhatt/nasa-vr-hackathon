// src/app/story/[slug]/page.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AOS from 'aos'
import 'aos/dist/aos.css'

import Scene1 from './sections/Scene1'
import Scene2 from './sections/Scene2'
import Scene3 from './sections/Scene3'
import Scene4 from './sections/Scene4'
import Scene5 from './sections/Scene5'
import Scene6 from './sections/Scene6'
import Scene7 from './sections/Scene7'
import Scene8 from './sections/Scene8'
import Scene9 from './sections/Scene9'
import Scene10 from './sections/Scene10'
import Scene11 from './sections/Scene11'
import Scene12 from './sections/Scene12'

gsap.registerPlugin(ScrollTrigger)

export default function Page() {
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    AOS.init({ 
      duration: 1200, 
      once: false, 
      offset: 100,
      easing: 'ease-out-cubic'
    })
    
    // Global parallax effect
    gsap.to('.parallax-bg', {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: "main",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  return (
    <main className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="parallax-bg fixed inset-0 bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900 z-0" />
      
      <Scene1 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[0] = el)} />
      <Scene2 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[1] = el)} />
      <Scene3 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[2] = el)} />
      <Scene4 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[3] = el)} />
      <Scene5 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[4] = el)} />
      <Scene6 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[5] = el)} />
      <Scene7 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[6] = el)} />
      <Scene8 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[7] = el)} />
      <Scene9 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[8] = el)} />
      <Scene10 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[9] = el)} />
      <Scene11 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[10] = el)} />
      <Scene12 sceneRef={(el: HTMLDivElement | null) => (sceneRefs.current[11] = el)} />
    </main>
  )
}