"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { CustomOrbitControls } from "./CustomOrbitControls";
import { Preloader } from "./Preloader";
import { ControlPanel } from "./ControlPanel";
import { TimelineControls } from "./TimelineControls";
import { DataChart } from "./DataChart";
import { temperatureData, dataLayers } from "./climateData";

// Separate shader code for better organization
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  
  uniform float glowIntensity;
  uniform float opacity;
  uniform float time;
  uniform float dataValue;
  uniform float minRange;
  uniform float maxRange;
  uniform float earthRotation;
  uniform vec3 sunDirection;

  // Improved noise function for more organic patterns
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Fractional Brownian Motion for more natural patterns
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }

  // Calculate latitude and longitude from world position
  vec2 getLatLon(vec3 worldPos) {
    vec3 normalizedPos = normalize(worldPos);
    float latitude = asin(normalizedPos.y) / 3.14159;
    float longitude = atan(normalizedPos.z, normalizedPos.x) / 3.14159;
    return vec2(latitude, longitude);
  }

  void main() {
    // Calculate base glow with softer falloff
    float viewDot = dot(vNormal, normalize(vViewPosition));
    float baseIntensity = pow(1.0 - abs(viewDot), glowIntensity * 0.3);
    
    // Get latitude/longitude for position-based effects
    vec2 latLon = getLatLon(vWorldPosition);
    float latitude = abs(latLon.x);
    float longitude = latLon.y;
    
    // Rotate UV coordinates with Earth rotation for moving patterns
    float rotationAngle = earthRotation * 3.14159 * 2.0;
    vec2 rotatedUV = vec2(
      vUv.x * cos(rotationAngle) - vUv.y * sin(rotationAngle),
      vUv.x * sin(rotationAngle) + vUv.y * cos(rotationAngle)
    );
    
    // Create multiple layers of animated noise
    vec2 noiseUV1 = rotatedUV * 8.0 + vec2(time * 0.05, time * 0.03);
    vec2 noiseUV2 = rotatedUV * 15.0 + vec2(time * -0.03, time * 0.07);
    vec2 noiseUV3 = rotatedUV * 25.0 + vec2(time * 0.02, time * -0.05);
    
    float noise1 = fbm(noiseUV1);
    float noise2 = fbm(noiseUV2);
    float noise3 = fbm(noiseUV3);
    
    // Combine noise layers
    float combinedNoise = (noise1 * 0.6 + noise2 * 0.3 + noise3 * 0.1);
    
    // Day/night cycle effect based on sun position
    float sunDot = dot(normalize(vWorldPosition), sunDirection);
    float dayNight = smoothstep(-0.2, 0.2, sunDot);
    
    // Latitude-based variations (subtle polar enhancements)
    float polarEffect = smoothstep(0.6, 0.9, latitude);
    float equatorialEffect = 1.0 - smoothstep(0.0, 0.3, latitude);
    
    // Climate data modulation
    float normalizedData = (dataValue - minRange) / (maxRange - minRange);
    normalizedData = clamp(normalizedData, 0.0, 1.0);
    
    // Dynamic intensity calculation
    float dynamicIntensity = baseIntensity;
    
    // Apply noise modulation
    dynamicIntensity *= (0.7 + 0.6 * combinedNoise);
    
    // Apply day/night cycle (brighter on day side)
    dynamicIntensity *= (0.8 + 0.4 * dayNight);
    
    // Apply latitude variations
    dynamicIntensity *= (1.0 + polarEffect * 0.3);
    dynamicIntensity *= (1.0 + equatorialEffect * 0.2);
    
    // Apply climate data influence
    dynamicIntensity *= (0.8 + 0.4 * normalizedData);
    
    // Pulsating effect
    float pulse = 0.9 + 0.1 * sin(time * 0.8);
    dynamicIntensity *= pulse;
    
    // Dynamic color variation
    vec3 baseGlow = vec3(0.1, 0.4, 0.8); // Deep blue
    vec3 auroraColor = vec3(0.2, 0.8, 0.9); // Cyan/aurora
    vec3 warmGlow = vec3(0.8, 0.9, 1.0); // Warm white-blue
    
    // Color based on position and data
    float colorMix = combinedNoise * 0.5 + normalizedData * 0.3 + polarEffect * 0.2;
    vec3 finalColor = mix(baseGlow, auroraColor, colorMix);
    
    // Add warm tint on day side
    finalColor = mix(finalColor, warmGlow, dayNight * 0.3);
    
    // Enhanced polar colors
    finalColor = mix(finalColor, auroraColor, polarEffect * 0.4);
    
    // Final opacity with multiple factors
    float finalOpacity = opacity * dynamicIntensity;
    
    gl_FragColor = vec4(finalColor, finalOpacity);
  }
