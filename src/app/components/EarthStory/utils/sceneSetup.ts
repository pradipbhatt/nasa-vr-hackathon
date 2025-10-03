import * as THREE from "three";

export function createScene(container: HTMLDivElement) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x001122, 15, 80);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 25);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance"
  });
  renderer.setClearColor(0x000022);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  return { scene, camera, renderer };
}

export function createLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.15);
  
  const directional = new THREE.DirectionalLight(0xffffff, 1.5);
  directional.position.set(8, 5, 8);
  directional.castShadow = true;
  directional.shadow.mapSize.width = 2048;
  directional.shadow.mapSize.height = 2048;

  const point1 = new THREE.PointLight(0x4488ff, 0, 100);
  point1.position.set(-20, 10, -20);

  const point2 = new THREE.PointLight(0xff4488, 0, 100);
  point2.position.set(20, -10, 20);

  const rim = new THREE.PointLight(0xffffff, 2, 30);
  rim.position.set(0, 0, -12);

  return { ambient, directional, point1, point2, rim };
}

export function createCosmos(scene: THREE.Scene) {
  const starsGroup = new THREE.Group();
  
  for (let layer = 0; layer < 5; layer++) {
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    const starsSizes = [];
    const starsColors = [];
    const count = 1500 + layer * 400;
    
    for (let i = 0; i < count; i++) {
      const radius = 600 + layer * 250;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      starsVertices.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      starsSizes.push(Math.random() * 4 + 1);
      
      const temp = Math.random();
      if (temp > 0.88) starsColors.push(0.4, 0.6, 1);
      else if (temp > 0.7) starsColors.push(0.7, 0.8, 1);
      else if (temp > 0.4) starsColors.push(1, 1, 0.95);
      else starsColors.push(1, 0.75, 0.55);
    }
    
    starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starsVertices, 3));
    starsGeometry.setAttribute("size", new THREE.Float32BufferAttribute(starsSizes, 1));
    starsGeometry.setAttribute("color", new THREE.Float32BufferAttribute(starsColors, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 1 - layer * 0.12,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });
    
    starsGroup.add(new THREE.Points(starsGeometry, starsMaterial));
  }
  scene.add(starsGroup);

  const cmbMaterial = new THREE.ShaderMaterial({
    uniforms: {
      opacity: { value: 0 },
      time: { value: 0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float opacity;
      uniform float time;
      varying vec3 vNormal;
      varying vec2 vUv;
      
      void main() {
        float noise = sin(vUv.x * 25.0 + time * 0.5) * cos(vUv.y * 25.0 + time * 0.3) * 0.5 + 0.5;
        vec3 color = mix(vec3(0.08, 0.0, 0.15), vec3(0.25, 0.08, 0.35), noise);
        gl_FragColor = vec4(color, opacity * 0.35);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  
  const cmb = new THREE.Mesh(new THREE.SphereGeometry(180, 64, 64), cmbMaterial);
  scene.add(cmb);

  return { starsGroup, cmb, cmbMaterial };
}

export function createBigBang(scene: THREE.Scene) {
  const singularityMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0
  });
  const singularity = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 32, 32),
    singularityMaterial
  );
  scene.add(singularity);

  const waveMaterial = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const energyWave = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    waveMaterial
  );
  scene.add(energyWave);

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesVertices = [];
  const particlesVelocities = [];
  const particlesColors = [];

  for (let i = 0; i < 12000; i++) {
    particlesVertices.push(0, 0, 0);
    
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const speed = 0.4 + Math.random() * 0.6;
    
    particlesVelocities.push(
      Math.sin(phi) * Math.cos(theta) * speed,
      Math.sin(phi) * Math.sin(theta) * speed,
      Math.cos(phi) * speed
    );
    
    const colorChoice = Math.random();
    if (colorChoice > 0.75) particlesColors.push(1, 0.5, 0.15);
    else if (colorChoice > 0.5) particlesColors.push(0.25, 0.55, 1);
    else if (colorChoice > 0.25) particlesColors.push(1, 0.3, 0.7);
    else particlesColors.push(1, 1, 1);
  }

  particlesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particlesVertices, 3));
  particlesGeometry.setAttribute("velocity", new THREE.Float32BufferAttribute(particlesVelocities, 3));
  particlesGeometry.setAttribute("color", new THREE.Float32BufferAttribute(particlesColors, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.6,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  return { singularity, singularityMaterial, energyWave, waveMaterial, particles, particlesMaterial };
}

export function createNebula(scene: THREE.Scene) {
  const group = new THREE.Group();
  const colors = [0x9966ff, 0x7755dd, 0x5533bb, 0x8855ee, 0x6644cc];
  
  for (let i = 0; i < 5; i++) {
    const material = new THREE.MeshBasicMaterial({
      color: colors[i],
      transparent: true,
      opacity: 0,
      wireframe: true,
      blending: THREE.AdditiveBlending
    });
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(4.5 + i * 1.2, 1),
      material
    );
    group.add(mesh);
  }
  
  scene.add(group);
  return { group };
}

