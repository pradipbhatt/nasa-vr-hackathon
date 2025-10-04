"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { CustomOrbitControls } from "./CustomOrbitControls";
import { Preloader } from "./Preloader";
import { ControlPanel } from "./ControlPanel";
import { TimelineControls } from "./TimelineControls";
import { DataChart } from "./DataChart";
import { temperatureData, dataLayers } from "./climateData";

const colors = {
  secondary: "rgba(15, 41, 82, 0.15)",
  accent: "rgba(56, 189, 248, 0.9)",
  accentGlow: "rgba(56, 189, 248, 0.3)",
  text: "rgba(226, 232, 240, 0.95)",
  textMuted: "rgba(148, 163, 184, 0.8)",
  border: "rgba(56, 189, 248, 0.15)",
  sliderTrack: "rgba(30, 41, 59, 0.2)",
};

/**
 * Main Climate Monitor component that orchestrates the 3D Earth visualization,
 * state management, and UI controls for climate data visualization.
 * 
 * This component manages:
 * - Three.js scene setup and rendering
 * - Loading states and progress
 * - Mobile responsiveness detection
 * - Auto-play functionality for timeline
 * - Draggable control panel
 * - Integration with sub-components for UI panels
 */
const ClimateMonitor = () => {
  // Core mounting and loading state
  const mountRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false); // Tracks if component is fully mounted
  const [loadingProgress, setLoadingProgress] = useState(0); // Progress for preloader (0-100)
  const [isLoading, setIsLoading] = useState(true); // Loading screen visibility

  // UI interaction state
  const [rotateEarth, setRotateEarth] = useState(true); // Controls Earth rotation animation
  const [isCollapsed, setIsCollapsed] = useState(false); // Control panel collapse state
  const [isDragging, setIsDragging] = useState(false); // Panel dragging state
  const [position, setPosition] = useState({ x: 0, y: 100 }); // Draggable panel position
  const [isMobile, setIsMobile] = useState(false); // Device type detection

  // Data and timeline state
  const [activeLayer, setActiveLayer] = useState('temperature'); // Current data visualization layer
  const [yearIndex, setYearIndex] = useState(temperatureData.length - 1); // Current year index in timeline
  const [isAutoPlay, setIsAutoPlay] = useState(false); // Auto-play timeline animation
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(1000); // Speed of auto-play (ms per year)
  const [showChart, setShowChart] = useState(false); // Toggle data trend chart visibility
  const [dataSource, setDataSource] = useState('NASA GISS'); // Data source attribution

  // Visualization control state
  const [earthSpeed, setEarthSpeed] = useState(0.05); // Earth rotation speed
  const [cloudSpeed, setCloudSpeed] = useState(0.1); // Cloud layer rotation speed
  const [glow, setGlow] = useState(1.5); // Atmospheric glow intensity
  const [atmosphereOpacity, setAtmosphereOpacity] = useState(0.3); // Atmosphere transparency
  const [cloudOpacity, setCloudOpacity] = useState(0.4); // Cloud layer transparency
  const [layerIntensity, setLayerIntensity] = useState(0.8); // Data layer visualization strength

  // Three.js rendering references
  const dragStartRef = useRef({ x: 0, y: 0 }); // Starting position for panel drag
  const autoPlayIntervalRef = useRef<number | null>(null); // Interval ID for auto-play
  const sceneRef = useRef<THREE.Scene | null>(null); // Three.js scene reference
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null); // Camera reference
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null); // Renderer reference
  const controlsRef = useRef<CustomOrbitControls | null>(null); // Orbit controls reference
  const earthRef = useRef<THREE.Mesh | null>(null); // Earth mesh reference
  const cloudsRef = useRef<THREE.Mesh | null>(null); // Clouds mesh reference
  const atmosphereRef = useRef<THREE.ShaderMaterial | null>(null); // Atmosphere shader material
  const cloudMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null); // Cloud material reference
  const dataLayerRef = useRef<THREE.Mesh | null>(null); // Data visualization layer mesh
  const animationIdRef = useRef<number>(0); // Animation frame request ID
  const texturesRef = useRef<THREE.Texture[]>([]); // Loaded textures for cleanup

  // Control values reference for smooth animation updates
  const controlValuesRef = useRef({
    earthSpeed,
    cloudSpeed,
    glow,
    atmosphereOpacity,
    cloudOpacity,
    rotateEarth,
    layerIntensity,
    currentValue: 0,
    activeLayer,
  });

  // Memoized values for performance optimization
  const loader = useMemo(() => new THREE.TextureLoader(), []); // Texture loader instance
  const currentData = useMemo(() => temperatureData[yearIndex], [yearIndex]); // Current year's data
  const currentLayerConfig = useMemo(() => 
    dataLayers.find(l => l.id === activeLayer) || dataLayers[0], 
    [activeLayer]
  ); // Current active layer configuration

  /**
   * Simulates loading progress for the preloader animation.
   * Increments progress randomly until 100%, then hides loading screen.
   */
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 500); // Delay to show completion
        setLoadingProgress(100);
      } else {
        progress = Math.min(100, progress + Math.random() * 15);
        setLoadingProgress(progress);
      }
    }, 200);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [setLoadingProgress, setIsLoading]);

  /**
   * Handles auto-play functionality for timeline progression.
   * Sets interval to advance year index at specified speed.
   */
  useEffect(() => {
    if (isAutoPlay) {
      autoPlayIntervalRef.current = window.setInterval(() => {
        setYearIndex((prev: number) => {
          if (prev >= temperatureData.length - 1) {
            setIsAutoPlay(false); // Stop at end of timeline
            return prev;
          }
          return prev + 1; // Advance to next year
        });
      }, autoPlaySpeed);
    } else {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current); // Stop auto-play
        autoPlayIntervalRef.current = null;
      }
    }
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current); // Cleanup on unmount or dependency change
      }
    };
  }, [isAutoPlay, autoPlaySpeed, setYearIndex, setIsAutoPlay]);

  /**
   * Initializes component mounting and sets up mobile detection.
   * Adds resize listener to detect device changes.
   */
  useEffect(() => {
    setIsMounted(true); // Mark component as mounted for rendering
    const checkMobile = () => setIsMobile(window.innerWidth < 768); // Detect mobile viewport
    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile); // Listen for viewport changes
    return () => window.removeEventListener('resize', checkMobile); // Cleanup listener
  }, [setIsMounted, setIsMobile]);

  /**
   * Updates control values reference whenever state changes.
   * Ensures smooth animation updates without re-renders.
   */
  useEffect(() => {
    controlValuesRef.current = {
      earthSpeed,
      cloudSpeed,
      glow,
      atmosphereOpacity,
      cloudOpacity,
      rotateEarth,
      layerIntensity,
      currentValue: currentData[currentLayerConfig.dataKey as keyof typeof currentData] as number,
      activeLayer,
    };
  }, [earthSpeed, cloudSpeed, glow, atmosphereOpacity, cloudOpacity, rotateEarth, layerIntensity, currentData, currentLayerConfig, activeLayer]);

  /**
   * Handles mouse down event for starting panel drag on desktop.
   */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMobile) return; // Disable drag on mobile
    e.stopPropagation(); // Prevent event bubbling
    setIsDragging(true); // Start dragging state
    dragStartRef.current = {
      x: e.clientX - position.x, // Calculate offset from current position
      y: e.clientY - position.y,
    };
  }, [position, isMobile, setIsDragging]);

  /**
   * Handles touch start event for starting panel drag on mobile.
   */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    const touch = e.touches[0]; // Get first touch point
    setIsDragging(true); // Start dragging state
    dragStartRef.current = {
      x: touch.clientX - position.x, // Calculate offset from current position
      y: touch.clientY - position.y,
    };
  }, [position, setIsDragging]);

  /**
   * Manages drag movement and end events for the control panel.
   * Handles both mouse and touch events for cross-device compatibility.
   */
  useEffect(() => {
    if (!isDragging) return; // Only run when dragging

    const handleMove = (clientX: number, clientY: number) => {
      requestAnimationFrame(() => {
        setPosition({
          x: clientX - dragStartRef.current.x, // Update position based on movement
          y: clientY - dragStartRef.current.y,
        });
      });
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };
    const handleEnd = () => setIsDragging(false); // End dragging

    // Add global event listeners for movement and end
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      // Cleanup event listeners
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, setPosition, setIsDragging]);

  /**
   * Navigate to previous year in timeline.
   */
  const handlePrevYear = useCallback(() => {
    setYearIndex((prev: number) => Math.max(0, prev - 1)); // Clamp to minimum index 0
  }, [setYearIndex]);

  /**
   * Navigate to next year in timeline.
   */
  const handleNextYear = useCallback(() => {
    setYearIndex((prev: number) => Math.min(temperatureData.length - 1, prev + 1)); // Clamp to maximum index
  }, [setYearIndex]);

  /**
   * Toggle auto-play state.
   */
  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlay(!isAutoPlay); // Simple toggle
  }, [isAutoPlay, setIsAutoPlay]);

  /**
   * Main Three.js scene setup and animation loop.
   * Handles texture loading, mesh creation, lighting, and continuous rendering.
   * Includes cleanup on unmount to prevent memory leaks.
   */
  useEffect(() => {
    if (!mountRef.current || !isMounted || isLoading) return; // Wait for mounting and loading complete
    const container = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45, // Field of view
      container.clientWidth / container.clientHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    camera.position.set(0, 0, 25); // Initial camera position
    cameraRef.current = camera;

    // Renderer setup with performance optimizations
    const renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio < 2, // Reduce antialiasing on high DPI for performance
      alpha: true, // Transparent background
      powerPreference: "high-performance", // Request high performance GPU context
      preserveDrawingBuffer: true // Preserve buffer for potential screenshots
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false; // Disable shadows for performance
    rendererRef.current = renderer;

    // Add canvas to container
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    // Orbit controls for camera manipulation
    const controls = new CustomOrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    // Lighting setup
    const dirLight = new THREE.DirectionalLight(0xffffff, 2); // White directional light
    dirLight.position.set(-50, 0, 30); // Position light
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6); // Soft ambient light
    scene.add(ambientLight);

    // Texture loading utility with error handling
    const loadTexture = (url: string, isSRGB = false) => {
      return new Promise<THREE.Texture>((resolve, reject) => {
        loader.load(
          url,
          (texture) => {
            if (isSRGB) texture.colorSpace = THREE.SRGBColorSpace; // Set color space for sRGB textures
            texture.minFilter = THREE.LinearMipmapLinearFilter; // Mipmap filtering for quality
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = true; // Generate mipmaps for distance rendering
            texturesRef.current.push(texture); // Track for cleanup
            resolve(texture);
          },
          undefined, // No progress callback
          reject // Error callback
        );
      });
    };

    // Load all required textures asynchronously
    Promise.all([
      loadTexture("/Albedo.jpg", true), // Earth surface texture
      loadTexture("/Bump.jpg"), // Bump map for surface detail
      loadTexture("/Clouds.png"), // Cloud coverage texture
      loadTexture("/night_lights_modified.png"), // Night lights emissive map
      loadTexture("/Gaia_EDR3_darkened.png") // Background skybox
    ]).then(([albedo, bump, cloudsTex, night, sky]) => {
      // Set skybox background
      sky.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = sky;

      const segments = isMobile ? 48 : 64; // Reduce segments on mobile for performance

      // Earth mesh creation
      const earthGeo = new THREE.SphereGeometry(10, segments, segments);
      const earthMat = new THREE.MeshStandardMaterial({
        map: albedo, // Base color texture
        bumpMap: bump, // Height map for surface relief
        bumpScale: 0.04, // Bump intensity
        roughness: 0.8, // Material roughness
        metalness: 0.2, // Material metalness
        emissiveMap: night, // Night lights emission
        emissive: new THREE.Color(0xffffcc), // Warm light color
        emissiveIntensity: 0.2, // Emission strength
      });
      const earth = new THREE.Mesh(earthGeo, earthMat);
      earthRef.current = earth;

      // Cloud layer mesh
      const cloudGeo = new THREE.SphereGeometry(10.05, segments, segments); // Slightly larger than Earth
      const cloudMat = new THREE.MeshStandardMaterial({
        map: cloudsTex,
        transparent: true, // Allow transparency for clouds
        opacity: controlValuesRef.current.cloudOpacity,
        depthWrite: false, // Prevent depth buffer writes for layering
        alphaTest: 0.05, // Alpha threshold for cloud visibility
      });
      const clouds = new THREE.Mesh(cloudGeo, cloudMat);
      cloudsRef.current = clouds;
      cloudMaterialRef.current = cloudMat;

      // Data visualization layer (shader-based)
      const layerGeo = new THREE.SphereGeometry(10.08, segments, segments); // Larger than clouds
      const layerMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal); // Transform normal to view space
            vUv = uv; // Pass UV coordinates
            vPosition = position; // Pass world position
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float dataValue; // Current data value for visualization
          uniform float intensity; // Visualization intensity
          uniform vec3 coldColor; // Color for low values
          uniform vec3 warmColor; // Color for medium values
          uniform vec3 hotColor; // Color for high values
          uniform float minRange; // Minimum data range
          uniform float maxRange; // Maximum data range
          
          void main() {
            float latitude = abs(vUv.y - 0.5) * 2.0; // Calculate latitude from UV
            float oceanMask = smoothstep(0.3, 0.7, latitude); // Mask for ocean areas
            
            float normalizedValue = (dataValue - minRange) / (maxRange - minRange);
            normalizedValue = clamp(normalizedValue, 0.0, 1.0); // Normalize to 0-1 range
            
            vec3 color; // Final fragment color
            if (normalizedValue < 0.5) {
              color = mix(coldColor / 255.0, warmColor / 255.0, normalizedValue * 2.0); // Interpolate cold to warm
            } else {
              color = mix(warmColor / 255.0, hotColor / 255.0, (normalizedValue - 0.5) * 2.0); // Interpolate warm to hot
            }
            
            float variation = sin(vUv.x * 20.0) * cos(vUv.y * 20.0) * 0.1; // Add procedural noise
            color += variation; // Apply variation for texture
            
            float alpha = oceanMask * intensity * 0.6; // Calculate transparency based on ocean mask
            
            gl_FragColor = vec4(color, alpha); // Output final color with alpha
          }
        `,
        uniforms: {
          dataValue: { value: controlValuesRef.current.currentValue }, // Bind current data value
          intensity: { value: controlValuesRef.current.layerIntensity }, // Bind intensity
          coldColor: { value: new THREE.Vector3(...currentLayerConfig.color.cold) }, // Bind color palette
          warmColor: { value: new THREE.Vector3(...currentLayerConfig.color.warm) },
          hotColor: { value: new THREE.Vector3(...currentLayerConfig.color.hot) },
          minRange: { value: currentLayerConfig.range[0] }, // Bind data range
          maxRange: { value: currentLayerConfig.range[1] },
        },
        transparent: true, // Enable transparency
        blending: THREE.AdditiveBlending, // Additive blending for glow effect
        depthWrite: false, // No depth writing for layering
        side: THREE.DoubleSide, // Render both sides of geometry
      });
      const layer = new THREE.Mesh(layerGeo, layerMaterial);
      dataLayerRef.current = layer;

      // Atmosphere glow effect
      const atmosGeo = new THREE.SphereGeometry(12, segments, segments); // Larger sphere for atmosphere
      const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal); // Transform normal
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); // Model-view position
            vViewPosition = -mvPosition.xyz; // View position for fragment shader
            gl_Position = projectionMatrix * mvPosition; // Final position
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          uniform float glowIntensity; // Glow strength
          uniform float opacity; // Base opacity
          
          void main() {
            float intensity = pow(0.8 - dot(vNormal, normalize(vViewPosition)), glowIntensity); // Calculate glow based on angle
            vec3 glowColor = vec3(0.2, 0.6, 1.0); // Blue atmospheric glow
            gl_FragColor = vec4(glowColor, opacity * intensity); // Output with calculated opacity
          }
        `,
        uniforms: {
          glowIntensity: { value: controlValuesRef.current.glow }, // Bind glow intensity
          opacity: { value: controlValuesRef.current.atmosphereOpacity }, // Bind opacity
        },
        blending: THREE.AdditiveBlending, // Additive for glow effect
        side: THREE.BackSide, // Render back side for atmosphere effect
        transparent: true,
        depthWrite: false,
      });
      const atmosMesh = new THREE.Mesh(atmosGeo, atmosphereMaterial);
      atmosphereRef.current = atmosphereMaterial;

      // Group all Earth elements together
      const group = new THREE.Group();
      group.rotation.z = (23.5 / 360) * 2 * Math.PI; // Earth's axial tilt
      group.add(earth, clouds, layer, atmosMesh); // Add all layers to group
      scene.add(group); // Add group to scene
    }).catch(console.error); // Handle texture loading errors

    // Animation loop with FPS limiting for performance
    let lastTime = 0;
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastTime;

      if (elapsed > frameTime) { // Only update at target FPS
        lastTime = currentTime - (elapsed % frameTime); // Adjust timing

        const controls = controlValuesRef.current; // Get current control values

        // Rotate Earth and clouds if enabled
        if (controls.rotateEarth && earthRef.current && cloudsRef.current) {
          const delta = frameTime / 1000; // Time delta for smooth animation
          earthRef.current.rotation.y += delta * controls.earthSpeed; // Rotate Earth
          cloudsRef.current.rotation.y += delta * controls.cloudSpeed * 1.2; // Rotate clouds faster
          if (dataLayerRef.current) {
            dataLayerRef.current.rotation.y = earthRef.current.rotation.y; // Sync data layer with Earth
          }
        }

        // Update atmosphere shader uniforms
        if (atmosphereRef.current) {
          atmosphereRef.current.uniforms.glowIntensity.value = controls.glow;
          atmosphereRef.current.uniforms.opacity.value = controls.atmosphereOpacity;
        }

        // Update cloud material opacity
        if (cloudMaterialRef.current) {
          cloudMaterialRef.current.opacity = controls.cloudOpacity;
        }

        // Update data layer shader uniforms
        if (dataLayerRef.current) {
          const material = dataLayerRef.current.material as THREE.ShaderMaterial;
          material.uniforms.dataValue.value = controls.currentValue; // Update data value
          material.uniforms.intensity.value = controls.layerIntensity; // Update intensity
          
          const layerConfig = dataLayers.find(l => l.id === controls.activeLayer) || dataLayers[0];
          // Update color uniforms based on active layer
          material.uniforms.coldColor.value = new THREE.Vector3(...layerConfig.color.cold);
          material.uniforms.warmColor.value = new THREE.Vector3(...layerConfig.color.warm);
          material.uniforms.hotColor.value = new THREE.Vector3(...layerConfig.color.hot);
          material.uniforms.minRange.value = layerConfig.range[0];
          material.uniforms.maxRange.value = layerConfig.range[1];
        }

        // Update orbit controls
        controlsRef.current?.update();
        // Render scene
        rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
      }

      animationIdRef.current = requestAnimationFrame(animate); // Continue animation loop
    };
    animate(0); // Start animation

    // Handle window resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      cameraRef.current!.aspect = width / height; // Update aspect ratio
      cameraRef.current!.updateProjectionMatrix(); // Update projection
      rendererRef.current!.setSize(width, height); // Update renderer size
    };

    window.addEventListener("resize", handleResize); // Listen for resize events

    // Cleanup function on unmount
    return () => {
      cancelAnimationFrame(animationIdRef.current); // Stop animation

      // Dispose textures
      texturesRef.current.forEach(texture => texture.dispose());
      texturesRef.current = [];

      // Traverse scene and dispose geometries/materials
      sceneRef.current?.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose(); // Dispose geometry
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose()); // Dispose array of materials
          } else {
            object.material?.dispose(); // Dispose single material
          }
        }
      });

      // Dispose controls and renderer
      controlsRef.current?.dispose();
      rendererRef.current?.dispose();

      // Clear references
      earthRef.current = null;
      cloudsRef.current = null;
      atmosphereRef.current = null;
      cloudMaterialRef.current = null;
      dataLayerRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;

      window.removeEventListener("resize", handleResize); // Remove resize listener

      // Remove canvas from container
      if (container.contains(rendererRef.current!.domElement)) {
        container.removeChild(rendererRef.current!.domElement);
      }
    };
  }, [isMounted, isMobile, loader, isLoading, currentLayerConfig, setIsLoading, setIsMounted, setIsMobile]);

  /**
   * Calculates dynamic positioning style for the control panel.
   * Handles both mobile and desktop layouts with dragging support.
   */
  const panelStyle = useMemo(() => {
    if (!isMounted) return { right: '16px', top: '140px' }; // Default position when not mounted

    if (isMobile) {
      return {
        left: '50%',
        top: isCollapsed ? 'auto' : '50%', // Center vertically when expanded
        bottom: isCollapsed ? '1rem' : 'auto', // Bottom position when collapsed
        transform: isCollapsed ? 'translateX(-50%)' : 'translate(-50%, -50%)', // Center alignment
        width: isCollapsed ? 'auto' : 'calc(100vw - 2rem)', // Full width on mobile when expanded
        maxWidth: isCollapsed ? 'none' : '340px', // Max width constraint
      };
    }

    // Desktop dragging position
    return {
      right: `${Math.max(16, window.innerWidth - position.x - 260)}px`, // Calculate right position with bounds
      top: `${Math.max(140, position.y)}px`, // Calculate top position with bounds
      transform: 'none', // No transform for dragging
    };
  }, [isMounted, isMobile, isCollapsed, position]);

  // Render loading screen if still loading
  if (isLoading) {
    return <Preloader progress={loadingProgress} />;
  }

  // Render placeholder if not mounted
  if (!isMounted) {
    return <div className="relative w-full h-screen overflow-hidden bg-black" />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ marginTop: '80px' }}>
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full absolute inset-0" />
      
      {/* Header Title and Info */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 text-center pointer-events-none">
        <h1 
          className="text-2xl md:text-3xl font-light tracking-wide" 
          style={{ 
            color: colors.accent,
            textShadow: '0 0 10px rgba(0,0,0,0.7)' // Add shadow for better readability
          }}
        >
          Earth Climate Monitor
        </h1>
        <p className="text-sm mt-1" style={{ color: colors.text }}>
          Multi-Layer Ocean Data Visualization • 1880-2035
        </p>
        <p className="text-xs mt-1 opacity-70" style={{ color: colors.textMuted }}>
          Data Source: {dataSource}
        </p>
      </div>
      
      {/* Control Panel Component */}
      <ControlPanel
        isMobile={isMobile}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isDragging={isDragging}
        panelStyle={panelStyle}
        handleMouseDown={handleMouseDown}
        handleTouchStart={handleTouchStart}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        rotateEarth={rotateEarth}
        setRotateEarth={setRotateEarth}
        showChart={showChart}
        setShowChart={setShowChart}
        earthSpeed={earthSpeed}
        setEarthSpeed={setEarthSpeed}
        cloudSpeed={cloudSpeed}
        setCloudSpeed={setCloudSpeed}
        glow={glow}
        setGlow={setGlow}
        atmosphereOpacity={atmosphereOpacity}
        setAtmosphereOpacity={setAtmosphereOpacity}
        cloudOpacity={cloudOpacity}
        setCloudOpacity={setCloudOpacity}
        layerIntensity={layerIntensity}
        setLayerIntensity={setLayerIntensity}
      />
      
      {/* Data Chart Component */}
      <DataChart
        showChart={showChart}
        setShowChart={setShowChart}
        currentLayerConfig={currentLayerConfig}
        yearIndex={yearIndex}
      />
      
      {/* Timeline Controls Component */}
      <TimelineControls
        yearIndex={yearIndex}
        setYearIndex={setYearIndex}
        isAutoPlay={isAutoPlay}
        toggleAutoPlay={toggleAutoPlay}
        handlePrevYear={handlePrevYear}
        handleNextYear={handleNextYear}
        currentData={currentData}
        currentLayerConfig={currentLayerConfig}
      />
    </div>
  );
};

export default ClimateMonitor;