`;

const dataLayerVertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const dataLayerFragmentShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  uniform float dataValue;
  uniform float intensity;
  uniform vec3 coldColor;
  uniform vec3 warmColor;
  uniform vec3 hotColor;
  uniform float minRange;
  uniform float maxRange;
  
  void main() {
    float latitude = abs(vUv.y - 0.5) * 2.0;
    float oceanMask = smoothstep(0.3, 0.7, latitude);
    
    float normalizedValue = (dataValue - minRange) / (maxRange - minRange);
    normalizedValue = clamp(normalizedValue, 0.0, 1.0);
    
    vec3 color;
    if (normalizedValue < 0.5) {
      color = mix(coldColor / 255.0, warmColor / 255.0, normalizedValue * 2.0);
    } else {
      color = mix(warmColor / 255.0, hotColor / 255.0, (normalizedValue - 0.5) * 2.0);
    }
    
    float variation = sin(vUv.x * 20.0) * cos(vUv.y * 20.0) * 0.1;
    color += variation;
    
    float alpha = oceanMask * intensity * 0.6;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

const colors = {
  secondary: "rgba(15, 41, 82, 0.15)",
  accent: "rgba(56, 189, 248, 0.9)",
  accentGlow: "rgba(56, 189, 248, 0.3)",
  text: "rgba(226, 232, 240, 0.95)",
  textMuted: "rgba(148, 163, 184, 0.8)",
  border: "rgba(56, 189, 248, 0.15)",
  sliderTrack: "rgba(30, 41, 59, 0.2)",
};

const ClimateMonitor = () => {
  // Core mounting and loading state
  const mountRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // UI interaction state
  const [rotateEarth, setRotateEarth] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 100 });
  const [isMobile, setIsMobile] = useState(false);

  // Data and timeline state
  const [activeLayer, setActiveLayer] = useState('temperature');
  const [yearIndex, setYearIndex] = useState(temperatureData.length - 1);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(1000);
  const [showChart, setShowChart] = useState(false);
  const [dataSource, setDataSource] = useState('NASA GISS');

  // Visualization control state
  const [earthSpeed, setEarthSpeed] = useState(0.05);
  const [cloudSpeed, setCloudSpeed] = useState(0.1);
  const [glow, setGlow] = useState(1.5);
  const [atmosphereOpacity, setAtmosphereOpacity] = useState(0.3);
  const [cloudOpacity, setCloudOpacity] = useState(0.4);
  const [layerIntensity, setLayerIntensity] = useState(0.8);

  // Three.js rendering references
  const dragStartRef = useRef({ x: 0, y: 0 });
  const autoPlayIntervalRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<CustomOrbitControls | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const atmosphereRef = useRef<THREE.ShaderMaterial | null>(null);
  const cloudMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const dataLayerRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number>(0);
  const texturesRef = useRef<THREE.Texture[]>([]);

  // Sun direction for realistic lighting
  const sunDirectionRef = useRef(new THREE.Vector3(1, 0, 0));

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
    earthRotation: 0,
  });

  // Memoized values for performance optimization
  const loader = useMemo(() => new THREE.TextureLoader(), []);
  const currentData = useMemo(() => temperatureData[yearIndex], [yearIndex]);
  const currentLayerConfig = useMemo(() => 
    dataLayers.find(l => l.id === activeLayer) || dataLayers[0], 
    [activeLayer]
  );

  // Simulate loading progress
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 500);
        setLoadingProgress(100);
      } else {
        progress = Math.min(100, progress + Math.random() * 15);
        setLoadingProgress(progress);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [setLoadingProgress, setIsLoading]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay) {
      autoPlayIntervalRef.current = window.setInterval(() => {
        setYearIndex((prev: number) => {
          if (prev >= temperatureData.length - 1) {
            setIsAutoPlay(false);
            return prev;
          }
          return prev + 1;
        });
      }, autoPlaySpeed);
    } else {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    }
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isAutoPlay, autoPlaySpeed, setYearIndex, setIsAutoPlay]);

  // Initialize component mounting and mobile detection
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMounted, setIsMobile]);

  // Update control values reference
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
      earthRotation: controlValuesRef.current.earthRotation, // Preserve rotation
    };
  }, [earthSpeed, cloudSpeed, glow, atmosphereOpacity, cloudOpacity, rotateEarth, layerIntensity, currentData, currentLayerConfig, activeLayer]);

  // Drag handling
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [position, isMobile, setIsDragging]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  }, [position, setIsDragging]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (clientX: number, clientY: number) => {
      requestAnimationFrame(() => {
        setPosition({
          x: clientX - dragStartRef.current.x,
          y: clientY - dragStartRef.current.y,
        });
      });
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };
    const handleEnd = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, setPosition, setIsDragging]);

  // Navigation callbacks
  const handlePrevYear = useCallback(() => {
    setYearIndex((prev: number) => Math.max(0, prev - 1));
  }, [setYearIndex]);

  const handleNextYear = useCallback(() => {
    setYearIndex((prev: number) => Math.min(temperatureData.length - 1, prev + 1));
  }, [setYearIndex]);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlay(!isAutoPlay);
  }, [isAutoPlay, setIsAutoPlay]);

  // Main Three.js scene setup
  useEffect(() => {
    if (!mountRef.current || !isMounted || isLoading) return;
    const container = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 25);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio < 2,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false;
    rendererRef.current = renderer;

    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    // Orbit controls
    const controls = new CustomOrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    // Lighting setup
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(-50, 0, 30);
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Texture loading
    const loadTexture = (url: string, isSRGB = false) => {
      return new Promise<THREE.Texture>((resolve, reject) => {
        loader.load(
          url,
          (texture) => {
            if (isSRGB) texture.colorSpace = THREE.SRGBColorSpace;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = true;
            texturesRef.current.push(texture);
            resolve(texture);
          },
          undefined,
          reject
        );
      });
    };

    Promise.all([
      loadTexture("/Albedo.jpg", true),
      loadTexture("/Bump.jpg"),
      loadTexture("/Clouds.png"),
      loadTexture("/night_lights_modified.png"),
      loadTexture("/sky.jpg")
    ]).then(([albedo, bump, cloudsTex, night, sky]) => {
      // Set skybox
      sky.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = sky;

      const segments = isMobile ? 48 : 64;

      // Earth mesh
      const earthGeo = new THREE.SphereGeometry(10, segments, segments);
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

      // Cloud layer
      const cloudGeo = new THREE.SphereGeometry(10.05, segments, segments);
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

      // Data visualization layer
      const layerGeo = new THREE.SphereGeometry(10.08, segments, segments);
      const layerMaterial = new THREE.ShaderMaterial({
        vertexShader: dataLayerVertexShader,
        fragmentShader: dataLayerFragmentShader,
        uniforms: {
          dataValue: { value: controlValuesRef.current.currentValue },
          intensity: { value: controlValuesRef.current.layerIntensity },
          coldColor: { value: new THREE.Vector3(...currentLayerConfig.color.cold) },
          warmColor: { value: new THREE.Vector3(...currentLayerConfig.color.warm) },
          hotColor: { value: new THREE.Vector3(...currentLayerConfig.color.hot) },
          minRange: { value: currentLayerConfig.range[0] },
          maxRange: { value: currentLayerConfig.range[1] },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const layer = new THREE.Mesh(layerGeo, layerMaterial);
      dataLayerRef.current = layer;

      // Enhanced atmosphere glow with rotation support
      const atmosGeo = new THREE.SphereGeometry(12, segments, segments);
      const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        uniforms: {
          glowIntensity: { value: controlValuesRef.current.glow },
          opacity: { value: controlValuesRef.current.atmosphereOpacity },
          time: { value: 0.0 },
          dataValue: { value: controlValuesRef.current.currentValue },
          minRange: { value: currentLayerConfig.range[0] },
          maxRange: { value: currentLayerConfig.range[1] },
          earthRotation: { value: 0.0 },
          sunDirection: { value: sunDirectionRef.current },
        },
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      });
      const atmosMesh = new THREE.Mesh(atmosGeo, atmosphereMaterial);
      atmosphereRef.current = atmosphereMaterial;

      // Group all Earth elements
      const group = new THREE.Group();
      group.rotation.z = (23.5 / 360) * 2 * Math.PI;
      group.add(earth, clouds, layer, atmosMesh);
      scene.add(group);

    }).catch(console.error);

    // Animation loop
    let lastTime = 0;
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastTime;

      if (elapsed > frameTime) {
        lastTime = currentTime - (elapsed % frameTime);

        const controls = controlValuesRef.current;

        // Track Earth rotation for the shader
        if (controls.rotateEarth && earthRef.current && cloudsRef.current) {
          const delta = frameTime / 1000;
          earthRef.current.rotation.y += delta * controls.earthSpeed;
          cloudsRef.current.rotation.y += delta * controls.cloudSpeed * 1.2;
          
          // Update rotation uniform for atmosphere shader
          controls.earthRotation = earthRef.current.rotation.y / (2 * Math.PI);
          
          if (dataLayerRef.current) {
            dataLayerRef.current.rotation.y = earthRef.current.rotation.y;
          }
        }

        // Update sun direction for realistic day/night cycle
        if (earthRef.current) {
          const rotation = earthRef.current.rotation.y;
          sunDirectionRef.current.set(
            Math.cos(rotation),
            0,
            Math.sin(rotation)
          ).normalize();
        }

        // Update atmosphere shader uniforms
        if (atmosphereRef.current) {
          atmosphereRef.current.uniforms.time.value = currentTime / 1000.0;
          atmosphereRef.current.uniforms.glowIntensity.value = controls.glow;
          atmosphereRef.current.uniforms.opacity.value = controls.atmosphereOpacity;
          atmosphereRef.current.uniforms.dataValue.value = controls.currentValue;
          atmosphereRef.current.uniforms.earthRotation.value = controls.earthRotation;
          atmosphereRef.current.uniforms.sunDirection.value = sunDirectionRef.current;
          
          const layerConfig = dataLayers.find(l => l.id === controls.activeLayer) || dataLayers[0];
          atmosphereRef.current.uniforms.minRange.value = layerConfig.range[0];
          atmosphereRef.current.uniforms.maxRange.value = layerConfig.range[1];
        }

        // Update cloud material
        if (cloudMaterialRef.current) {
          cloudMaterialRef.current.opacity = controls.cloudOpacity;
        }

        // Update data layer shader
        if (dataLayerRef.current) {
          const material = dataLayerRef.current.material as THREE.ShaderMaterial;
          material.uniforms.dataValue.value = controls.currentValue;
          material.uniforms.intensity.value = controls.layerIntensity;
          
          const layerConfig = dataLayers.find(l => l.id === controls.activeLayer) || dataLayers[0];
          material.uniforms.coldColor.value = new THREE.Vector3(...layerConfig.color.cold);
          material.uniforms.warmColor.value = new THREE.Vector3(...layerConfig.color.warm);
          material.uniforms.hotColor.value = new THREE.Vector3(...layerConfig.color.hot);
          material.uniforms.minRange.value = layerConfig.range[0];
          material.uniforms.maxRange.value = layerConfig.range[1];
        }

        controlsRef.current?.update();
        rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate(0);

    // Handle window resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      cameraRef.current!.aspect = width / height;
      cameraRef.current!.updateProjectionMatrix();
      rendererRef.current!.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationIdRef.current);

      texturesRef.current.forEach(texture => texture.dispose());
      texturesRef.current = [];

      sceneRef.current?.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else {
            object.material?.dispose();
          }
        }
      });

      controlsRef.current?.dispose();
      rendererRef.current?.dispose();

      earthRef.current = null;
      cloudsRef.current = null;
      atmosphereRef.current = null;
      cloudMaterialRef.current = null;
      dataLayerRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;

      window.removeEventListener("resize", handleResize);

      if (container.contains(rendererRef.current!.domElement)) {
        container.removeChild(rendererRef.current!.domElement);
      }
    };
  }, [isMounted, isMobile, loader, isLoading, currentLayerConfig, setIsLoading, setIsMounted, setIsMobile]);

  // Panel positioning
  const panelStyle = useMemo(() => {
    if (!isMounted) return { right: '16px', top: '140px' };

    if (isMobile) {
      return {
        left: '50%',
        top: isCollapsed ? 'auto' : '50%',
        bottom: isCollapsed ? '1rem' : 'auto',
        transform: isCollapsed ? 'translateX(-50%)' : 'translate(-50%, -50%)',
        width: isCollapsed ? 'auto' : 'calc(100vw - 2rem)',
        maxWidth: isCollapsed ? 'none' : '340px',
      };
    }

    return {
      right: `${Math.max(16, window.innerWidth - position.x - 260)}px`,
      top: `${Math.max(140, position.y)}px`,
      transform: 'none',
    };
  }, [isMounted, isMobile, isCollapsed, position]);

  if (isLoading) {
    return <Preloader progress={loadingProgress} />;
  }

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
            textShadow: '0 0 10px rgba(0,0,0,0.7)'
          }}
        >
          Earth Climate Monitor
        </h1>
        <p className="text-sm mt-1" style={{ color: colors.text }}>
          Dynamic Atmospheric Glow • Multi-Layer Visualization
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
        setLayerIntensity={setLayerIntensity} glowIntensity={0} setGlowIntensity={function (value: number): void {
          throw new Error("Function not implemented.");
        } }      />
      
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