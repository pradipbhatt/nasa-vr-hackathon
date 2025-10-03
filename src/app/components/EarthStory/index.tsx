"use client"
import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { EndSection } from './ui/EndSection';
import { UIControls } from './ui/UIControls';
import { createScene, createLights, createCosmos, createBigBang, createNebula, createSolarSystem, createEarth, createImpact, createClimate, createOceanElements } from './utils/sceneSetup';
import { SceneObjects } from './types';
import { sections } from './sections/index';

export default function EarthParallaxStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [userControlled, setUserControlled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const rafRef = useRef<number>(0);

  // Debounce scroll handler
  const debounce = useCallback((fn: Function, ms: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), ms);
    };
  }, []);

  useEffect(() => {
    setIsMounted(true);
    if (!containerRef.current) return;

    const { scene, camera, renderer } = createScene(containerRef.current);
    const lights = createLights();
    Object.values(lights).forEach(light => scene.add(light));

    const cosmos = createCosmos(scene);
    const bigBang = createBigBang(scene);
    const nebula = createNebula(scene);
    const solarSystem = createSolarSystem(scene);
    const earth = createEarth(scene);
    const impact = createImpact(scene);
    const climate = createClimate(scene);
    const ocean = createOceanElements(scene);

    const sceneObjects: SceneObjects = {
      scene, camera, renderer, lights, cosmos, bigBang, nebula, solarSystem, earth, impact, climate, ocean
    };

    const clock = new THREE.Clock();
    let targetProgress = 0;
    let currentProgress = 0;
    let lastFrameTime = performance.now();
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const handleScroll = debounce(() => {
      if (!scrollRef.current) return;
      const scrollTop = scrollRef.current.scrollTop;
      const scrollHeight = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      targetProgress = scrollTop / scrollHeight;
    }, 16);

    scrollRef.current?.addEventListener("scroll", handleScroll);

    // Touch and mouse controls
    let isDragging = false;
    let previousPosition = { x: 0, y: 0 };
    let targetRotationX = 0, targetRotationY = 0;

    const handleStart = (x: number, y: number) => {
      isDragging = true;
      setIsRotating(true);
      setUserControlled(true);
      previousPosition = { x, y };
    };

    const handleMove = (x: number, y: number) => {
      if (!isDragging) return;
      const deltaX = x - previousPosition.x;
      const deltaY = y - previousPosition.y;
      targetRotationY += deltaX * 0.003;
      targetRotationX += deltaY * 0.003;
      targetRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationX));
      earth.earth.rotation.x = targetRotationX;
      earth.earth.rotation.y = targetRotationY;
      earth.clouds.rotation.x = targetRotationX;
      earth.clouds.rotation.y = targetRotationY;
      previousPosition = { x, y };
    };

    const handleEnd = () => {
      isDragging = false;
      setIsRotating(false);
      setTimeout(() => setUserControlled(false), 1000);
    };

    const handleMouseDown = (e: MouseEvent) => handleStart(e.clientX, e.clientY);
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleEnd);
    renderer.domElement.addEventListener('touchstart', handleTouchStart);
    renderer.domElement.addEventListener('touchmove', handleTouchMove);
    renderer.domElement.addEventListener('touchend', handleEnd);

    const animate = (currentTime: number) => {
      if (!isMounted) return;
      
      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime < frameInterval) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime - (deltaTime % frameInterval);

      const elapsed = clock.getElapsedTime();
      currentProgress += (targetProgress - currentProgress) * 0.1;
      setScrollProgress(currentProgress);

      const section = Math.floor(currentProgress * sections.length);
      setCurrentSection(Math.min(section, sections.length - 1));

      sections.forEach((sec, idx) => {
        const sectionStart = idx / sections.length;
        const sectionEnd = (idx + 1) / sections.length;
        if (currentProgress >= sectionStart && currentProgress < sectionEnd) {
          const localProgress = (currentProgress - sectionStart) / (sectionEnd - sectionStart);
          sec.animate(sceneObjects, localProgress, camera, userControlled);
        }
      });

      if (!userControlled) {
        earth.earth.rotation.y += 0.0003 * deltaTime * 0.06;
        earth.clouds.rotation.y += 0.0004 * deltaTime * 0.06;
      }
      cosmos.starsGroup.children.forEach((layer, i) => {
        (layer as THREE.Points).rotation.y += 0.000015 * (i + 1) * deltaTime * 0.06;
      });
      cosmos.cmbMaterial.uniforms.time.value = elapsed * 0.1;
      nebula.group.children.forEach((nebula, i) => {
        (nebula as THREE.Mesh).rotation.y += 0.00015 * (i + 1) * deltaTime * 0.06;
      });
      if (earth.oceanMaterial.opacity > 0) {
        earth.oceanParticles.rotation.y += 0.0002 * deltaTime * 0.06;
        earth.oceanParticles.scale.set(climate.seaLevelScale.value, climate.seaLevelScale.value, climate.seaLevelScale.value);
      }
      solarSystem.asteroids.forEach((asteroid) => {
        if (asteroid.visible) {
          asteroid.userData.angle += asteroid.userData.speed * deltaTime * 0.06;
          asteroid.position.x = Math.cos(asteroid.userData.angle) * asteroid.userData.radius;
          asteroid.position.z = Math.sin(asteroid.userData.angle) * asteroid.userData.radius;
        }
      });
      climate.co2Particles.rotation.y += 0.0001 * deltaTime * 0.06;
      climate.heatMap.rotation.y += 0.0002 * deltaTime * 0.06;
      ocean.microplastics.rotation.y += 0.0001 * deltaTime * 0.06;
      ocean.phytoplankton.rotation.y += 0.0003 * deltaTime * 0.06;

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    return () => {
      setIsMounted(false);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      scrollRef.current?.removeEventListener("scroll", handleScroll);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleEnd);
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      renderer.domElement.removeEventListener('touchmove', handleTouchMove);
      renderer.domElement.removeEventListener('touchend', handleEnd);
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [userControlled, debounce, isMounted]);

  const scrollToSection = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const scrollHeight = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    const targetScroll = (index / sections.length) * scrollHeight;
    scrollRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-indigo-950 to-blue-950 overflow-hidden">
      <div ref={containerRef} className="fixed inset-0 z-0 touch-none" />

      {isRotating && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/50 rounded-lg px-4 py-2 sm:px-6 sm:py-3">
            <div className="text-cyan-300 text-xs sm:text-sm font-mono flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              Rotating Earth
            </div>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="relative z-10 w-full h-screen overflow-y-auto scroll-smooth touch-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4a5568 #1a202c' }}>
        <div style={{ height: '1300vh' }}>
          <div className="sticky top-0 h-screen flex items-center justify-start px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pointer-events-none">
            <div className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px]">
              {sections[currentSection] && (
                <div
                  key={currentSection}
                  className="animate-fade-in transition-opacity duration-500"
                  role="region"
                  aria-label={`Story section: ${sections[currentSection].title}`}
                >
                  <div className="text-white">
                    <div className="text-cyan-400 text-xs sm:text-sm md:text-base font-mono mb-3 tracking-widest opacity-90 uppercase">
                      {sections[currentSection].subtitle}
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 tracking-tight drop-shadow-2xl bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent leading-tight">
                      {sections[currentSection].title}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed mb-4 md:mb-6 drop-shadow-lg">
                      {sections[currentSection].description}
                    </p>
                    <div className="flex flex-col gap-2 md:gap-3">
                      {sections[currentSection].facts.map((fact: string, i: number) => (
                        <div
                          key={i}
                          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 w-fit"
                        >
                          <span className="text-xs sm:text-sm font-mono text-cyan-300">{fact}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <EndSection />
      </div>

      <UIControls
        showControls={showControls}
        setShowControls={setShowControls}
        scrollProgress={scrollProgress}
        currentSection={currentSection}
        sections={sections}
        scrollToSection={scrollToSection}
      />
    </div>
  );
}