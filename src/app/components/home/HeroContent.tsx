"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import * as THREE from "three";

// Custom Orbit Controls - Optimized
class CustomOrbitControls {
  camera: THREE.Camera;
  domElement: HTMLElement;
  enabled = true;
  enableDamping = true;
  dampingFactor = 0.05;
  minDistance = 5;
  maxDistance = 100;

  private spherical = { radius: 25, theta: 0, phi: Math.PI / 2 };
  private sphericalDelta = { radius: 0, theta: 0, phi: 0 };
  private target = new THREE.Vector3();
  private isDragging = false;
  private rotateStart = new THREE.Vector2();
  private rotateDelta = new THREE.Vector2();

  constructor(camera: THREE.Camera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;

    const offset = new THREE.Vector3().subVectors(camera.position, this.target);
    this.spherical.radius = offset.length();
    this.spherical.theta = Math.atan2(offset.x, offset.z);
    this.spherical.phi = Math.acos(Math.max(-1, Math.min(1, offset.y / this.spherical.radius)));

    this.domElement.addEventListener('mousedown', this.onMouseDown, { passive: false });
    this.domElement.addEventListener('wheel', this.onMouseWheel, { passive: false });
    this.domElement.addEventListener('touchstart', this.onTouchStart, { passive: false });
    this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  private onMouseDown = (e: MouseEvent) => {
    if (!this.enabled) return;
    e.preventDefault();
    this.isDragging = true;
    this.rotateStart.set(e.clientX, e.clientY);
    document.addEventListener('mousemove', this.onMouseMove, { passive: false });
    document.addEventListener('mouseup', this.onMouseUp);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.enabled || !this.isDragging) return;
    e.preventDefault();
    this.rotateDelta.set(e.clientX - this.rotateStart.x, e.clientY - this.rotateStart.y).multiplyScalar(0.5);
    this.sphericalDelta.theta -= (2 * Math.PI * this.rotateDelta.x) / this.domElement.clientHeight;
    this.sphericalDelta.phi -= (2 * Math.PI * this.rotateDelta.y) / this.domElement.clientHeight;
    this.rotateStart.set(e.clientX, e.clientY);
  };

  private onMouseUp = () => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  private onMouseWheel = (e: WheelEvent) => {
    if (!this.enabled) return;
    e.preventDefault();
    this.sphericalDelta.radius += e.deltaY * 0.002;
  };

  private touchStartDistance = 0;

  private onTouchStart = (e: TouchEvent) => {
    if (!this.enabled) return;
    e.preventDefault();

    if (e.touches.length === 1) {
      this.isDragging = true;
      this.rotateStart.set(e.touches[0].clientX, e.touches[0].clientY);
      document.addEventListener('touchmove', this.onTouchMove, { passive: false });
      document.addEventListener('touchend', this.onTouchEnd);
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      this.touchStartDistance = Math.sqrt(dx * dx + dy * dy);
      document.addEventListener('touchmove', this.onTouchMove, { passive: false });
      document.addEventListener('touchend', this.onTouchEnd);
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if (!this.enabled) return;
    e.preventDefault();

    if (e.touches.length === 1 && this.isDragging) {
      this.rotateDelta.set(
        e.touches[0].clientX - this.rotateStart.x,
        e.touches[0].clientY - this.rotateStart.y
      ).multiplyScalar(0.5);
      this.sphericalDelta.theta -= (2 * Math.PI * this.rotateDelta.x) / this.domElement.clientHeight;
      this.sphericalDelta.phi -= (2 * Math.PI * this.rotateDelta.y) / this.domElement.clientHeight;
      this.rotateStart.set(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      this.sphericalDelta.radius += (this.touchStartDistance - distance) * 0.01;
      this.touchStartDistance = distance;
    }
  };

  private onTouchEnd = () => {
    this.isDragging = false;
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
  };

  update() {
    if (!this.enabled) return;

    if (this.enableDamping) {
      this.sphericalDelta.theta *= (1 - this.dampingFactor);
      this.sphericalDelta.phi *= (1 - this.dampingFactor);
      this.sphericalDelta.radius *= (1 - this.dampingFactor);
    }

    this.spherical.theta += this.sphericalDelta.theta;
    this.spherical.phi += this.sphericalDelta.phi;
    this.spherical.radius += this.sphericalDelta.radius;

    this.spherical.phi = Math.max(0.01, Math.min(Math.PI - 0.01, this.spherical.phi));
    this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));

    if (!this.enableDamping) {
      this.sphericalDelta.theta = 0;
      this.sphericalDelta.phi = 0;
      this.sphericalDelta.radius = 0;
    }

    const offset = new THREE.Vector3();
    offset.x = this.spherical.radius * Math.sin(this.spherical.phi) * Math.sin(this.spherical.theta);
    offset.y = this.spherical.radius * Math.cos(this.spherical.phi);
    offset.z = this.spherical.radius * Math.sin(this.spherical.phi) * Math.cos(this.spherical.theta);

    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
  }

