"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// SVG Icons - Clean and minimal
const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5,3 19,12 5,21"></polygon>
  </svg>
);

const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const CameraIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const CloudIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
  </svg>
);

const ZapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const LayersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 17 12 22 22 17"></polyline>
    <polyline points="2 12 12 17 22 12"></polyline>
  </svg>
);

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

// Theme colors - Glassmorphism for sidebar only
const colors = {
  primary: "#0a0a0f",
  secondary: "rgba(15, 41, 82, 0.15)",
  accent: "rgba(56, 189, 248, 0.9)",
  accentGlow: "rgba(56, 189, 248, 0.3)",
  text: "rgba(226, 232, 240, 0.95)",
  textMuted: "rgba(148, 163, 184, 0.8)",
  border: "rgba(56, 189, 248, 0.15)",
  sliderTrack: "rgba(30, 41, 59, 0.2)",
};

// Ultra Compact Control Slider Component
const ControlSlider = ({ 
  value, 
  setValue, 
  min = 0, 
  max = 1, 
  step = 0.01,
  icon: Icon, 
  label,
  formatMax = 1
}: { 
  value: number; 
  setValue: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  icon: React.ComponentType;
  label: string;
  formatMax?: number;
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-500/5 transition-all duration-150 group">
      <div className="flex-shrink-0 p-1.5 rounded-md group-hover:scale-105 transition-transform duration-150 backdrop-blur-sm" 
           style={{ backgroundColor: 'rgba(15, 41, 82, 0.2)' }}>
        <Icon />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium truncate" style={{ color: colors.text }}>
            {label}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded font-mono transition-all duration-150 backdrop-blur-sm" 
                style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: colors.accent }}>
            {Math.round((value / formatMax) * 100)}%
          </span>
        </div>
        
        <div className="relative">
          <div className="h-1 rounded-full backdrop-blur-sm" style={{ backgroundColor: colors.sliderTrack }}>
            <div
              className="h-1 rounded-full transition-all duration-200 ease-out"
              style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.accentGlow} 100%)`,
                boxShadow: `0 0 6px ${colors.accentGlow}`
              }}
            />
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

const HeroContent = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // UI State with minimal defaults
  const [rotateEarth, setRotateEarth] = useState(true);
  
  // Control values with minimal defaults
  const [earthSpeed, setEarthSpeed] = useState(0.05);
  const [cloudSpeed, setCloudSpeed] = useState(0.1);
  const [glow, setGlow] = useState(1.5);
  const [atmosphereOpacity, setAtmosphereOpacity] = useState(0.3);
  const [cloudOpacity, setCloudOpacity] = useState(0.4);

  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const atmosphereRef = useRef<THREE.ShaderMaterial | null>(null);
  const cloudMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const animationIdRef = useRef<number>(0);

  // Control refs for animation loop
  const controlValuesRef = useRef({
    earthSpeed: 0.05,
    cloudSpeed: 0.1,
    glow: 1.5,
    atmosphereOpacity: 0.3,
    cloudOpacity: 0.4,
    rotateEarth: true
  });

  // Memoize TextureLoader
  const loader = useMemo(() => new THREE.TextureLoader(), []);

  // Single effect to sync all state values
  useEffect(() => {
    controlValuesRef.current = {
      earthSpeed,
      cloudSpeed,
      glow,
      atmosphereOpacity,
      cloudOpacity,
      rotateEarth
    };
  }, [earthSpeed, cloudSpeed, glow, atmosphereOpacity, cloudOpacity, rotateEarth]);

  // Handle screenshot
  const handleScreenshot = useCallback(() => {
    if (mountRef.current && rendererRef.current) {
      const canvas = rendererRef.current.domElement;
      try {
        const link = document.createElement("a");
        link.download = "earth-visualization.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (error) {
        console.error("Failed to capture screenshot:", error);
      }
    }
  }, []);

  // Three.js initialization and animation
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // Scene setup - NO background color here, let Three.js handle it
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight, // Full width now
      0.1,
      1000
    );
    camera.position.set(0, 0, 25);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    });
    // Full screen renderer - no sidebar space deduction
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    
    // Full screen canvas
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    // Enhanced OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI;
    controlsRef.current = controls;

    // Optimized Lighting
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(-50, 0, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Load textures from public folder
    const albedo = loader.load("/Albedo.jpg");
    const bump = loader.load("/Bump.jpg");
    const cloudsTex = loader.load("/Clouds.png");
    const night = loader.load("/night_lights_modified.png");
    const sky = loader.load("/Gaia_EDR3_darkened.png");

    // Set texture properties
    albedo.colorSpace = THREE.SRGBColorSpace;
    sky.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = sky;

    // Earth geometry and material
    const earthGeo = new THREE.SphereGeometry(10, 96, 96);
    const earthMat = new THREE.MeshStandardMaterial({
      map: albedo,
      bumpMap: bump,
      bumpScale: 0.04,
      roughness: 0.8,
      metalness: 0.2,
      emissiveMap: night,
      emissive: new THREE.Color(0xffffcc),
      emissiveIntensity: 0.2,
    });

    const earth = new THREE.Mesh(earthGeo, earthMat);
    earthRef.current = earth;

    // Clouds
    const cloudGeo = new THREE.SphereGeometry(10.05, 96, 96);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudsTex,
      transparent: true,
      opacity: controlValuesRef.current.cloudOpacity,
      depthWrite: false,
      alphaTest: 0.05,
    });

    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    cloudsRef.current = clouds;
    cloudMaterialRef.current = cloudMat;

    // Atmosphere
    const atmosGeo = new THREE.SphereGeometry(12, 96, 96);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        uniform float glowIntensity;
        uniform float opacity;
        
        void main() {
          float intensity = pow(0.8 - dot(vNormal, normalize(vViewPosition)), glowIntensity);
          vec3 glowColor = vec3(0.2, 0.6, 1.0);
          gl_FragColor = vec4(glowColor, opacity * intensity);
        }
      `,
      uniforms: {
        glowIntensity: { value: controlValuesRef.current.glow },
        opacity: { value: controlValuesRef.current.atmosphereOpacity },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });

    const atmosMesh = new THREE.Mesh(atmosGeo, atmosphereMaterial);
    atmosphereRef.current = atmosphereMaterial;

    // Group
    const group = new THREE.Group();
    group.rotation.z = (23.5 / 360) * 2 * Math.PI;
    group.add(earth, clouds, atmosMesh);
    scene.add(group);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const controls = controlValuesRef.current;
      
      if (controls.rotateEarth && earthRef.current && cloudsRef.current) {
        earthRef.current.rotation.y += delta * controls.earthSpeed;
        cloudsRef.current.rotation.y += delta * controls.cloudSpeed * 1.2;
      }

      if (atmosphereRef.current) {
        atmosphereRef.current.uniforms.glowIntensity.value = controls.glow;
        atmosphereRef.current.uniforms.opacity.value = controls.atmosphereOpacity;
      }
      
      if (cloudMaterialRef.current) {
        cloudMaterialRef.current.opacity = controls.cloudOpacity;
      }

      controlsRef.current?.update();
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize handler - full screen
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationIdRef.current);
      
      controlsRef.current?.dispose();
      rendererRef.current?.dispose();
      
      earthRef.current = null;
      cloudsRef.current = null;
      atmosphereRef.current = null;
      cloudMaterialRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      
      window.removeEventListener("resize", handleResize);
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    // Main container - NO background color, completely transparent
    <div className="relative w-full h-screen overflow-hidden">
      {/* Three.js Canvas Container - Full screen, no styling interference */}
      <div ref={mountRef} className="w-full h-full absolute inset-0" />
      
      {/* Minimal Hero Title */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 text-center">
        <h1 className="text-2xl font-light tracking-wide" style={{ color: colors.accent }}>
          Earth
        </h1>
        <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
          3D Visualizer
        </p>
      </div>
      
      {/* Glassmorphism Sidebar Only - Right Side, Compact */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 h-3/4 w-60 z-40 rounded-xl border backdrop-blur-2xl"
        style={{
          backgroundColor: colors.secondary, // Glass effect ONLY on sidebar
          borderColor: colors.border,
          boxShadow: '0 4px 20px rgba(56, 189, 248, 0.05)',
        }}
      >
        <div className="h-full flex flex-col">
          {/* Minimal Header */}
          <div className="flex items-center gap-2 p-4 border-b" style={{ borderColor: colors.border }}>
            <div className="p-1.5 rounded-md backdrop-blur-sm" style={{ backgroundColor: 'rgba(15, 41, 82, 0.2)' }}>
              <GlobeIcon />
            </div>
            <div>
              <h2 className="text-sm font-medium" style={{ color: colors.text }}>
                Controls
              </h2>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-z">
            <div className="px-4 space-y-3 mt-4">
              {/* Minimal Play/Pause Button */}
              <button
                onClick={() => setRotateEarth(!rotateEarth)}
                className="w-full py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium border hover:scale-[1.02] backdrop-blur-sm"
                style={{ 
                  backgroundColor: rotateEarth ? colors.accent : 'rgba(15, 41, 82, 0.2)',
                  borderColor: colors.accent,
                  color: colors.text,
                }}
              >
                {rotateEarth ? (
                  <>
                    <PauseIcon />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayIcon />
                    Play
                  </>
                )}
              </button>

              {/* Ultra Compact Control Sliders */}
              <div className="space-y-2">
                <ControlSlider 
                  value={earthSpeed} 
                  setValue={setEarthSpeed}
                  icon={GlobeIcon}
                  label="Rotation"
                />
                
                <ControlSlider 
                  value={cloudSpeed} 
                  setValue={setCloudSpeed}
                  icon={CloudIcon}
                  label="Clouds"
                />
                
                <ControlSlider 
                  value={glow} 
                  setValue={setGlow}
                  min={0}
                  max={10}
                  step={0.1}
                  icon={ZapIcon}
                  label="Glow"
                  formatMax={10}
                />
                
                <ControlSlider 
                  value={atmosphereOpacity} 
                  setValue={setAtmosphereOpacity}
                  icon={LayersIcon}
                  label="Atmosphere"
                />
                
                <ControlSlider 
                  value={cloudOpacity} 
                  setValue={setCloudOpacity}
                  icon={SunIcon}
                  label="Cloud Cover"
                />
              </div>

              {/* Minimal Screenshot Button */}
              <button
                onClick={handleScreenshot}
                className="w-full py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium border hover:scale-[1.02] mt-3 backdrop-blur-sm"
                style={{ 
                  backgroundColor: 'rgba(15, 41, 82, 0.2)',
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                <CameraIcon />
                Screenshot
              </button>

              {/* Minimal Instructions */}
              <div className="pt-3 border-t" style={{ borderColor: colors.border }}>
                <div className="text-xs space-y-1 text-center" style={{ color: colors.textMuted }}>
                  <div>Drag · Scroll · Explore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra Minimal Status Indicator */}
      <div className="fixed bottom-4 right-4 px-3 py-1.5 rounded-lg border text-xs backdrop-blur-xl"
        style={{
          backgroundColor: 'rgba(15, 41, 82, 0.15)',
          borderColor: colors.border,
          color: colors.textMuted,
        }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.accent }}></div>
          <span>Live</span>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 1.5px;
          transition: all 0.2s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${colors.accent};
        }
      `}</style>
    </div>
  );
};

export default HeroContent;