export function createSolarSystem(scene: THREE.Scene) {
  const diskMaterial = new THREE.MeshBasicMaterial({
    color: 0xbb8855,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const disk = new THREE.Mesh(new THREE.RingGeometry(3.8, 13, 256), diskMaterial);
  disk.rotation.x = Math.PI / 2.1;
  scene.add(disk);

  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffcc44,
    transparent: true,
    opacity: 0
  });
  const sun = new THREE.Mesh(new THREE.SphereGeometry(3, 128, 128), sunMaterial);
  sun.position.set(-12, 0, -7);
  scene.add(sun);

  const coronaLayers: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const coronaMaterial = new THREE.MeshBasicMaterial({
      color: 0xffee66,
      transparent: true,
      opacity: 0,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const corona = new THREE.Mesh(
      new THREE.SphereGeometry(3 + (i + 1) * 0.22, 64, 64),
      coronaMaterial
    );
    sun.add(corona);
    coronaLayers.push(corona);
  }

  const prominences: THREE.Mesh[] = [];
  for (let i = 0; i < 10; i++) {
    const promMaterial = new THREE.MeshBasicMaterial({
      color: 0xff7722,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const prom = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      promMaterial
    );
    const angle = (i / 10) * Math.PI * 2;
    prom.position.set(Math.cos(angle) * 3.1, Math.sin(angle) * 3.1, 0);
    sun.add(prom);
    prominences.push(prom);
  }

  const asteroids: THREE.Mesh[] = [];
  for (let i = 0; i < 300; i++) {
    const size = 0.018 + Math.random() * 0.055;
    const asteroid = new THREE.Mesh(
      new THREE.DodecahedronGeometry(size, 0),
      new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 0.98,
        metalness: 0.02
      })
    );
    const angle = (i / 300) * Math.PI * 2;
    const radius = 7 + Math.random() * 1.8;
    asteroid.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 0.2,
      Math.sin(angle) * radius
    );
    asteroid.userData = {
      angle,
      radius,
      speed: 0.00006 + Math.random() * 0.0001,
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.015,
        (Math.random() - 0.5) * 0.015
      )
    };
    asteroid.castShadow = true;
    asteroid.visible = false;
    asteroids.push(asteroid);
    scene.add(asteroid);
  }

  return { disk, diskMaterial, sun, sunMaterial, coronaLayers, prominences, asteroids };
}

export function createEarth(scene: THREE.Scene) {
  const loader = new THREE.TextureLoader();
  
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: loader.load("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"),
    bumpMap: loader.load("https://unpkg.com/three-globe/example/img/earth-topology.png"),
    bumpScale: 0.015,
    specularMap: loader.load("https://unpkg.com/three-globe/example/img/earth-water.png"),
    specular: new THREE.Color(0x333333),
    shininess: 25,
    transparent: true,
    opacity: 0
  });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1.2, 256, 256), earthMaterial);
  earth.castShadow = true;
  earth.receiveShadow = true;
  scene.add(earth);

  const moltenMaterial = new THREE.MeshBasicMaterial({
    color: 0xff4400,
    transparent: true,
    opacity: 0,
    wireframe: true
  });
  const moltenEarth = new THREE.Mesh(new THREE.SphereGeometry(1.22, 128, 128), moltenMaterial);
  scene.add(moltenEarth);

  const lavaGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff5500,
    transparent: true,
    opacity: 0,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const lavaGlow = new THREE.Mesh(new THREE.SphereGeometry(1.28, 64, 64), lavaGlowMaterial);
  scene.add(lavaGlow);

  const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: { opacity: { value: 0 } },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float opacity;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
        vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
        gl_FragColor = vec4(atmosphere, 1.0) * opacity;
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.45, 128, 128), atmosphereMaterial);
  scene.add(atmosphere);

  const cloudsMaterial = new THREE.MeshPhongMaterial({
    map: loader.load("https://unpkg.com/three-globe/example/img/earth-clouds.png"),
    transparent: true,
    opacity: 0,
    depthWrite: false
  });
  const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.21, 256, 256), cloudsMaterial);
  scene.add(clouds);

  const oceanGeometry = new THREE.BufferGeometry();
  const oceanVertices = [];
  const oceanSizes = [];
  for (let i = 0; i < 2000; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.205;
    oceanVertices.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
    oceanSizes.push(Math.random() * 2.5 + 1);
  }
  oceanGeometry.setAttribute("position", new THREE.Float32BufferAttribute(oceanVertices, 3));
  oceanGeometry.setAttribute("size", new THREE.Float32BufferAttribute(oceanSizes, 1));
  
  const oceanMaterial = new THREE.PointsMaterial({
    color: 0x00ddff,
    size: 0.018,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  const oceanParticles = new THREE.Points(oceanGeometry, oceanMaterial);
  scene.add(oceanParticles);

  const moonMaterial = new THREE.MeshStandardMaterial({
    map: loader.load("https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_1k.jpg"),
    transparent: true,
    opacity: 0,
    roughness: 1
  });
  const moon = new THREE.Mesh(new THREE.SphereGeometry(0.328, 128, 128), moonMaterial);
  moon.position.set(25, 0, 0);
  moon.castShadow = true;
  moon.receiveShadow = true;
  scene.add(moon);

  return {
    earth,
    earthMaterial,
    moltenEarth,
    moltenMaterial,
    lavaGlow,
    lavaGlowMaterial,
    atmosphere,
    atmosphereMaterial,
    clouds,
    cloudsMaterial,
    oceanParticles,
    oceanMaterial,
    moon,
    moonMaterial
  };
}

export function createImpact(scene: THREE.Scene) {
  const theiaMaterial = new THREE.MeshStandardMaterial({
    color: 0xcc4444,
    transparent: true,
    opacity: 0,
    emissive: 0x662222,
    emissiveIntensity: 0.7,
    roughness: 0.85
  });
  const theia = new THREE.Mesh(new THREE.SphereGeometry(0.64, 64, 64), theiaMaterial);
  theia.position.set(25, 0, 0);
  theia.castShadow = true;
  scene.add(theia);

  const impactFlashMaterial = new THREE.MeshBasicMaterial({
    color: 0xffbb44,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  });
  const impactFlash = new THREE.Mesh(new THREE.SphereGeometry(4, 64, 64), impactFlashMaterial);
  scene.add(impactFlash);

  const debrisField: THREE.Mesh[] = [];
  for (let i = 0; i < 500; i++) {
    const size = 0.006 + Math.random() * 0.03;
    const debris = new THREE.Mesh(
      new THREE.TetrahedronGeometry(size),
      new THREE.MeshStandardMaterial({
        color: 0xff6644,
        emissive: 0x442211,
        emissiveIntensity: 0.5,
        roughness: 0.95
      })
    );
    debris.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.07,
      (Math.random() - 0.5) * 0.07,
      (Math.random() - 0.5) * 0.07
    );
    debris.userData.rotSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 0.12,
      (Math.random() - 0.5) * 0.12,
      (Math.random() - 0.5) * 0.12
    );
    debris.visible = false;
    debris.castShadow = true;
    debrisField.push(debris);
    scene.add(debris);
  }

  return { theia, theiaMaterial, impactFlash, impactFlashMaterial, debrisField };
}

export function createClimate(scene: THREE.Scene) {
  const co2Geometry = new THREE.BufferGeometry();
  const co2Vertices = [];
  for (let i = 0; i < 5000; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.3 + Math.random() * 0.2;
    co2Vertices.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
  }
  co2Geometry.setAttribute("position", new THREE.Float32BufferAttribute(co2Vertices, 3));
  
  const co2Material = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.01,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  });
  const co2Particles = new THREE.Points(co2Geometry, co2Material);
  scene.add(co2Particles);

  const heatMapMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  });
  const heatMap = new THREE.Mesh(new THREE.SphereGeometry(1.25, 128, 128), heatMapMaterial);
  scene.add(heatMap);

  return {
    co2Particles,
    co2Material,
    heatMap,
    heatMapMaterial,
    seaLevelScale: { value: 1.0 }
  };
}

// import * as THREE from "three";

// export function createOceanElements(scene: THREE.Scene) {
//   // Waves
//   const waves = new THREE.Group();
//   for (let i = 0; i < 20; i++) {
//     const waveGeometry = new THREE.TorusGeometry(1.2 + i * 0.02, 0.002, 8, 64);
//     const waveMaterial = new THREE.MeshBasicMaterial({
//       color: 0x00aaff,
//       transparent: true,
//       opacity: 0.6,
//       blending: THREE.AdditiveBlending
//     });
//     const wave = new THREE.Mesh(waveGeometry, waveMaterial);
//     wave.rotation.x = Math.PI / 2;
//     waves.add(wave);
//   }
//   scene.add(waves);

//   // Microplastics
//   const microplasticsGeometry = new THREE.BufferGeometry();
//   const microVertices: number[] = [];
//   for (let i = 0; i < 3000; i++) {
//     const theta = Math.random() * Math.PI * 2;
//     const phi = Math.acos(2 * Math.random() - 1);
//     const r = 1.21;
//     microVertices.push(
//       r * Math.sin(phi) * Math.cos(theta),
//       r * Math.sin(phi) * Math.sin(theta),
//       r * Math.cos(phi)
//     );
//   }
//   microplasticsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(microVertices, 3));

//   const microplasticsMaterial = new THREE.PointsMaterial({
//     color: 0xff3333,
//     size: 0.015,
//     transparent: true,
//     opacity: 0.8,
//     blending: THREE.AdditiveBlending
//   });
//   const microplastics = new THREE.Points(microplasticsGeometry, microplasticsMaterial);
//   scene.add(microplastics);

//   // Coral Reefs
//   const coralReef = new THREE.Group();
//   for (let i = 0; i < 50; i++) {
//     const coralGeometry = new THREE.ConeGeometry(0.01, 0.05, 8);
//     const coralMaterial = new THREE.MeshBasicMaterial({
//       color: 0xff6b6b,
//       transparent: true,
//       opacity: 0.9
//     });
//     const coral = new THREE.Mesh(coralGeometry, coralMaterial);
//     const theta = Math.random() * Math.PI * 2;
//     const phi = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
//     coral.position.set(
//       1.2 * Math.sin(phi) * Math.cos(theta),
//       1.2 * Math.sin(phi) * Math.sin(theta),
//       1.2 * Math.cos(phi)
//     );
//     coral.lookAt(0, 0, 0);
//     coralReef.add(coral);
//   }
//   scene.add(coralReef);

//   // Phytoplankton
//   const phytoplanktonGeometry = new THREE.BufferGeometry();
//   const phytoVertices: number[] = [];
//   for (let i = 0; i < 4000; i++) {
//     const theta = Math.random() * Math.PI * 2;
//     const phi = Math.acos(2 * Math.random() - 1);
//     const r = 1.205;
//     phytoVertices.push(
//       r * Math.sin(phi) * Math.cos(theta),
//       r * Math.sin(phi) * Math.sin(theta),
//       r * Math.cos(phi)
//     );
//   }
//   phytoplanktonGeometry.setAttribute("position", new THREE.Float32BufferAttribute(phytoVertices, 3));

//   const phytoplanktonMaterial = new THREE.PointsMaterial({
//     color: 0x00ff88,
//     size: 0.01,
//     transparent: true,
//     opacity: 0.7,
//     blending: THREE.AdditiveBlending
//   });
//   const phytoplankton = new THREE.Points(phytoplanktonGeometry, phytoplanktonMaterial);
//   scene.add(phytoplankton);

//   // Return flattened for easy access & animation
//   return {
//     waves,
//     microplastics,
//     microplasticsMaterial,
//     coralReef,
//     phytoplankton,
//     phytoplanktonMaterial
//   };
// }
export function createOceanElements(scene: THREE.Scene) {
  const oceanGroup = new THREE.Group();
  scene.add(oceanGroup);

  // Enhanced Waves with varying sizes and animation properties
  const waves = new THREE.Group();
  const waveCount = 25;
  
  for (let i = 0; i < waveCount; i++) {
    const radius = 1.15 + i * 0.03;
    const thickness = 0.001 + (i * 0.0001);
    const waveGeometry = new THREE.TorusGeometry(radius, thickness, 6, 128);
    
    const waveMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.6, 0.8, 0.5 + i * 0.02),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    wave.rotation.x = Math.PI / 2;
    wave.userData = {
      speed: 0.2 + Math.random() * 0.3,
      amplitude: 0.002 + Math.random() * 0.003,
      phase: Math.random() * Math.PI * 2,
      originalRadius: radius
    };
    waves.add(wave);
  }
  oceanGroup.add(waves);

  // Microplastics with varied colors and sizes
  const microplasticsGeometry = new THREE.BufferGeometry();
  const microVertices = [];
  const microColors = [];
  const microSizes = [];
  const microplasticCount = 5000;

  const microplasticColors = [
    0xff3333, // Red
    0xff9933, // Orange
    0xffff33, // Yellow
    0x33ff33, // Green
    0x3399ff, // Blue
    0x9933ff  // Purple
  ];

  for (let i = 0; i < microplasticCount; i++) {
    // More realistic distribution - concentrated near the surface
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.18 + Math.random() * 0.05; // Mostly near surface
    
    microVertices.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );

    // Random color from palette
    const colorIndex = Math.floor(Math.random() * microplasticColors.length);
    const color = new THREE.Color(microplasticColors[colorIndex]);
    microColors.push(color.r, color.g, color.b);

    // Varied sizes
    microSizes.push(0.008 + Math.random() * 0.02);
  }

  microplasticsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(microVertices, 3));
  microplasticsGeometry.setAttribute("color", new THREE.Float32BufferAttribute(microColors, 3));
  microplasticsGeometry.setAttribute("size", new THREE.Float32BufferAttribute(microSizes, 1));

  const microplasticsMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.01,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  const microplastics = new THREE.Points(microplasticsGeometry, microplasticsMaterial);
  oceanGroup.add(microplastics);

  // Enhanced Coral Reef with varied coral types
  const coralReef = new THREE.Group();
  const coralCount = 80;

  const coralTypes = [
    { geometry: () => new THREE.ConeGeometry(0.008, 0.06, 5), color: 0xff6b6b }, // Branching coral
    { geometry: () => new THREE.ConeGeometry(0.012, 0.04, 6), color: 0xff8e8e }, // Boulder coral
    { geometry: () => new THREE.CylinderGeometry(0.005, 0.01, 0.08, 4), color: 0xff5252 }, // Tube coral
    { geometry: () => new THREE.SphereGeometry(0.015, 6, 4), color: 0xff7b7b }, // Brain coral
    { geometry: () => new THREE.BoxGeometry(0.02, 0.03, 0.02), color: 0xff4444 } // Plate coral
  ];

  for (let i = 0; i < coralCount; i++) {
    const coralType = coralTypes[Math.floor(Math.random() * coralTypes.length)];
    const coralGeometry = coralType.geometry();
    const coralMaterial = new THREE.MeshBasicMaterial({
      color: coralType.color,
      transparent: true,
      opacity: 0
    });

    const coral = new THREE.Mesh(coralGeometry, coralMaterial);
    
    // Position on ocean floor (southern hemisphere)
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.PI * 0.6 + (Math.random() * 0.3); // Bottom half of sphere
    const radius = 1.19;
    
    coral.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );

    // Random rotation and scale for variety
    coral.rotation.x = (Math.random() - 0.5) * 0.5;
    coral.rotation.y = Math.random() * Math.PI * 2;
    coral.rotation.z = (Math.random() - 0.5) * 0.5;
    coral.scale.setScalar(0.8 + Math.random() * 0.6);

    coral.lookAt(0, 0, 0);
    coralReef.add(coral);
  }
  oceanGroup.add(coralReef);

  // Enhanced Phytoplankton with bloom effect capability
  const phytoplanktonGeometry = new THREE.BufferGeometry();
  const phytoVertices = [];
  const phytoColors = [];
  const phytoSizes = [];
  const phytoplanktonCount = 6000;

  for (let i = 0; i < phytoplanktonCount; i++) {
    // Phytoplankton mostly in upper ocean layers
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(1 - Math.random() * 0.7); // Concentrate in upper 70%
    const r = 1.195 + Math.random() * 0.03;
    
    phytoVertices.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );

    // Varied green colors for different phytoplankton species
    const hue = 0.3 + Math.random() * 0.2; // Green to yellow-green
    const saturation = 0.6 + Math.random() * 0.3;
    const lightness = 0.4 + Math.random() * 0.3;
    const color = new THREE.Color().setHSL(hue, saturation, lightness);
    phytoColors.push(color.r, color.g, color.b);

    // Varied sizes
    phytoSizes.push(0.006 + Math.random() * 0.01);
  }

  phytoplanktonGeometry.setAttribute("position", new THREE.Float32BufferAttribute(phytoVertices, 3));
  phytoplanktonGeometry.setAttribute("color", new THREE.Float32BufferAttribute(phytoColors, 3));
  phytoplanktonGeometry.setAttribute("size", new THREE.Float32BufferAttribute(phytoSizes, 1));

  const phytoplanktonMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.008,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  const phytoplankton = new THREE.Points(phytoplanktonGeometry, phytoplanktonMaterial);
  oceanGroup.add(phytoplankton);

  // Additional Ocean Elements

  // Ocean Currents - flowing lines
  const currentsGeometry = new THREE.BufferGeometry();
  const currentVertices = [];
  const currentCount = 8;

  for (let i = 0; i < currentCount; i++) {
    const theta = (i / currentCount) * Math.PI * 2;
    const segments = 20;
    
    for (let j = 0; j <= segments; j++) {
      const phi = Math.PI / 2 + (j / segments - 0.5) * 1.5;
      const r = 1.17 + Math.sin(j * 0.3) * 0.02;
      
      currentVertices.push(
        r * Math.sin(phi) * Math.cos(theta + j * 0.1),
        r * Math.sin(phi) * Math.sin(theta + j * 0.1),
        r * Math.cos(phi)
      );
    }
  }

  currentsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(currentVertices, 3));
  
  const currentsMaterial = new THREE.LineBasicMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    linewidth: 1
  });

  const currents = new THREE.Line(currentsGeometry, currentsMaterial);
  oceanGroup.add(currents);

  // Air Bubbles - rising from ocean floor
  const bubblesGeometry = new THREE.BufferGeometry();
  const bubbleVertices = [];
  const bubbleSizes = [];
  const bubbleCount = 200;

  for (let i = 0; i < bubbleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.PI * 0.7 + Math.random() * 0.3; // Ocean floor
    const r = 1.18;
    
    bubbleVertices.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );

    bubbleSizes.push(0.003 + Math.random() * 0.005);
  }

  bubblesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(bubbleVertices, 3));
  bubblesGeometry.setAttribute("size", new THREE.Float32BufferAttribute(bubbleSizes, 1));

  const bubblesMaterial = new THREE.PointsMaterial({
    color: 0x88ffff,
    size: 0.004,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  const bubbles = new THREE.Points(bubblesGeometry, bubblesMaterial);
  oceanGroup.add(bubbles);

  return {
    oceanGroup,
    waves,
    microplastics,
    microplasticsMaterial,
    coralReef,
    phytoplankton,
    phytoplanktonMaterial,
    currents,
    currentsMaterial,
    bubbles,
    bubblesMaterial,
    
    // Animation properties
    animateWaves: (time: number) => {
      waves.children.forEach((wave, index) => {
        const mesh = wave as THREE.Mesh;
        const userData = mesh.userData;
        const scale = 1 + Math.sin(time * userData.speed + userData.phase) * userData.amplitude;
        mesh.scale.set(scale, scale, scale);
        
        // Pulsating opacity
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.3 + Math.sin(time * userData.speed * 2 + userData.phase) * 0.2;
      });
    },
    
    animateBubbles: (time: number) => {
      const positions = bubblesGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < bubbleCount; i++) {
        const index = i * 3;
        // Bubbles rise and wobble slightly
        positions[index + 1] += Math.sin(time + i) * 0.0001; // Wobble
        positions[index + 2] -= 0.0002; // Rise
        
        // Reset bubbles that rise too high
        if (positions[index + 2] < -1.1) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.PI * 0.7 + Math.random() * 0.3;
          positions[index] = 1.18 * Math.sin(phi) * Math.cos(theta);
          positions[index + 1] = 1.18 * Math.sin(phi) * Math.sin(theta);
          positions[index + 2] = 1.18 * Math.cos(phi);
        }
      }
      bubblesGeometry.attributes.position.needsUpdate = true;
    },
    
    animateCurrents: (time: number) => {
      currents.rotation.y += 0.0001;
      const material = currentsMaterial;
      material.opacity = 0.2 + Math.sin(time * 0.5) * 0.1;
    }
  };
}