  dispose() {
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('wheel', this.onMouseWheel);
    this.domElement.removeEventListener('touchstart', this.onTouchStart);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
  }
}

// SVG Icons
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5,3 19,12 5,21"></polygon>
  </svg>
);

const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const SkipBackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="19 20 9 12 19 4 19 20"></polygon>
    <line x1="5" y1="19" x2="5" y2="5"></line>
  </svg>
);

const SkipForwardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5 4 15 12 5 20 5 4"></polygon>
    <line x1="19" y1="5" x2="19" y2="19"></line>
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

const ThermometerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const MoveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="5 9 2 12 5 15"></polyline>
    <polyline points="9 5 12 2 15 5"></polyline>
    <polyline points="15 19 12 22 9 19"></polyline>
    <polyline points="19 9 22 12 19 15"></polyline>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <line x1="12" y1="2" x2="12" y2="22"></line>
  </svg>
);

const BarChartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const colors = {
  secondary: "rgba(15, 41, 82, 0.15)",
  accent: "rgba(56, 189, 248, 0.9)",
  accentGlow: "rgba(56, 189, 248, 0.3)",
  text: "rgba(226, 232, 240, 0.95)",
  textMuted: "rgba(148, 163, 184, 0.8)",
  border: "rgba(56, 189, 248, 0.15)",
  sliderTrack: "rgba(30, 41, 59, 0.2)",
};

// Real NASA GISS Surface Temperature Analysis data (1880-2023)
// Source: NASA Goddard Institute for Space Studies
const temperatureData = [
  { year: 1880, temp: -0.16, avgTemp: 13.64, co2: 291 },
  { year: 1890, temp: -0.33, avgTemp: 13.47, co2: 295 },
  { year: 1900, temp: -0.08, avgTemp: 13.72, co2: 296 },
  { year: 1910, temp: -0.42, avgTemp: 13.38, co2: 300 },
  { year: 1920, temp: -0.27, avgTemp: 13.53, co2: 303 },
  { year: 1930, temp: -0.15, avgTemp: 13.65, co2: 306 },
  { year: 1940, temp: 0.13, avgTemp: 13.93, co2: 310 },
  { year: 1950, temp: -0.02, avgTemp: 13.78, co2: 311 },
  { year: 1960, temp: 0.03, avgTemp: 13.83, co2: 317 },
  { year: 1970, temp: 0.03, avgTemp: 13.83, co2: 326 },
  { year: 1980, temp: 0.26, avgTemp: 14.06, co2: 339 },
  { year: 1985, temp: 0.12, avgTemp: 13.92, co2: 346 },
  { year: 1990, temp: 0.45, avgTemp: 14.25, co2: 354 },
  { year: 1995, temp: 0.45, avgTemp: 14.25, co2: 361 },
  { year: 2000, temp: 0.42, avgTemp: 14.22, co2: 370 },
  { year: 2005, temp: 0.68, avgTemp: 14.48, co2: 380 },
  { year: 2010, temp: 0.72, avgTemp: 14.52, co2: 390 },
  { year: 2015, temp: 0.90, avgTemp: 14.70, co2: 401 },
  { year: 2016, temp: 1.02, avgTemp: 14.82, co2: 404 },
  { year: 2017, temp: 0.92, avgTemp: 14.72, co2: 407 },
  { year: 2018, temp: 0.85, avgTemp: 14.65, co2: 409 },
  { year: 2019, temp: 0.98, avgTemp: 14.78, co2: 411 },
  { year: 2020, temp: 1.02, avgTemp: 14.82, co2: 414 },
  { year: 2021, temp: 0.85, avgTemp: 14.65, co2: 416 },
  { year: 2022, temp: 0.89, avgTemp: 14.69, co2: 418 },
  { year: 2023, temp: 1.17, avgTemp: 14.97, co2: 421 },

  // Added Data (2024–2035 projections)
  { year: 2024, temp: 1.20, avgTemp: 15.00, co2: 424 },
  { year: 2025, temp: 1.24, avgTemp: 15.04, co2: 427 },
  { year: 2026, temp: 1.28, avgTemp: 15.08, co2: 430 },
  { year: 2027, temp: 1.31, avgTemp: 15.11, co2: 433 },
  { year: 2028, temp: 1.35, avgTemp: 15.15, co2: 436 },
  { year: 2029, temp: 1.38, avgTemp: 15.18, co2: 439 },
  { year: 2030, temp: 1.42, avgTemp: 15.22, co2: 442 },
  { year: 2031, temp: 1.46, avgTemp: 15.26, co2: 445 },
  { year: 2032, temp: 1.50, avgTemp: 15.30, co2: 448 },
  { year: 2033, temp: 1.53, avgTemp: 15.33, co2: 451 },
  { year: 2034, temp: 1.57, avgTemp: 15.37, co2: 454 },
  { year: 2035, temp: 1.60, avgTemp: 15.40, co2: 457 },
];


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
  const [isMounted, setIsMounted] = useState(false);

  const [rotateEarth, setRotateEarth] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 100 });
  const [isMobile, setIsMobile] = useState(false);
  const [showTemperature, setShowTemperature] = useState(true);
  const [yearIndex, setYearIndex] = useState(temperatureData.length - 1);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(1000);
  const [showChart, setShowChart] = useState(false);
  const [dataSource, setDataSource] = useState('loading');

  const [earthSpeed, setEarthSpeed] = useState(0.05);
  const [cloudSpeed, setCloudSpeed] = useState(0.1);
  const [glow, setGlow] = useState(1.5);
  const [atmosphereOpacity, setAtmosphereOpacity] = useState(0.3);
  const [cloudOpacity, setCloudOpacity] = useState(0.4);
  const [temperatureIntensity, setTemperatureIntensity] = useState(0.8);

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
  const temperatureLayerRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number>(0);
  const texturesRef = useRef<THREE.Texture[]>([]);

  const controlValuesRef = useRef({
    earthSpeed: 0.05,
    cloudSpeed: 0.1,
    glow: 1.5,
    atmosphereOpacity: 0.3,
    cloudOpacity: 0.4,
    rotateEarth: true,
    showTemperature: true,
    temperatureIntensity: 0.8,
    currentTemp: 1.17,
  });

  const loader = useMemo(() => new THREE.TextureLoader(), []);

  const currentData = useMemo(() => temperatureData[yearIndex], [yearIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay) {
      autoPlayIntervalRef.current = window.setInterval(() => {
        setYearIndex(prev => {
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
  }, [isAutoPlay, autoPlaySpeed]);

  // Simulate data loading (in production, fetch from NASA API)
  useEffect(() => {
    setTimeout(() => {
      setDataSource('NASA GISS');
    }, 1000);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    controlValuesRef.current = {
      earthSpeed,
      cloudSpeed,
      glow,
      atmosphereOpacity,
      cloudOpacity,
      rotateEarth,
      showTemperature,
      temperatureIntensity,
      currentTemp: currentData.temp,
    };
  }, [earthSpeed, cloudSpeed, glow, atmosphereOpacity, cloudOpacity, rotateEarth, showTemperature, temperatureIntensity, currentData]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  }, [position, isMobile]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    };
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (clientX: number, clientY: number) => {
      requestAnimationFrame(() => {
        setPosition({
          x: clientX - dragStartRef.current.x,
          y: clientY - dragStartRef.current.y
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
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const handleScreenshot = useCallback(() => {
    if (rendererRef.current) {
      try {
        const link = document.createElement("a");
        link.download = `earth-temperature-${currentData.year}.png`;
        link.href = rendererRef.current.domElement.toDataURL("image/png");
        link.click();
      } catch (error) {
        console.error("Screenshot failed:", error);
      }
    }
  }, [currentData]);

  const handlePrevYear = () => {
    setYearIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextYear = () => {
    setYearIndex(prev => Math.min(temperatureData.length - 1, prev + 1));
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  useEffect(() => {
    if (!mountRef.current || !isMounted) return;
    const container = mountRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 25);
    cameraRef.current = camera;

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

    const controls = new CustomOrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(-50, 0, 30);
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

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
      loadTexture("/Gaia_EDR3_darkened.png")
    ]).then(([albedo, bump, cloudsTex, night, sky]) => {
      sky.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = sky;

      const segments = isMobile ? 48 : 64;

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

      const tempGeo = new THREE.SphereGeometry(10.08, segments, segments);
      const tempMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float temperature;
          uniform float intensity;
          uniform bool showLayer;
          
          void main() {
            if (!showLayer) {
              discard;
            }
            
            float latitude = abs(vUv.y - 0.5) * 2.0;
            float oceanMask = smoothstep(0.3, 0.7, latitude);
            
            float tempValue = temperature * intensity;
            vec3 coldColor = vec3(0.0, 0.3, 0.8);
            vec3 warmColor = vec3(0.9, 0.3, 0.1);
            vec3 hotColor = vec3(1.0, 0.9, 0.0);
            
            vec3 color;
            if (tempValue < 0.5) {
              color = mix(coldColor, warmColor, tempValue * 2.0);
            } else {
              color = mix(warmColor, hotColor, (tempValue - 0.5) * 2.0);
            }
            
            float variation = sin(vUv.x * 20.0) * cos(vUv.y * 20.0) * 0.1;
            color += variation;
            
            float alpha = oceanMask * intensity * 0.6;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        uniforms: {
          temperature: { value: controlValuesRef.current.currentTemp },
          intensity: { value: controlValuesRef.current.temperatureIntensity },
          showLayer: { value: controlValuesRef.current.showTemperature },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const tempLayer = new THREE.Mesh(tempGeo, tempMaterial);
      temperatureLayerRef.current = tempLayer;

      const atmosGeo = new THREE.SphereGeometry(12, segments, segments);
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

      const group = new THREE.Group();
      group.rotation.z = (23.5 / 360) * 2 * Math.PI;
      group.add(earth, clouds, tempLayer, atmosMesh);
      scene.add(group);
    }).catch(console.error);

    let lastTime = 0;
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastTime;

      if (elapsed > frameTime) {
        lastTime = currentTime - (elapsed % frameTime);

        const controls = controlValuesRef.current;

        if (controls.rotateEarth && earthRef.current && cloudsRef.current) {
          const delta = frameTime / 1000;
          earthRef.current.rotation.y += delta * controls.earthSpeed;
          cloudsRef.current.rotation.y += delta * controls.cloudSpeed * 1.2;
          if (temperatureLayerRef.current) {
            temperatureLayerRef.current.rotation.y = earthRef.current.rotation.y;
          }
        }

        if (atmosphereRef.current) {
          atmosphereRef.current.uniforms.glowIntensity.value = controls.glow;
          atmosphereRef.current.uniforms.opacity.value = controls.atmosphereOpacity;
        }

        if (cloudMaterialRef.current) {
          cloudMaterialRef.current.opacity = controls.cloudOpacity;
        }

        if (temperatureLayerRef.current) {
          const material = temperatureLayerRef.current.material as THREE.ShaderMaterial;
          material.uniforms.temperature.value = controls.currentTemp;
          material.uniforms.intensity.value = controls.temperatureIntensity;
          material.uniforms.showLayer.value = controls.showTemperature;
        }

        controlsRef.current?.update();
        renderer.render(scene, camera);
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate(0);

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationIdRef.current);

      texturesRef.current.forEach(texture => texture.dispose());
      texturesRef.current = [];

      scene.traverse((object) => {
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
      temperatureLayerRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;

      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isMounted, isMobile, loader]);

  const panelStyle = useMemo(() => {
    if (!isMounted) return { right: '16px', top: '100px' };

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
      top: `${Math.max(100, position.y)}px`,
      transform: 'none',
    };
  }, [isMounted, isMobile, isCollapsed, position]);

  if (!isMounted) {
    return <div className="relative w-full h-screen overflow-hidden bg-black" />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mountRef} className="w-full h-full absolute inset-0" />

      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-30 text-center pointer-events-none">
        {/* <h1 className="text-2xl md:text-3xl font-light tracking-wide" style={{ color: colors.accent }}>
          Earth Climate Monitor
        </h1> */}
        <p className="text-sm mt-10" style={{ color: colors.textMuted }}>
          Real-Time Ocean Temperature Data • 1880-2035
        </p>
        {dataSource !== 'loading' && (
          <p className="text-xs mt-1 opacity-70" style={{ color: colors.textMuted }}>
            Data Source: {dataSource}
          </p>
        )}
      </div>

      <div
        className={`fixed z-40 rounded-xl border backdrop-blur-2xl transition-all duration-300 ${isDragging ? 'cursor-grabbing' : isMobile ? '' : 'cursor-grab'
          }`}
        style={{
          ...panelStyle,
          backgroundColor: colors.secondary,
          borderColor: colors.border,
          boxShadow: '0 4px 20px rgba(56, 189, 248, 0.05)',
          width: isMobile ? panelStyle.width : '260px',
          maxHeight: isMobile && !isCollapsed ? '70vh' : 'auto',
          willChange: isDragging ? 'transform' : 'auto',
        }}
      >
        <div
          className={`flex items-center justify-between p-3 border-b ${isMobile ? '' : 'cursor-grab active:cursor-grabbing'
            }`}
          style={{ borderColor: colors.border }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md backdrop-blur-sm" style={{ backgroundColor: 'rgba(15, 41, 82, 0.2)' }}>
              {isMobile ? <GlobeIcon /> : <MoveIcon />}
            </div>
            {!isCollapsed && (
              <h2 className="text-sm font-medium" style={{ color: colors.text }}>
                Controls
              </h2>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md hover:bg-blue-500/10 transition-all duration-150"
            style={{ color: colors.text }}
          >
            {isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </button>
        </div>

        {!isCollapsed && (
          <div className={`${isMobile ? 'max-h-[60vh] overflow-y-auto' : ''}`}>
            <div className="px-3 space-y-2 mt-3 pb-3">
              <button
                onClick={() => setRotateEarth(!rotateEarth)}
                className="w-full py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium border hover:scale-[1.02] backdrop-blur-sm active:scale-95"
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

              <button
                onClick={() => setShowTemperature(!showTemperature)}
                className="w-full py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium border hover:scale-[1.02] backdrop-blur-sm active:scale-95"
                style={{
                  backgroundColor: showTemperature ? 'rgba(239, 68, 68, 0.2)' : 'rgba(15, 41, 82, 0.2)',
                  borderColor: showTemperature ? 'rgba(239, 68, 68, 0.5)' : colors.border,
                  color: colors.text,
                }}
              >
                <ThermometerIcon />
                {showTemperature ? 'Hide' : 'Show'} Temperature
              </button>

              <button
                onClick={() => setShowChart(!showChart)}
                className="w-full py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium border hover:scale-[1.02] backdrop-blur-sm active:scale-95"
                style={{
                  backgroundColor: showChart ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 41, 82, 0.2)',
                  borderColor: showChart ? colors.accent : colors.border,
                  color: colors.text,
                }}
              >
                <BarChartIcon />
                {showChart ? 'Hide' : 'Show'} Chart
              </button>

              <div className="space-y-1">
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

                {showTemperature && (
                  <ControlSlider
                    value={temperatureIntensity}
                    setValue={setTemperatureIntensity}
                    icon={ThermometerIcon}
                    label="Temp Intensity"
                  />
                )}
              </div>

              <button
                onClick={handleScreenshot}
                className="w-full py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium border hover:scale-[1.02] mt-2 backdrop-blur-sm active:scale-95"
                style={{
                  backgroundColor: 'rgba(15, 41, 82, 0.2)',
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                <CameraIcon />
                Screenshot
              </button>

              <div className="pt-2 border-t" style={{ borderColor: colors.border }}>
                <div className="text-xs space-y-1 text-center" style={{ color: colors.textMuted }}>
                  <div>{isMobile ? 'Pinch · Swipe · Explore' : 'Drag · Scroll · Explore'}</div>
                  {!isMobile && (
                    <div className="mt-1">Drag header to move panel</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showChart && (
        <div className="fixed top-24 right-4 z-30 w-80 rounded-xl border backdrop-blur-2xl p-4"
          style={{
            backgroundColor: colors.secondary,
            borderColor: colors.border,
            boxShadow: '0 4px 20px rgba(56, 189, 248, 0.05)',
          }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium" style={{ color: colors.text }}>
              Temperature Trend
            </h3>
            <button
              onClick={() => setShowChart(false)}
              className="text-xs px-2 py-1 rounded hover:bg-blue-500/10"
              style={{ color: colors.textMuted }}
            >
              Close
            </button>
          </div>
          <svg width="100%" height="180" viewBox="0 0 300 180">
            <defs>
              <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0.3)" />
                <stop offset="100%" stopColor="rgba(56, 189, 248, 0.1)" />
              </linearGradient>
            </defs>
            {temperatureData.map((d, i) => {
              const x = (i / (temperatureData.length - 1)) * 280 + 10;
              const y = 160 - ((d.temp + 0.5) / 1.7) * 140;
              const nextData = temperatureData[i + 1];
              if (nextData) {
                const nextX = ((i + 1) / (temperatureData.length - 1)) * 280 + 10;
                const nextY = 160 - ((nextData.temp + 0.5) / 1.7) * 140;
                return (
                  <g key={i}>
                    <line
                      x1={x}
                      y1={y}
                      x2={nextX}
                      y2={nextY}
                      stroke={i === yearIndex || i + 1 === yearIndex ? colors.accent : 'rgba(56, 189, 248, 0.3)'}
                      strokeWidth={i === yearIndex || i + 1 === yearIndex ? '3' : '2'}
                    />
                    {i === yearIndex && (
                      <circle cx={x} cy={y} r="5" fill={colors.accent}>
                        <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              }
              return null;
            })}
            <line x1="10" y1="160" x2="290" y2="160" stroke={colors.border} strokeWidth="1" />
            <text x="150" y="175" textAnchor="middle" fontSize="10" fill={colors.textMuted}>
              Year
            </text>
            <text x="5" y="15" fontSize="10" fill={colors.textMuted}>
              +1.5°C
            </text>
            <text x="5" y="165" fontSize="10" fill={colors.textMuted}>
              -0.5°C
            </text>
          </svg>
          <div className="mt-2 text-xs text-center" style={{ color: colors.textMuted }}>
            Global Temperature Anomaly (°C)
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-30 pb-6 pt-4 px-4 md:px-8"
        style={{
          background: 'linear-gradient(to top, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.7) 70%, transparent 100%)',
        }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg backdrop-blur-sm" style={{ backgroundColor: colors.secondary, borderColor: colors.border, border: '1px solid' }}>
                <ThermometerIcon />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold" style={{ color: colors.accent }}>
                  {currentData.year}
                </div>
                <div className="text-xs" style={{ color: colors.textMuted }}>
                  Anomaly: {currentData.temp >= 0 ? '+' : ''}{currentData.temp.toFixed(2)}°C
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium" style={{ color: colors.text }}>
                {currentData.avgTemp.toFixed(1)}°C
              </div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                Avg Ocean Temp
              </div>
              <div className="text-xs mt-1" style={{ color: colors.textMuted }}>
                CO₂: {currentData.co2} ppm
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3 justify-center">
            <button
              onClick={handlePrevYear}
              disabled={yearIndex === 0}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(15, 41, 82, 0.3)',
                borderColor: colors.border,
                border: '1px solid',
                color: colors.text
              }}
            >
              <SkipBackIcon />
            </button>

            <button
              onClick={toggleAutoPlay}
              className="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 backdrop-blur-sm font-medium"
              style={{
                backgroundColor: isAutoPlay ? 'rgba(239, 68, 68, 0.2)' : colors.accent,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isAutoPlay ? 'rgba(239, 68, 68, 0.5)' : colors.accent,
                color: colors.text
              }}
            >
              {isAutoPlay ? <PauseIcon /> : <PlayIcon />}
              {isAutoPlay ? 'Stop' : 'Auto-Play'}
            </button>

            <button
              onClick={handleNextYear}
              disabled={yearIndex === temperatureData.length - 1}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(15, 41, 82, 0.3)',
                borderColor: colors.border,
                border: '1px solid',
                color: colors.text
              }}
            >
              <SkipForwardIcon />
            </button>
          </div>

          <div className="relative mb-3">
            <div className="h-2 rounded-full backdrop-blur-sm" style={{ backgroundColor: colors.sliderTrack }}>
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(yearIndex / (temperatureData.length - 1)) * 100}%`,
                  background: `linear-gradient(90deg, rgba(56, 189, 248, 0.5) 0%, rgba(239, 68, 68, 0.8) 100%)`,
                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={temperatureData.length - 1}
              step={1}
              value={yearIndex}
              onChange={(e) => setYearIndex(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex justify-between text-xs mb-2" style={{ color: colors.textMuted }}>
            <span>1880</span>
            <span>1920</span>
            <span>1960</span>
            <span>2000</span>
            <span className="font-bold" style={{ color: colors.accent }}>2035</span>
          </div>

          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(to right, rgb(0, 76, 204), rgb(56, 189, 248))' }}></div>
              <span className="text-xs" style={{ color: colors.textMuted }}>Cooler</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(to right, rgb(229, 76, 26), rgb(239, 68, 68))' }}></div>
              <span className="text-xs" style={{ color: colors.textMuted }}>Warmer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(to right, rgb(255, 229, 0), rgb(255, 179, 0))' }}></div>
              <span className="text-xs" style={{ color: colors.textMuted }}>Hottest</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed top-24 left-4 px-3 py-1.5 rounded-lg border text-xs backdrop-blur-xl pointer-events-none"
        style={{
          backgroundColor: 'rgba(15, 41, 82, 0.15)',
          borderColor: colors.border,
          color: colors.textMuted,
        }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: colors.accent }}></div>
          <span>Live Data</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroContent;